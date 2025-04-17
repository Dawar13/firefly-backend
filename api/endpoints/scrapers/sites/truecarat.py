from scrapers.base import BaseScraper
import logging
import re
from urllib.parse import urljoin

logger = logging.getLogger(__name__)

class TruecaratScraper(BaseScraper):
    def __init__(self, base_url):
        super().__init__(base_url)
        self.search_url = f"{self.base_url}/search?q="
    
    async def search_product(self, query):
        search_url = f"{self.search_url}{query.replace(' ', '+')}"
        html = await self.fetch_page(search_url)
        soup = self.parse_html(html)
        
        if not soup:
            return []
        
        products = []
        # Adjust the selector based on Truecarat's actual HTML structure
        product_elements = soup.select(".product-item")
        
        for element in product_elements[:5]:  # Limit to first 5 results
            try:
                name_element = element.select_one(".product-title")
                price_element = element.select_one(".product-price")
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
                        "competitor": "truecarat"
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
            # Adjust selectors based on Truecarat's actual HTML structure
            name_element = soup.select_one("h1.product-title")
            price_element = soup.select_one(".product-price")
            image_element = soup.select_one(".product-image img")
            sku_element = soup.select_one(".product-sku")
            
            name = name_element.text.strip() if name_element else ""
            price_text = price_element.text.strip() if price_element else ""
            price = self.extract_price_from_text(price_text)
            image_url = image_element.get("src") if image_element else None
            sku = sku_element.text.strip() if sku_element else ""
            
            return {
                "name": name,
                "price": price,
                "url": product_url,
                "image_url": image_url,
                "sku": sku,
                "competitor": "truecarat",
                "is_available": price > 0
            }
        except Exception as e:
            logger.error(f"Error extracting product details: {e}")
            return None
    
    async def extract_price(self, soup):
        price_element = soup.select_one(".product-price")
        if price_element:
            price_text = price_element.text.strip()
            return self.extract_price_from_text(price_text)
        return 0
    
    def extract_price_from_text(self, text):
        # Extract numeric price from text like "₹45,000" or "Rs. 45,000"
        price_match = re.search(r'[₹Rs.\s]*([0-9,]+)', text)
        if price_match:
            price_str = price_match.group(1).replace(',', '')
            try:
                return float(price_str)
            except ValueError:
                pass
        return 0

