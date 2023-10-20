from config.cfg_app import initialize_app
from dotenv import load_dotenv
from fastapi import FastAPI

app = FastAPI()

load_dotenv()

initialize_app(app)
