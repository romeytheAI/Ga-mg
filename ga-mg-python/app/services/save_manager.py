from app.models.player import Player

class SaveManager:
    def save_game(self, player: Player):
        pass

    def load_game(self, player_id: str) -> Player:
        return Player(id=player_id, name="Hero", gender="F")
