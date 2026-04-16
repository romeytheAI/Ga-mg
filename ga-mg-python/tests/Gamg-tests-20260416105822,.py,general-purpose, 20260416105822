import pytest
import json
from app.services.dialogue_generation import DialogueGenerationService
from app.data.locations import locations_data

@pytest.mark.asyncio
async def test_generate_location_dialogue(monkeypatch):
    service = DialogueGenerationService()

    async def mock_generate_text(prompt, model="gpt-3.5-turbo"):
        return "Hello there!"

    import app.services.dialogue_generation
    monkeypatch.setattr(app.services.dialogue_generation, "generate_text", mock_generate_text)

    result = await service.generate_location_dialogue("tavern")
    data = json.loads(result)

    assert data[0]["text"] == "Hello there!"
