"""
Automated Reinvestment System
Monitors balance and triggers API credit purchases when needed
"""

import asyncio
import logging
from typing import Dict, Any
from datetime import datetime
import os

logger = logging.getLogger("reinvestment")

class ReinvestmentEngine:
    """
    Manages automated credit purchasing and resource scaling
    Implements the Code-as-Economy feedback loop
    """

    def __init__(self):
        self.monitoring = False
        self.check_interval = 3600  # Check every hour
        self.buffer_ratio = 0.20  # 20% buffer over projected costs

    async def monitor_balance(self):
        """
        Continuously monitor balance and trigger purchases
        """
        logger.info("Reinvestment monitoring started")
        self.monitoring = True

        while self.monitoring:
            try:
                from main import state

                metrics = state.revenue_metrics

                # Calculate if purchase needed
                if self.should_purchase_credits(metrics):
                    await self.purchase_api_credits(metrics)

                # Check if we should scale up (Evolution Mode)
                if self.should_scale_up(metrics):
                    await self.scale_content_generation(metrics)

                # Sleep before next check
                await asyncio.sleep(self.check_interval)

            except Exception as e:
                logger.error(f"Monitoring error: {str(e)}")
                await asyncio.sleep(60)  # Retry after 1 minute on error

    def should_purchase_credits(self, metrics) -> bool:
        """
        Determine if API credits should be purchased
        """
        # Calculate projected monthly burn
        projected_burn = metrics.total_costs * 30  # Rough estimate

        # Calculate available balance with buffer
        required_balance = projected_burn * (1 + self.buffer_ratio)

        # Purchase if balance exceeds required amount
        should_purchase = metrics.net_balance >= required_balance > 0

        if should_purchase:
            logger.info(
                f"Credit purchase triggered: Balance ${metrics.net_balance:.2f} "
                f"exceeds required ${required_balance:.2f}"
            )

        return should_purchase

    def should_scale_up(self, metrics) -> bool:
        """
        Determine if content generation should be scaled up
        Evolution Mode: R > C
        """
        if metrics.total_revenue <= 0 or metrics.total_costs <= 0:
            return False

        # Check if in Evolution Mode (revenue > costs)
        revenue_ratio = metrics.total_revenue / metrics.total_costs

        if revenue_ratio > 1.5:  # 50% surplus
            logger.info(
                f"Evolution Mode active: Revenue ratio {revenue_ratio:.2f}x"
            )
            return True

        return False

    async def purchase_api_credits(self, metrics):
        """
        Automatically purchase API credits
        Integrates with OpenAI, Azure, etc.
        """
        logger.info("Initiating automated credit purchase")

        purchase_amount = metrics.net_balance * 0.3  # Use 30% of surplus

        try:
            # OpenAI credit purchase
            await self.purchase_openai_credits(purchase_amount * 0.5)

            # Azure credit purchase
            await self.purchase_azure_credits(purchase_amount * 0.3)

            # Reserve remaining for future
            logger.info(f"Credits purchased: ${purchase_amount:.2f}")

            # Update metrics
            from main import state
            state.update_metrics(cost=purchase_amount)

            # Log transaction
            await self.log_transaction({
                "type": "credit_purchase",
                "amount": purchase_amount,
                "timestamp": datetime.now().isoformat(),
                "balance_before": metrics.net_balance,
                "balance_after": metrics.net_balance - purchase_amount
            })

        except Exception as e:
            logger.error(f"Credit purchase failed: {str(e)}")

    async def purchase_openai_credits(self, amount: float):
        """
        Purchase OpenAI API credits
        """
        logger.info(f"Purchasing ${amount:.2f} OpenAI credits")

        # In production:
        # - Use OpenAI billing API
        # - Or integrate with payment processor
        # - Update organization billing

        # Mock implementation
        await asyncio.sleep(1)
        logger.info("OpenAI credits purchased (simulated)")

    async def purchase_azure_credits(self, amount: float):
        """
        Purchase Azure API credits
        """
        logger.info(f"Purchasing ${amount:.2f} Azure credits")

        # In production:
        # - Use Azure Billing API
        # - Manage subscription quotas
        # - Update resource limits

        # Mock implementation
        await asyncio.sleep(1)
        logger.info("Azure credits purchased (simulated)")

    async def scale_content_generation(self, metrics):
        """
        Scale up content generation capacity
        Evolution Mode: Allocate surplus to growth
        """
        logger.info("Scaling up content generation (Evolution Mode)")

        surplus = metrics.net_balance

        # Allocate 70% of surplus to scaling
        scaling_budget = surplus * 0.7

        # Calculate how many more content pieces we can generate
        cost_per_content = 0.05  # Estimated cost
        additional_content = int(scaling_budget / cost_per_content)

        logger.info(
            f"Scaling budget: ${scaling_budget:.2f}, "
            f"Target: {additional_content} additional content pieces"
        )

        # In production:
        # - Spin up additional worker instances
        # - Queue more content generation jobs
        # - Increase API rate limits
        # - Purchase spot instances on cloud

        try:
            # Queue batch content generation
            from main import ContentPipeline, ContentRequest

            niches = ["gaming", "technology", "ai", "rpg"]

            for i in range(min(additional_content, 10)):  # Limit batch size
                request = ContentRequest(
                    niche=niches[i % len(niches)],
                    platform="tiktok",
                    duration_seconds=60
                )

                # Queue generation (mock)
                logger.info(f"Queued content generation: niche={request.niche}")

            logger.info("Content generation scaled successfully")

        except Exception as e:
            logger.error(f"Scaling failed: {str(e)}")

    async def log_transaction(self, transaction: Dict[str, Any]):
        """
        Log financial transactions for audit trail
        """
        log_entry = {
            **transaction,
            "timestamp": datetime.now().isoformat()
        }

        # In production: Store in database or file
        logger.info(f"Transaction logged: {log_entry}")

    def stop_monitoring(self):
        """Stop the monitoring loop"""
        logger.info("Stopping reinvestment monitoring")
        self.monitoring = False

# ==================== State Analysis ====================

class StateAnalyzer:
    """
    Analyzes system state and determines operational mode
    Implements the Code-as-Economy behavioral branching
    """

    @staticmethod
    def calculate_costs_and_revenue(metrics):
        """
        Calculate C (costs) and R (revenue)
        """
        C = metrics.total_costs  # Token_Cost + Compute_Cost
        R = metrics.total_revenue  # Ad_Revenue + Affiliate_Yield

        return C, R

    @staticmethod
    def determine_mode(metrics) -> str:
        """
        Determine operational mode based on C and R
        Returns: "survival" or "evolution"
        """
        C, R = StateAnalyzer.calculate_costs_and_revenue(metrics)

        if R < C:
            return "survival"
        else:
            return "evolution"

    @staticmethod
    async def enter_survival_mode():
        """
        SURVIVAL MODE: R < C
        - Optimize all code for efficiency
        - Suspend non-critical UI features
        - Shift 90% compute to revenue generation
        """
        logger.warning("🚨 ENTERING SURVIVAL MODE: R < C")

        # 1. Reduce API calls
        logger.info("→ Reducing API call frequency")

        # 2. Optimize prompts more aggressively
        logger.info("→ Increasing semantic optimization threshold")

        # 3. Focus on revenue generation
        logger.info("→ Allocating 90% compute to Huberty Sidecar")

        # 4. Suspend non-critical features
        logger.info("→ Disabling optional UI features")

        # In production:
        # - Disable expensive features (image gen, complex AI)
        # - Use cheaper model alternatives
        # - Increase content output frequency
        # - Focus on high-ROI content niches

        from main import state
        state.revenue_metrics.survival_mode = True

    @staticmethod
    async def enter_evolution_mode(metrics):
        """
        EVOLUTION MODE: R > C
        - Allocate 30% surplus to R&D (new features)
        - Allocate 70% surplus to scaling (exponential growth)
        """
        logger.info("✨ ENTERING EVOLUTION MODE: R > C")

        surplus = metrics.net_balance

        # 1. R&D allocation (30%)
        rd_budget = surplus * 0.30
        logger.info(f"→ R&D Budget: ${rd_budget:.2f} for new features")

        # 2. Scaling allocation (70%)
        scaling_budget = surplus * 0.70
        logger.info(f"→ Scaling Budget: ${scaling_budget:.2f} for growth")

        # In production:
        # - Implement new game features
        # - Experiment with new content formats
        # - Scale to more platforms
        # - Invest in better AI models

        from main import state
        state.revenue_metrics.survival_mode = False

# ==================== Global Reinvestment Engine ====================

reinvestment_engine = ReinvestmentEngine()
state_analyzer = StateAnalyzer()
