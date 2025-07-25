from google.cloud import storage
import logging
from config import Config
class FileService:
    """Service for handling file uploads to Google Cloud Storage"""
    logger = logging.getLogger('FileService')
    
    def __init__(self):
        self.logger.info('Initializing FileService')
        self.storage_client = storage.Client()
        self.bucket_name = Config.BUCKET_NAME

    def upload_file(self, file, file_name):
        try:
            self.logger.info(f'Uploading file: {file_name}')
            bucket = self.storage_client.bucket(self.bucket_name)
            blob_name = file_name
            blob = bucket.blob(blob_name)
            blob.upload_from_file(file)
            self.logger.debug(f'Successfully uploaded file {file_name}')
            return {"success": True, "message": "File uploaded successfully"}
        except Exception as e:
            self.logger.error(f'Error uploading file {file_name}: {str(e)}')
            return {"success": False, "message": f"Failed to upload file: {str(e)}"}

    def get_file(self, file_name) -> bytes:
        try:
            self.logger.info(f'Getting file: {file_name}')
            bucket = self.storage_client.bucket(self.bucket_name)
            blob_name = file_name
            blob = bucket.get_blob(blob_name)
            return blob.download_as_bytes()
        except Exception as e:
            self.logger.error(f'Error getting file {file_name}: {str(e)}')
            raise e