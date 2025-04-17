from scrapers.base import BaseScraper
import logging
import re
from urllib.parse import urljoin

logger = logging.getLogger(__name__)

class AviradiamondsScraper(BaseScraper):
    def __init__(self, base_url):
        super().__init__(base_url)
        self.search_url = f"{self.base_url}/search"
    
    async def search_product(self, query):
        search_url = f"{self.search_url}?q={query.replace(' ', '+')}"
        html = await self.fetch_page(search_url)
        soup = self.parse_html(html)
        
        if not soup:
            return []
        
        products = []
        # Based on the search results, Avira uses product cards with pricing information
        product_elements = soup.select(".product-card")
        
        for element in product_elements[:5]:
            try:
                name_element = element.select_one("h3")
                price_element = element.select_one(".regular-price")
                link_element = element.select_one("a")
                image_element = element.select_one("img")
                
                if name_element and price_element and link_element:
                    name = name_element.text.strip()
                    price_text = price_element.text.strip()
                    price = self.extract_price_from_text(price_text)
                    url = urljoin(self.base_url, link_element.get("href", ""))
                    image_url = image_element.get("src") if image_element else None
                    
                    products.append({
                        "name": name,
                        "price": price,
                        "url": url,
                        "image_url": image_url,
                        "competitor": "aviradiamonds"
                    })
            except Exception as e:
                logger.error(f"Error parsing product element: {e}")
        
        return products
    
    async def get_product_details(self, product_url):
        html = await self.fetch_page(product_url)
        soup = self.parse_html(html)
        
        if not soup:
            return None
        
        try:
            # Based on the search results, Avira likely uses these selectors
            name_element = soup.select_one("h1.product-title")
            price_element = soup.select_one(".regular-price")
            image_element = soup.select_one(".product-image img")
            description_element = soup.select_one(".product-description")
            
            name = name_element.text.strip() if name_element else ""
            price_text = price_element.text.strip() if price_element else ""
            price = self.extract_price_from_text(price_text)
            image_url = image_element.get("src") if image_element else None
            description = description_element.text.strip() if description_element else ""
            
            # From the search results, we know Avira offers certified lab-grown diamonds
            # with lifetime exchange and buyback options
            product_info = {
                "name": name,
                "price": price,
                "url": product_url,
                "image_url": image_url,
                "description": description,
                "competitor": "aviradiamonds",
                "is_available": price > 0,
                "is_lab_grown": True,
                "features": ["Free Shipping", "Certified Jewellery", "7 Days Return", "Lifetime Exchange", "Buyback"]
            }
            
            return product_info
        except Exception as e:
            logger.error(f"Error extracting product details: {e}")
            return None
    
    def extract_price_from_text(self, text):
        # Extract numeric price from text like "Regular price ₹112,344.00"
        price_match = re.search(r'[₹Rs.\s]*([0-9,]+\.[0-9]+|[0-9,]+)', text)
        if price_match:
            price_str = price_match.group(1).replace(',', '')
            try:
                return float(price_str)
            except ValueError:
                pass
        return 0
