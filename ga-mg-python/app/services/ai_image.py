async def generate_image(prompt: str) -> str:
    # Try Pollinations
    try:
        # Pollinations returns image URL directly
        return f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}"
    except Exception:
        pass

    # Placeholder
    return "/static/images/placeholder.png"
