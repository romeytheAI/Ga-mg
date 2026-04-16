from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import AsyncSessionLocal, Base
import asyncio
import uuid
from datetime import datetime
from enum import Enum

class JobStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class DialogueGenerationJob(Base):
    __tablename__ = "dialogue_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_type = Column(String)  # "location", "npc", "ambient"
    target_id = Column(String)  # location_id or npc_id
    priority = Column(Integer)  # higher is more important
    status = Column(String, default=JobStatus.PENDING.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    result = Column(Text, nullable=True)  # JSON of generated dialogue entries
    error = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
