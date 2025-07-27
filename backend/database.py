from pymongo import MongoClient
from bson.objectid import ObjectId
from config import Config
from datetime import datetime, timedelta
import pytz
import logging

class Database:
    """Database connection and operations manager"""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client[Config.DATABASE_NAME]
        self.collection = self.db[Config.COLLECTION_NAME]
        self.logger.info('Database initialized')
    
    def get_all_progress(self):
        """Get all progress data from the database"""
        self.logger.debug('Fetching all progress data')
        progress = list(self.collection.find())
        for item in progress:
            item["_id"] = str(item["_id"])
            if "progress_pic" in item:
                item["progress_pic"] = None  # or base64.b64encode(item["progress_pic"]).decode('utf-8') if you want to send it
        return progress
    
    def get_progress_by_date(self, date):
        """Get progress data for a specific date"""
        self.logger.debug(f'Fetching progress for date: {date}')
        progress = self.collection.find_one({"date": date})
        if progress:
            progress["_id"] = str(progress["_id"])
        return progress
    
    def create_progress_for_date(self, date):
        """Create a new progress entry for a specific date"""
        self.logger.info(f'Creating progress entry for date: {date}')
        new_progress = {
            "date": date,
            "tasks": Config.DEFAULT_TASKS.copy(),
        }
        result = self.collection.insert_one(new_progress)
        new_progress["_id"] = str(result.inserted_id)
        return new_progress
    
    def update_progress(self, date, tasks):
        """Update progress for a specific date"""
        self.logger.info(f'Updating progress for date: {date}')
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
        self.logger.info(f'Incrementing water for {date} by {amount}ml')
        progress = self.collection.find_one({"date": date})
        if not progress:
            self.logger.warning(f'No progress found for date: {date}')
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
        self.logger.debug(f'Fetching history for last {days} days')
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
            if "progress_pic" in item:
                item["progress_pic"] = None  # or base64.b64encode(item["progress_pic"]).decode('utf-8')
        
        return history

    def save_progress_pic(self, user_id, file_name, date):
        """Save or update the progress picture for a specific date."""
        self.logger.info(f'Saving progress picture for user: {user_id}')
        
        result = self.collection.update_one(
            {"date": date},
            {"$set": {"progress_pic": file_name, "user_id": user_id}},
            upsert=True
        )
        self.logger.info(f'Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted: {result.upserted_id}')
        return {"message": "Progress picture saved successfully"}

    def get_progress_pic(self, date):
        """Retrieve the progress picture for a specific date."""
        self.logger.debug(f'Getting progress picture for date: {date}')
        doc = self.collection.find_one({"date": date})
        if doc and "progress_pic" in doc:
            return doc["progress_pic"]
        return None

    def get_all_progress_pics(self):
        """Return a list of all dates and their progress pictures (if present), sorted by date descending."""
        self.logger.debug('Getting all progress pictures')
        pics = self.collection.find({"progress_pic": {"$exists": True, "$ne": None}}, {"date": 1, "progress_pic": 1, "user_id": 1, "_id": 0}).sort("date", -1)
        return list(pics)

db = Database() 