from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.models.player import Player

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/game", response_class=HTMLResponse)
async def game(request: Request):
    player = Player(id="1", name="Hero", gender="F")
    return templates.TemplateResponse("game.html", {
        "request": request,
        "player": player,
        "narrative": "You stand in a dimly lit tavern."
    })
