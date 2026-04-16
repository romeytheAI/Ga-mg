from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ActionRequest(BaseModel):
    action: str
    target: str = None

@router.post("/action")
async def perform_action(req: ActionRequest):
    return {"status": "ok", "action": req.action, "narrative": f"You performed {req.action}"}

@router.get("/status")
async def get_status():
    return {"status": "ok", "health": 100}
