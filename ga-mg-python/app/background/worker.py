import asyncio
from datetime import datetime
from app.background.job_queue import DialogueGenerationJob, JobStatus
from app.services.dialogue_generation import DialogueGenerationService
from app.db import AsyncSessionLocal
from sqlalchemy import select

class BackgroundWorker:
    def __init__(self, interval: int = 5):
        self.interval = interval
        self.running = False

    async def start(self):
        self.running = True
        asyncio.create_task(self._run())

    async def _run(self):
        while self.running:
            await asyncio.sleep(self.interval)
            await self._process_next_job()

    async def _process_next_job(self):
        async with AsyncSessionLocal() as session:
            # Get highest priority pending job
            stmt = select(DialogueGenerationJob).where(
                DialogueGenerationJob.status == JobStatus.PENDING.value
            ).order_by(DialogueGenerationJob.priority.desc()).limit(1)
            result = await session.execute(stmt)
            job = result.scalar_one_or_none()
            if job:
                job.status = JobStatus.RUNNING.value
                job.started_at = datetime.utcnow()
                await session.commit()

                # Execute job
                try:
                    service = DialogueGenerationService()
                    if job.job_type == "location":
                        generated = await service.generate_location_dialogue(job.target_id)
                    elif job.job_type == "npc":
                        generated = await service.generate_npc_dialogue(job.target_id)
                    else:
                        generated = await service.generate_ambient_dialogue()
                    job.result = generated
                    job.status = JobStatus.COMPLETED.value
                except Exception as e:
                    job.error = str(e)
                    job.status = JobStatus.FAILED.value
                    job.retry_count += 1
                job.completed_at = datetime.utcnow()
                await session.commit()
