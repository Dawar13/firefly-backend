import httpx
import asyncio
from bs4 import BeautifulSoup
from abc import ABC, abstractmethod
import logging
from config import SCRAPER_API_KEY

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    def __init__(self, base_url):
        self.base_url = base_url
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.scraper_api_url = "http://api.scraperapi.com"
        self.scraper_api_key = SCRAPER_API_KEY
    
    async def fetch_page(self, url, use_proxy=True):
        try:
            if use_proxy and self.scraper_api_key:
                params = {
                    "api_key": self.scraper_api_key,
                    "url": url
                }
                async with httpx.AsyncClient() as client:
                    response = await client.get(self.scraper_api_url, params=params, timeout=60.0)
            else:
                async with httpx.AsyncClient(headers=self.headers) as client:
                    response = await client.get(url, timeout=30.0)
            
            response.raise_for_status()
            return response.text
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error occurred: {e}")
            return None
        except httpx.RequestError as e:
            logger.error(f"Request error occurred: {e}")
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return None
    
    def parse_html(self, html):
        if html:
            return BeautifulSoup(html, 'lxml')
        return None
    
    @abstractmethod
    async def search_product(self, query):
        pass
    
    @abstractmethod
    async def get_product_details(self, product_url):
        pass
    
    @abstractmethod
    async def extract_price(self, soup):
        pass
