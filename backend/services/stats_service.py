from config import Config

class StatsService:
    """Service for calculating statistics and streaks"""
    
    @staticmethod
    def is_day_complete(day):
        """Check if a day is complete based on all tasks"""
        tasks = day["tasks"].copy()
        # Water is complete if >= goal
        if isinstance(tasks.get("drink_gallon_water"), int):
            tasks["drink_gallon_water"] = tasks["drink_gallon_water"] >= Config.WATER_GOAL_ML
        return all(tasks.values())
    
    @staticmethod
    def calculate_streaks(all_progress):
        """Calculate current and longest streaks"""
        if not all_progress:
            return 0, 0
        
        sorted_days = sorted(all_progress, key=lambda x: x["date"])
        current_streak = 0
        longest_streak = 0
        temp_streak = 0
        
        for day in sorted_days:
            if StatsService.is_day_complete(day):
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 0
        
        # Check current streak (from most recent day)
        for day in reversed(sorted_days):
            if StatsService.is_day_complete(day):
                current_streak += 1
            else:
                break
        
        return current_streak, longest_streak
    
    @staticmethod
    def calculate_task_stats(all_progress):
        """Calculate task-specific statistics"""
        if not all_progress:
            return {}
        
        total_days = len(all_progress)
        task_stats = {}
        
        for task_key, task_name in Config.TASK_NAMES.items():
            if task_key == "drink_gallon_water":
                completed_count = sum(
                    1 for day in all_progress 
                    if isinstance(day["tasks"].get(task_key), int) 
                    and day["tasks"][task_key] >= Config.WATER_GOAL_ML
                )
            else:
                completed_count = sum(
                    1 for day in all_progress 
                    if day["tasks"].get(task_key, False)
                )
            
            task_stats[task_key] = {
                "name": task_name,
                "completed": completed_count,
                "total": total_days,
                "percentage": round((completed_count / total_days) * 100, 1) if total_days > 0 else 0
            }
        
        return task_stats
    
    @staticmethod
    def get_comprehensive_stats(all_progress):
        """Get comprehensive statistics for the application"""
        if not all_progress:
            return {
                "total_days": 0,
                "completed_days": 0,
                "current_streak": 0,
                "longest_streak": 0,
                "completion_rate": 0,
                "task_stats": {}
            }
        
        total_days = len(all_progress)
        completed_days = sum(1 for day in all_progress if StatsService.is_day_complete(day))
        current_streak, longest_streak = StatsService.calculate_streaks(all_progress)
        task_stats = StatsService.calculate_task_stats(all_progress)
        
        return {
            "total_days": total_days,
            "completed_days": completed_days,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "completion_rate": round((completed_days / total_days) * 100, 1) if total_days > 0 else 0,
            "task_stats": task_stats
        } 