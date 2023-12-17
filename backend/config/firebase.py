# pylint: disable=E0401

import json
import os

import pyrebase
from dotenv import load_dotenv

load_dotenv()

config = os.getenv("FIREBASE_CONFIG")

firebase = pyrebase.initialize_app(json.loads(config))
auth = firebase.auth()
db = firebase.database()
