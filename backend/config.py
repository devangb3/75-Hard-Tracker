import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration class"""
    
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    PORT = int(os.getenv('FLASK_PORT', 8917))
    
    CORS_ORIGINS = [
        "http://localhost:6896",
        "http://127.0.0.1:6896",
        "https://hard-tracker-frontend-75-424176252593.us-west1.run.app"
    ]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_HEADERS = ["Content-Type", "Authorization"]
    CORS_SUPPORTS_CREDENTIALS = True
    
    MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27017/")
    DATABASE_NAME = "seventy_five_hard"
    COLLECTION_NAME = "progress"
    BUCKET_NAME = os.getenv('BUCKET_NAME', "75-hard-progress-pics")
    
    WATER_GOAL_ML = 3785  # 1 gallon in ml
    HISTORY_DAYS = 75
    
    TASK_NAMES = {
        "drink_gallon_water": "Drink 1 Gallon Water",
        "workout_a": "Workout A (45 min)",
        "workout_b_outside": "Workout B (Outside - 45 min)",
        "read_ten_pages": "Read 10 Pages",
        "five_min_cold_shower": "5-Min Cold Shower",
        "follow_diet": "Follow Diet",
        "no_alcohol_or_cheat_meals": "No Alcohol/Cheat Meals",
        "take_progress_pic": "Take Progress Picture"
    }
    
    DEFAULT_TASKS = {
        "drink_gallon_water": 0,
        "workout_a": False,
        "workout_b_outside": False,
        "read_ten_pages": False,
        "five_min_cold_shower": False,
        "follow_diet": False,
        "no_alcohol_or_cheat_meals": False,
        "take_progress_pic": False,
    } 