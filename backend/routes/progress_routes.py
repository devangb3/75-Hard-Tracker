from flask import Blueprint, jsonify, request, send_file
from database import db
from services.stats_service import StatsService
from io import BytesIO
import base64
import logging
from services.file_service import FileService
from datetime import datetime
from uuid import uuid4

progress_bp = Blueprint('progress', __name__)
logger = logging.getLogger('progress_routes')
file_service = FileService()

@progress_bp.route("/health", methods=["GET"])
def get_root():
    logger.info('Health check endpoint called')
    return jsonify({"message": "Welcome to the 75 Hard tracker API"}), 200

@progress_bp.route("/progress", methods=["GET"])
def get_progress():
    logger.info('Fetching all progress')
    try:
        progress = db.get_all_progress()
        return jsonify(progress)
    except Exception as e:
        logger.error(f'Error fetching all progress: {str(e)}')
        return jsonify({"error": "Failed to fetch progress.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/history", methods=["GET"])
def get_history():
    logger.info('Fetching progress history')
    try:
        history = db.get_history()
        return jsonify(history)
    except Exception as e:
        logger.error(f'Error fetching history: {str(e)}')
        return jsonify({"error": "Failed to fetch history.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/stats", methods=["GET"])
def get_stats():
    logger.info('Fetching stats')
    try:
        all_progress = db.get_all_progress()
        stats = StatsService.get_comprehensive_stats(all_progress)
        return jsonify(stats)
    except Exception as e:
        logger.error(f'Error fetching stats: {str(e)}')
        return jsonify({"error": "Failed to fetch stats.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/<date>", methods=["GET"])
def get_progress_by_date(date):
    logger.info(f'Fetching progress for date: {date}')
    try:
        progress = db.get_progress_by_date(date)
        if progress:
            return jsonify(progress)
        else:
            new_progress = db.create_progress_for_date(date)
            return jsonify(new_progress)
    except Exception as e:
        logger.error(f'Error fetching/creating progress for {date}: {str(e)}')
        return jsonify({"error": f"Failed to fetch or create progress for {date}.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/<date>", methods=["PUT"])
def update_progress(date):
    logger.info(f'Updating progress for date: {date}')
    try:
        data = request.get_json()
        if not data or "tasks" not in data:
            logger.warning('Invalid request data for update_progress')
            return jsonify({"error": "Invalid request data", "type": "BadRequest"}), 400
        result = db.update_progress(date, data["tasks"])
        return jsonify(result)
    except Exception as e:
        logger.error(f'Error updating progress for {date}: {str(e)}')
        return jsonify({"error": f"Failed to update progress for {date}.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/<date>/water", methods=["POST"])
def increment_water(date):
    logger.info(f'Incrementing water for date: {date}')
    try:
        data = request.get_json()
        amount = int(data.get("amount", 0))
        if amount <= 0:
            logger.warning('Amount must be positive for increment_water')
            return jsonify({"error": "Amount must be positive", "type": "BadRequest"}), 400
        new_value = db.increment_water(date, amount)
        if new_value is None:
            logger.warning(f'No progress for date {date} in increment_water')
            return jsonify({"error": "No progress for this date", "type": "NotFound"}), 404
        return jsonify({"water": new_value})
    except ValueError:
        logger.error('Invalid amount value for increment_water')
        return jsonify({"error": "Invalid amount value", "type": "BadRequest"}), 400
    except Exception as e:
        logger.error(f'Error incrementing water for {date}: {str(e)}')
        return jsonify({"error": f"Failed to increment water for {date}.", "type": type(e).__name__, "details": str(e)}), 500

@progress_bp.route("/progress/pic/<date>", methods=["POST"])
def progress_pic(date):
    if "file" in request.files and "user_id" in request.form:
        logger.info('Uploading progress picture')
        try:
            file = request.files["file"]
            user_id = request.form["user_id"]
            file_ext = file.filename.split(".")[-1]
            file_name = f"{uuid4()}.{file_ext}"
            result = file_service.upload_file(file, file_name)
            if not result.get("success"):
                return jsonify({"error": result.get("message", "Failed to save progress picture."), "type": "DatabaseError"}), 500
            db.save_progress_pic(user_id, file_name, date)
            return jsonify({"message": "Progress picture uploaded successfully"})
        except Exception as e:
            logger.error(f'Error uploading progress picture: {str(e)}')
            return jsonify({"error": f"Failed to upload progress picture.", "type": type(e).__name__, "details": str(e)}), 500
        
    else:
        logger.warning('Missing user_id in progress_pic')
        return jsonify({"error": "Missing user_id", "type": "BadRequest"}), 400

@progress_bp.route("/progress/pic/<date>", methods=["GET"])
def get_progress_pic_by_date(date):
    user_id = request.args.get("user_id")
    if not user_id:
        logger.warning('Missing user_id in get_progress_pic_by_date')
        return jsonify({"error": "Missing user_id", "type": "BadRequest"}), 400
    
    file_name = db.get_progress_pic(date)
    if not file_name:
        logger.warning(f'No progress picture found for user {user_id} on {date}')
        return jsonify({"error": "No progress picture found", "type": "NotFound"}), 404
    try:
        image_bytes = file_service.get_file(file_name)
        if not image_bytes:
            logger.warning(f'No progress picture found for user {user_id} on {date}')
            return jsonify({"error": "No progress picture found", "type": "NotFound"}), 404
        return send_file(BytesIO(image_bytes), mimetype="image/jpeg", download_name=file_name)
    except Exception as e:
        logger.error(f'Error fetching progress picture for user {user_id} on {date}: {str(e)}')
        return jsonify({"error": f"Failed to fetch progress picture.", "type": type(e).__name__, "details": str(e)}), 500


@progress_bp.route("/progress/pics", methods=["GET"])
def get_all_progress_pics():
    logger.info('Fetching all progress pictures for gallery')
    try:
        pics = db.get_all_progress_pics()
        result = []
        for item in pics:
            if item.get("progress_pic"):
                user_id = item.get("user_id")
                if user_id:
                    image_url = f"/progress/pic/{item['date']}?user_id={user_id}"
                else:
                    image_url = f"/progress/pic/{item['date']}"
                result.append({
                    "date": item["date"],
                    "image_url": image_url
                })
        return jsonify(result)
    except Exception as e:
        logger.error(f'Error fetching all progress pictures: {str(e)}')
        return jsonify({"error": "Failed to fetch progress pictures.", "type": type(e).__name__, "details": str(e)}), 500