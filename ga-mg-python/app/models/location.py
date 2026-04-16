from pydantic import BaseModel
from typing import List, Dict, Optional

class Location(BaseModel):
    id: str
    name: str
    description: str
    region: str
    danger_level: int  # 1-10
    connected_locations: List[str]
    present_npcs: List[str]
    time_of_day_variants: Dict[str, str] = {}
    weather_variants: Dict[str, str] = {}
    actions: List[str] = []
    ambient_tags: List[str] = []
    dialogue_tags: List[str] = []
    story_hooks: List[str] = []
    encounter_tables: Dict[str, List[Dict]] = {}
