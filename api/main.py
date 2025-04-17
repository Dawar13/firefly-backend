from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from api.endpoints import prices

app = FastAPI(
    title="Firefly Diamonds Price Comparison API",
    description="API for comparing jewelry prices across multiple retailers",
    version="1.0.0"
)

# Configure CORS - update origins as needed for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://YOUR_EXTENSION_ID", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prices.router, prefix="/api/v1", tags=["prices"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Firefly Diamonds Price Comparison API"}
