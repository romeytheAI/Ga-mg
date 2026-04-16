import json
from app.services.ai_text import generate_text
from app.data.locations import get_location_by_id
from app.data.npcs import get_npc_by_id
from app.models.dialogue import DialogueEntry
from app.services.dialogue_cache import save_dialogue_entry

class DialogueGenerationService:
    async def generate_location_dialogue(self, location_id: str) -> str:
        location = get_location_by_id(location_id)
        # Build prompt based on location info and current world state
        prompt = f"Generate dialogue for people at {location['name']}." if location else "Generate generic dialogue."
        result = await generate_text(prompt)
        return json.dumps([{"text": result}])

    async def generate_npc_dialogue(self, npc_id: str) -> str:
        npc = get_npc_by_id(npc_id)
        prompt = f"Generate dialogue for {npc['name']}." if npc else "Generate generic dialogue."
        result = await generate_text(prompt)
        return json.dumps([{"text": result}])

    async def generate_ambient_dialogue(self) -> str:
        result = await generate_text("Generate ambient dialogue for the world.")
        return json.dumps([{"text": result}])
