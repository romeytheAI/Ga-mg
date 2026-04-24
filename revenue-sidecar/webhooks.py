"""
Monetization Webhook Handler
Listens for revenue events from Stripe, PayPal, GitHub Sponsors
"""

from fastapi import APIRouter, Header, HTTPException, Request
from typing import Optional
import hmac
import os
import hashlib
import json
import logging

logger = logging.getLogger("webhooks")

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

# ==================== Stripe Webhook ====================

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature")
):
    """
    Handle Stripe webhook events
    Tracks payments, subscriptions, and charges
    """
    try:
        payload = await request.body()
        event = json.loads(payload)

        # Verify signature (in production, use actual secret)
        secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if not secret:
            logger.error("Missing STRIPE_WEBHOOK_SECRET")
            raise HTTPException(status_code=500, detail="Server misconfiguration")
        if not stripe_signature:
            raise HTTPException(status_code=401, detail="Unauthorized")
        verify_stripe_signature(payload, stripe_signature, secret)

        event_type = event.get("type")
        logger.info(f"Stripe event received: {event_type}")

        if event_type == "charge.succeeded":
            # Payment successful
            amount = event["data"]["object"]["amount"] / 100  # Convert cents to dollars
            currency = event["data"]["object"]["currency"]
            logger.info(f"Payment received: {amount} {currency}")

            # Track revenue
            from main import state
            state.update_metrics(revenue=amount)

            return {"status": "success", "message": "Payment processed"}

        elif event_type == "subscription.created":
            # New subscription
            plan_id = event["data"]["object"]["plan"]["id"]
            amount = event["data"]["object"]["plan"]["amount"] / 100
            logger.info(f"New subscription: {plan_id}, ${amount}/month")

            return {"status": "success", "message": "Subscription created"}

        return {"status": "ignored", "message": f"Event type {event_type} not handled"}

    except Exception as e:
        logger.error(f"Stripe webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== PayPal Webhook ====================

@router.post("/paypal")
async def paypal_webhook(request: Request):
    """
    Handle PayPal webhook events
    IPN (Instant Payment Notification)
    """
    try:
        payload = await request.body()
        data = json.loads(payload)

        event_type = data.get("event_type")
        logger.info(f"PayPal event received: {event_type}")

        if event_type == "PAYMENT.CAPTURE.COMPLETED":
            # Payment captured
            amount = float(data["resource"]["amount"]["value"])
            currency = data["resource"]["amount"]["currency_code"]
            logger.info(f"PayPal payment: {amount} {currency}")

            # Track revenue
            from main import state
            state.update_metrics(revenue=amount)

            return {"status": "success"}

        return {"status": "ignored"}

    except Exception as e:
        logger.error(f"PayPal webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== GitHub Sponsors Webhook ====================

@router.post("/github-sponsors")
async def github_sponsors_webhook(
    request: Request,
    x_hub_signature_256: Optional[str] = Header(None)
):
    """
    Handle GitHub Sponsors webhook events
    Tracks sponsorship payments
    """
    try:
        payload = await request.body()
        event = json.loads(payload)

        # Verify signature (in production)
        secret = os.getenv("GITHUB_WEBHOOK_SECRET")
        if not secret:
            logger.error("Missing GITHUB_WEBHOOK_SECRET")
            raise HTTPException(status_code=500, detail="Server misconfiguration")
        if not x_hub_signature_256:
            raise HTTPException(status_code=401, detail="Unauthorized")
        verify_github_signature(payload, x_hub_signature_256, secret)

        action = event.get("action")
        logger.info(f"GitHub Sponsors event: {action}")

        if action == "created":
            # New sponsorship
            tier = event["sponsorship"]["tier"]["monthly_price_in_dollars"]
            sponsor = event["sponsorship"]["sponsor"]["login"]
            logger.info(f"New sponsor: {sponsor} at ${tier}/month")

            # Track revenue (monthly)
            from main import state
            state.update_metrics(revenue=tier)

            return {"status": "success", "message": "Sponsorship processed"}

        elif action == "cancelled":
            # Sponsorship cancelled
            logger.info("Sponsorship cancelled")
            return {"status": "success", "message": "Cancellation noted"}

        return {"status": "ignored"}

    except Exception as e:
        logger.error(f"GitHub webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Ad Revenue Webhook ====================

@router.post("/ad-revenue")
async def ad_revenue_webhook(request: Request, authorization: Optional[str] = Header(None)):
    """
    Track ad revenue from content platforms
    YouTube AdSense, TikTok Creator Fund, etc.
    """
    try:
        # Verify authorization token
        api_key = os.getenv("SIDE_CAR_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Server misconfiguration")
        if not authorization or not hmac.compare_digest(authorization.encode('utf-8'), f"Bearer {api_key}".encode('utf-8')):
            raise HTTPException(status_code=401, detail="Unauthorized")

        payload = await request.json()

        platform = payload.get("platform")  # youtube, tiktok, instagram
        amount = payload.get("amount")
        period = payload.get("period")  # daily, weekly, monthly

        logger.info(f"Ad revenue from {platform}: ${amount} ({period})")

        # Track revenue
        from main import state
        state.update_metrics(revenue=amount)

        return {"status": "success", "message": "Revenue tracked"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ad revenue webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Affiliate Revenue Webhook ====================

@router.post("/affiliate")
async def affiliate_webhook(request: Request, authorization: Optional[str] = Header(None)):
    """
    Track affiliate commission from links in content
    Amazon Associates, game affiliate programs, etc.
    """
    try:
        # Verify authorization token
        api_key = os.getenv("SIDE_CAR_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Server misconfiguration")
        if not authorization or not hmac.compare_digest(authorization.encode('utf-8'), f"Bearer {api_key}".encode('utf-8')):
            raise HTTPException(status_code=401, detail="Unauthorized")

        payload = await request.json()

        program = payload.get("program")  # amazon, steam, epic_games
        commission = payload.get("commission")
        product = payload.get("product")

        logger.info(f"Affiliate commission: ${commission} from {program} ({product})")

        # Track revenue
        from main import state
        state.update_metrics(revenue=commission)

        return {"status": "success", "message": "Commission tracked"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Affiliate webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Signature Verification ====================

def verify_stripe_signature(payload: bytes, signature: str, secret: str):
    """Verify Stripe webhook signature"""
    expected_sig = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    # Extract signature from header
    sig_parts = signature.split(",")
    for part in sig_parts:
        if part.startswith("v1="):
            received_sig = part[3:]
            if not hmac.compare_digest(expected_sig.encode('utf-8'), received_sig.encode('utf-8')):
                raise HTTPException(status_code=400, detail="Invalid signature")
            return

    raise HTTPException(status_code=400, detail="No valid signature found")

def verify_github_signature(payload: bytes, signature: str, secret: str):
    """Verify GitHub webhook signature"""
    expected_sig = "sha256=" + hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_sig.encode('utf-8'), signature.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid signature")
