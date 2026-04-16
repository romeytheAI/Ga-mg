from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.api import router as api_router
from app.routes.pages import router as pages_router
from app.background.scheduler import start_background_tasks, stop_background_tasks

app = FastAPI(title="Ga-mg Python")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.on_event("startup")
async def startup_event():
    await start_background_tasks()

@app.on_event("shutdown")
async def shutdown_event():
    await stop_background_tasks()

app.include_router(pages_router)
app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}
