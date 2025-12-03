from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.main.routers import (
    auth_router,
    invite_router,
    private_event_router,
    public_event_router,
    user_router,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173",
        "http://ec2-13-57-12-38.us-west-1.compute.amazonaws.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes from each router with the app
app.include_router(auth_router.router)
app.include_router(invite_router.router)
app.include_router(private_event_router.router)
app.include_router(public_event_router.router)
app.include_router(user_router.router)
