from flask import Blueprint, jsonify, request
from database import db
from services.stats_service import StatsService

# Create blueprint for progress routes
progress_bp = Blueprint('progress', __name__)

@progress_bp.route("/health", methods=["GET"])
def get_root():
    return jsonify({"message": "Welcome to the 75 Hard tracker API"}), 200

@progress_bp.route("/progress", methods=["GET"])
def get_progress():
    """Gets all progress data from the database."""
    try:
        progress = db.get_all_progress()
        return jsonify(progress)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@progress_bp.route("/progress/history", methods=["GET"])
def get_history():
    """Gets progress history for the last 30 days."""
    try:
        history = db.get_history()
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@progress_bp.route("/progress/stats", methods=["GET"])
def get_stats():
    """Gets overall statistics and streaks."""
    try:
        all_progress = db.get_all_progress()
        stats = StatsService.get_comprehensive_stats(all_progress)
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@progress_bp.route("/progress/<date>", methods=["GET"])
def get_progress_by_date(date):
    """Gets progress data for a specific date. If no data exists, creates a new entry."""
    try:
        progress = db.get_progress_by_date(date)
        if progress:
            return jsonify(progress)
        else:
            new_progress = db.create_progress_for_date(date)
            return jsonify(new_progress)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@progress_bp.route("/progress/<date>", methods=["PUT"])
def update_progress(date):
    """Updates the progress for a specific date."""
    try:
        data = request.get_json()
        if not data or "tasks" not in data:
            return jsonify({"error": "Invalid request data"}), 400
        
        result = db.update_progress(date, data["tasks"])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@progress_bp.route("/progress/<date>/water", methods=["POST"])
def increment_water(date):
    """Increment water intake for a specific date by a given amount (ml)."""
    try:
        data = request.get_json()
        amount = int(data.get("amount", 0))
        
        if amount <= 0:
            return jsonify({"error": "Amount must be positive"}), 400
        
        new_value = db.increment_water(date, amount)
        if new_value is None:
            return jsonify({"error": "No progress for this date"}), 404
        
        return jsonify({"water": new_value})
    except ValueError:
        return jsonify({"error": "Invalid amount value"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500 