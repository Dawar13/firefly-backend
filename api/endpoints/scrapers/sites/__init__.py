from scrapers.sites.truecarat import TruecaratScraper
from scrapers.sites.house_of_quadri import HouseOfQuadriScraper
from scrapers.sites.emori import EmoriScraper
from scrapers.sites.varniya import VarniyaScraper
from scrapers.sites.avira import AviraScraper
from scrapers.sites.jewel_box import JewelBoxScraper
from config import COMPETITOR_URLS

def get_scraper(competitor_name):
    scrapers = {
        "truecarat": TruecaratScraper(COMPETITOR_URLS["truecarat"]),
        "house_of_quadri": HouseOfQuadriScraper(COMPETITOR_URLS["house_of_quadri"]),
        "emori": EmoriScraper(COMPETITOR_URLS["emori"]),
        "varniya": VarniyaScraper(COMPETITOR_URLS["varniya"]),
        "avira": AviraScraper(COMPETITOR_URLS["avira"]),
        "jewel_box": JewelBoxScraper(COMPETITOR_URLS["jewel_box"])
    }
    
    return scrapers.get(competitor_name.lower())

def get_all_scrapers():
    return [
        TruecaratScraper(COMPETITOR_URLS["truecarat"]),
        HouseOfQuadriScraper(COMPETITOR_URLS["house_of_quadri"]),
        EmoriScraper(COMPETITOR_URLS["emori"]),
        VarniyaScraper(COMPETITOR_URLS["varniya"]),
        AviraScraper(COMPETITOR_URLS["avira"]),
        JewelBoxScraper(COMPETITOR_URLS["jewel_box"])
    ]
