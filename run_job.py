# run_job.py
from app.job.student_follow_up import run_daily_follow_up

if __name__ == "__main__":
    print("Iniciando el job manualmente desde el lanzador...")
    run_daily_follow_up()