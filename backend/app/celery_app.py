from celery import Celery
from app.config import settings

celery_app = Celery(
    "resume_analyzer",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=['app.tasks']
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Celery Beat Schedule (for periodic tasks)
celery_app.conf.beat_schedule = {
    'cleanup-old-files': {
        'task': 'app.tasks.cleanup_old_files',
        'schedule': 86400.0,  # Run daily
    },
    'update-analytics': {
        'task': 'app.tasks.update_analytics',
        'schedule': 3600.0,  # Run hourly
    },
}