import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jewelry_prices.db")

# Scraping Configuration
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
SCRAPING_INTERVAL_HOURS = int(os.getenv("SCRAPING_INTERVAL_HOURS", 6))

# Competitor URLs
COMPETITOR_URLS = {
    "truecarat": os.getenv("TRUECARAT_BASE_URL"),
    "house_of_quadri": os.getenv("HOUSE_OF_QUADRI_BASE_URL"),
    "emori": os.getenv("EMORI_BASE_URL"),
    "varniya": os.getenv("VARNIYA_BASE_URL"),
    "avira": os.getenv("AVIRA_BASE_URL"),
    "jewel_box": os.getenv("JEWEL_BOX_BASE_URL")
}
