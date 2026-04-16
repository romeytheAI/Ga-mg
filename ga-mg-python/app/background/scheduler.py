import asyncio
from app.background.worker import BackgroundWorker

worker = BackgroundWorker()

async def start_background_tasks():
    await worker.start()

async def stop_background_tasks():
    worker.running = False
