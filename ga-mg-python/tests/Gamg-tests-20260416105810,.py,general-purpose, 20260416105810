from app.models.player import Player
from app.models.world import WorldState
from app.systems.simulation import simulate_time

def test_simulate_time():
    player = Player(id="1", name="Test", gender="M")
    world = WorldState()

    updated_player, updated_world = simulate_time(player, world, 1)

    assert updated_player.id == "1"
