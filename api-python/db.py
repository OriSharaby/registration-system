import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB", "registration_db")

if not MONGODB_URI:
    raise RuntimeError("Missing MONGODB_URI in .env")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_col = db["users"]