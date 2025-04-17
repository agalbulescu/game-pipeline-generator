import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    GITLAB_URL = os.getenv('GITLAB_URL', 'https://gitlab.com')
    GITLAB_TOKEN = os.getenv('GITLAB_TOKEN')
    PROJECT_ID = os.getenv('PROJECT_ID')
    MAX_CONCURRENT_JOBS = 5  # Preserving your 5-job limit
    ALLOWED_USERS = os.getenv('ALLOWED_USERS', 'user1,user2').split(',')