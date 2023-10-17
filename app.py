from config.cfg_app import initialize_app
from dotenv import load_dotenv
from routes.auth import router as auth_router
from routes.payment import router as payment_router
from routes.weather import router as weather_router

load_dotenv()

app = initialize_app()

app.include_router(weather_router)
app.include_router(auth_router)
app.include_router(payment_router)
