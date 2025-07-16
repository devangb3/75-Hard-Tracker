from pymongo import MongoClient
from bson.objectid import ObjectId
from config import Config
from datetime import datetime, timedelta
import pytz

class Database:
    """Database connection and operations manager"""
    
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client[Config.DATABASE_NAME]
        self.collection = self.db[Config.COLLECTION_NAME]
    
    def get_all_progress(self):
        """Get all progress data from the database"""
        progress = list(self.collection.find())
        for item in progress:
            item["_id"] = str(item["_id"])
        return progress
    
    def get_progress_by_date(self, date):
        """Get progress data for a specific date"""
        progress = self.collection.find_one({"date": date})
        if progress:
            progress["_id"] = str(progress["_id"])
        return progress
    
    def create_progress_for_date(self, date):
        """Create a new progress entry for a specific date"""
        new_progress = {
            "date": date,
            "tasks": Config.DEFAULT_TASKS.copy(),
        }
        result = self.collection.insert_one(new_progress)
        new_progress["_id"] = str(result.inserted_id)
        return new_progress
    
    def update_progress(self, date, tasks):
        """Update progress for a specific date"""
        # Clamp water to goal if present
        if "drink_gallon_water" in tasks:
            val = tasks["drink_gallon_water"]
            if isinstance(val, int):
                tasks["drink_gallon_water"] = min(val, Config.WATER_GOAL_ML)
        
        self.collection.update_one(
            {"date": date}, 
            {"$set": {"tasks": tasks}}
        )
        return {"message": "Progress updated successfully"}
    
    def increment_water(self, date, amount):
        """Increment water intake for a specific date"""
        progress = self.collection.find_one({"date": date})
        if not progress:
            return None
        
        current = progress["tasks"].get("drink_gallon_water", 0)
        new_value = min(current + amount, Config.WATER_GOAL_ML)
        
        self.collection.update_one(
            {"date": date}, 
            {"$set": {"tasks.drink_gallon_water": new_value}}
        )
        return new_value
    
    def get_history(self, days=Config.HISTORY_DAYS):
        """Get progress history for the specified number of days using local time"""
        local_tz = datetime.now().astimezone().tzinfo
        end_date = datetime.now(local_tz).date()
        start_date = end_date - timedelta(days=days)
        
        history = list(self.collection.find({
            "date": {
                "$gte": start_date.isoformat(),
                "$lte": end_date.isoformat()
            }
        }).sort("date", -1))
        
        for item in history:
            item["_id"] = str(item["_id"])
        
        return history

# Global database instance
db = Database() 