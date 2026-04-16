from pydantic import BaseModel
from typing import List, Dict, Optional

class NPC(BaseModel):
    id: str
    name: str
    description: str
    personality: Dict[str, float]  # traits: aggressive, shy, etc.
    location: str
    relationship_with_player: int = 0  # -100 to 100
    corruption: int = 0
    attitude: str = "neutral"
    # More fields as needed
