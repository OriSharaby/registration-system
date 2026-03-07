from dotenv import load_dotenv
load_dotenv()

import os
import httpx

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:4001/api/ai/toast")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

TIMEOUT = httpx.Timeout(connect=2.0, read=4.0, write=2.0, pool=2.0)