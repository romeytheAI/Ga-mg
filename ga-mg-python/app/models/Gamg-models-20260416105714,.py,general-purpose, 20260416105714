from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class DialogueEntry(BaseModel):
    id: str
    speaker: str  # "npc_id" or "ambient" or "narrator"
    text: str
    conditions: Dict[str, Any]  # e.g., {"reputation": {">=": 50}}
    category: str  # greetings, gossip, quest, etc.
    triggers: Optional[Dict[str, Any]] = None
    mood: str  # "happy", "angry", etc.
    weight: float = 1.0
    source: str = "authored"  # "authored" or "generated"
    generated_for_profile: Optional[str] = None
    location_id: Optional[str] = None
    npc_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
