locations_data = [
    {
        "id": "tavern",
        "name": "The Rusty Nail Tavern",
        "description": "A dimly lit tavern with the smell of stale ale.",
        "region": "Harbor District",
        "danger_level": 2,
        "connected_locations": ["street", "dock"],
        "present_npcs": ["bartender", "drunkard"],
        "actions": ["drink", "talk", "gamble"],
        "ambient_tags": ["noisy", "smoky"],
        "dialogue_tags": ["gossip", "quest"],
        "story_hooks": ["Mysterious stranger seeks help"],
        "encounter_tables": {
            "day": [{"type": "bar_fight", "weight": 0.1}],
            "night": [{"type": "thief", "weight": 0.2}]
        }
    },
    # ... 29 more
]

def get_locations():
    return locations_data

def get_location_by_id(location_id: str):
    for loc in locations_data:
        if loc["id"] == location_id:
            return loc
    return None
