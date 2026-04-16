from app.models.combat import Encounter
from app.systems.combat import resolve_encounter

def test_combat_resolve_encounter_flee_success(monkeypatch):
    encounter = Encounter(id="1", enemy={"name": "Goblin"}, player_state={})

    import random
    monkeypatch.setattr(random, "random", lambda: 0.1) # always succeed

    updated_encounter, narrative = resolve_encounter(encounter, "flee")

    assert "You manage to escape" in narrative
    assert updated_encounter.outcome == "escaped"
