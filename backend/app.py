from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime
from datetime import timedelta

app = Flask(__name__)
CORS(app)


MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["seventy_five_hard"]
collection = db["progress"]

# --- Routes ---

@app.route("/progress", methods=["GET"])
def get_progress():
    """
    Gets all progress data from the database.
    """
    progress = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for item in progress:
        item["_id"] = str(item["_id"])
    return jsonify(progress)

@app.route("/progress/history", methods=["GET"])
def get_history():
    """
    Gets progress history for the last 30 days.
    """
    end_date = datetime.datetime.now().date()
    start_date = end_date - timedelta(days=30)
    
    history = list(collection.find({
        "date": {
            "$gte": start_date.isoformat(),
            "$lte": end_date.isoformat()
        }
    }).sort("date", -1))
    
    for item in history:
        item["_id"] = str(item["_id"])
    
    return jsonify(history)

@app.route("/progress/stats", methods=["GET"])
def get_stats():
    """
    Gets overall statistics and streaks.
    """
    # Get all progress data
    all_progress = list(collection.find())
    
    if not all_progress:
        return jsonify({
            "total_days": 0,
            "completed_days": 0,
            "current_streak": 0,
            "longest_streak": 0,
            "completion_rate": 0,
            "task_stats": {}
        })
    
    # Calculate stats
    total_days = len(all_progress)
    completed_days = sum(1 for day in all_progress if all(day["tasks"].values()))
    
    # Calculate streaks
    sorted_days = sorted(all_progress, key=lambda x: x["date"])
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    
    for day in sorted_days:
        if all(day["tasks"].values()):
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 0
    
    # Check current streak (from most recent day)
    for day in reversed(sorted_days):
        if all(day["tasks"].values()):
            current_streak += 1
        else:
            break
    
    # Calculate task-specific stats
    task_stats = {}
    task_names = {
        "drink_gallon_water": "Drink 1 Gallon Water",
        "two_workouts": "Two 45-Min Workouts",
        "read_ten_pages": "Read 10 Pages",
        "five_min_cold_shower": "5-Min Cold Shower",
        "follow_diet": "Follow Diet",
        "no_alcohol_or_cheat_meals": "No Alcohol/Cheat Meals",
        "take_progress_pic": "Take Progress Picture"
    }
    
    for task_key, task_name in task_names.items():
        completed_count = sum(1 for day in all_progress if day["tasks"].get(task_key, False))
        task_stats[task_key] = {
            "name": task_name,
            "completed": completed_count,
            "total": total_days,
            "percentage": round((completed_count / total_days) * 100, 1) if total_days > 0 else 0
        }
    
    return jsonify({
        "total_days": total_days,
        "completed_days": completed_days,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "completion_rate": round((completed_days / total_days) * 100, 1) if total_days > 0 else 0,
        "task_stats": task_stats
    })

@app.route("/progress/<date>", methods=["GET"])
def get_progress_by_date(date):
    """
    Gets progress data for a specific date.
    If no data exists for that date, it creates a new entry.
    """
    progress = collection.find_one({"date": date})
    if progress:
        progress["_id"] = str(progress["_id"])
        return jsonify(progress)
    else:
        new_progress = {
            "date": date,
            "tasks": {
                "drink_gallon_water": False,
                "two_workouts": False,
                "read_ten_pages": False,
                "five_min_cold_shower": False,
                "follow_diet": False,
                "no_alcohol_or_cheat_meals": False,
                "take_progress_pic": False,
            },
        }
        result = collection.insert_one(new_progress)
        new_progress["_id"] = str(result.inserted_id)
        return jsonify(new_progress)

@app.route("/progress/<date>", methods=["PUT"])
def update_progress(date):
    """
    Updates the progress for a specific date.
    """
    data = request.get_json()
    collection.update_one({"date": date}, {"$set": {"tasks": data["tasks"]}})
    return jsonify({"message": "Progress updated successfully"})

if __name__ == "__main__":
    app.run(debug=True)
