from typing import Tuple
from app.models.player import Player
from app.models.world import WorldState
from app.systems.simulation import simulate_time

def process_action(player: Player, world: WorldState, action: str, target: str = None) -> Tuple[Player, WorldState, str]:
    narrative = ""

    # Basic action handling
    if action == "move":
        # change location, check for encounters, etc.
        pass
    elif action == "talk":
        # dialogue selection
        pass
    elif action == "rest":
        player.health = min(player.max_health, player.health + 10)
        narrative = "You rest and recover some health."
    elif action == "train":
        # improve skill
        pass
    # ... many more

    # Time advances
    player, world = simulate_time(player, world)

    return player, world, narrative
