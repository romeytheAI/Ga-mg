from typing import Tuple
from app.models.combat import Encounter
from app.models.player import Player
import random

def resolve_encounter(encounter: Encounter, action: str) -> Tuple[Encounter, str]:
    """
    Process player's chosen action in combat.
    Returns updated encounter and narrative.
    """
    narrative = ""
    # Example: "flee"
    if action == "flee":
        success = random.random() < 0.5  # based on speed skill
        if success:
            narrative = "You manage to escape!"
            encounter.outcome = "escaped"
        else:
            damage = random.randint(5, 15)
            encounter.stat_changes["health"] = -damage
            narrative = f"You try to flee but are struck for {damage} damage."
    # ... handle other actions

    # Enemy attacks back
    if encounter.outcome is None:
        # simple enemy AI
        enemy_action = random.choice(["attack", "taunt"])
        if enemy_action == "attack":
            damage = random.randint(5, 10)
            encounter.stat_changes["health"] = -damage
            narrative += f" The enemy attacks, dealing {damage} damage."

    return encounter, narrative
