import uvicorn # type: ignore
from api.main import app
from database.db import init_db
from config import API_HOST, API_PORT

if __name__ == "__main__":
    # Initialize the database
    init_db()
    
    # Run the API server
    uvicorn.run(app, host=API_HOST, port=API_PORT)
