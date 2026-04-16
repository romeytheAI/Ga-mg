import httpx
import asyncio
from app.config import get_settings

settings = get_settings()

async def generate_text(prompt: str, model: str = "gpt-3.5-turbo") -> str:
    # Try AI Horde first
    if settings.ai_horde_api_key:
        try:
            # This is a simplified version; actual API calls need more handling
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://aihorde.net/api/v2/generate/text",
                    json={"prompt": prompt, "params": {"model": model}},
                    headers={"apikey": settings.ai_horde_api_key},
                    timeout=30.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("text", "")
        except Exception:
            pass

    # Fallback to Pollinations
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://text.pollinations.ai/",
                json={"prompt": prompt},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.text
    except Exception:
        pass

    # Ultimate fallback: template
    return f"[Generated text: {prompt[:50]}...]"
