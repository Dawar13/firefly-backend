from main import run_price_update, schedule_price_updates
from database.db import init_db

if __name__ == "__main__":
    # Initialize the database
    init_db()
    
    # Run an initial price update
    run_price_update()
    
    # Schedule regular updates
    schedule_price_updates()
