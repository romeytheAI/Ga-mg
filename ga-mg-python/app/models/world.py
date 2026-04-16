from pydantic import BaseModel
from typing import Dict, Any, List

class WorldState(BaseModel):
    economy: Dict[str, Any] = {}
    ecology: Dict[str, Any] = {}
    factions: Dict[str, Any] = {}
    npc_state: Dict[str, Any] = {}
    meta_events: List[str] = []
    settlement: Dict[str, Any] = {}
    ambient: Dict[str, Any] = {}
    arcane: Dict[str, Any] = {}
    justice: Dict[str, Any] = {}
    dreamscape: Dict[str, Any] = {}
