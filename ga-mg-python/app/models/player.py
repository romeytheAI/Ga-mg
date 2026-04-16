from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class Player(BaseModel):
    # Identity
    id: str
    name: str
    gender: str
    age_days: int = 0

    # Core Stats
    health: int = 100
    max_health: int = 100
    lust: int = 0
    willpower: int = 100
    corruption: int = 0
    stress: int = 0
    fatigue: int = 0

    # Skills
    skills: Dict[str, int] = Field(default_factory=dict)

    # Resources
    gold: int = 0
    fame: int = 0
    notoriety: int = 0

    # Psychology
    psych_profile: Dict[str, float] = Field(default_factory=dict)
    attitudes: Dict[str, str] = Field(default_factory=dict)
    sensitivity: Dict[str, int] = Field(default_factory=dict)

    # Lewdity Stats
    sexual_skills: Dict[str, int] = Field(default_factory=dict)
    virginities: Dict[str, bool] = Field(default_factory=dict)
    body_fluids: Dict[str, int] = Field(default_factory=dict)
    lewdity_stats: Dict[str, int] = Field(default_factory=dict)

    # Traits & Feats
    traits: List[str] = Field(default_factory=list)
    feats: List[str] = Field(default_factory=list)

    # Afflictions
    afflictions: List[Dict[str, Any]] = Field(default_factory=list)

    # Clothing & Inventory
    clothing: Dict[str, Any] = Field(default_factory=dict)
    inventory: List[Dict[str, Any]] = Field(default_factory=list)

    # Anatomy
    anatomy: Dict[str, Any] = Field(default_factory=dict)

    # Social
    companions: List[str] = Field(default_factory=list)
    relationships: Dict[str, int] = Field(default_factory=dict)  # npc_id -> reputation

    # Quests
    quests: List[Dict[str, Any]] = Field(default_factory=list)

    # Preferences (used by background generation)
    favorite_character_id: Optional[str] = None
    favorite_npc_ids: List[str] = Field(default_factory=list)
    favorite_location_ids: List[str] = Field(default_factory=list)
    dialogue_tone_preferences: Dict[str, str] = Field(default_factory=dict)
    content_focus_preferences: Dict[str, int] = Field(default_factory=dict)

    # Misc
    avatar_url: Optional[str] = None
    base: Dict[str, Any] = Field(default_factory=dict)
    subconscious: Dict[str, Any] = Field(default_factory=dict)
    biology: Dict[str, Any] = Field(default_factory=dict)
    status_effects: List[Dict[str, Any]] = Field(default_factory=dict)
    life_sim: Dict[str, Any] = Field(default_factory=dict)

    def to_json(self) -> str:
        return self.model_dump_json()

    @classmethod
    def from_json(cls, json_str: str) -> "Player":
        return cls.model_validate_json(json_str)
