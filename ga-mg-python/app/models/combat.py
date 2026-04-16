from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class Encounter(BaseModel):
    id: str
    enemy: Dict[str, Any]  # could be NPC or creature
    player_state: Dict[str, Any]  # snapshot at start
    options: List[str] = ["flee", "resist", "endure", "cry_out", "seduce", "submit"]
    outcome: Optional[str] = None
    narrative: Optional[str] = None
    stat_changes: Dict[str, int] = {}
