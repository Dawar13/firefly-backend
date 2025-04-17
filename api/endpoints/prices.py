from fastapi import APIRouter, Depends, HTTPException, Query # type: ignore
from sqlalchemy.orm import Session # type: ignore
from typing import List, Optional
from database.db import get_db
from database.models import Product, CompetitorProduct
from scrapers import get_scraper, get_all_scrapers
import asyncio
from datetime import datetime, timedelta
from pydantic import BaseModel # type: ignore

router = APIRouter()

class CompetitorProductResponse(BaseModel):
    competitor_name: str
    competitor_product_name: str
    price: float
    url: str
    image_url: Optional[str] = None
    last_checked: datetime

class ProductResponse(BaseModel):
    id: str
    name: str
    firefly_price: float
    image_url: Optional[str] = None
    url: Optional[str] = None
    competitors: List[CompetitorProductResponse]

@router.get("/products/", response_model=List[ProductResponse])
async def get_products(
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    category: Optional[str] = Query(None, description="Category filter"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if min_price is not None:
        query = query.filter(Product.firefly_price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.firefly_price <= max_price)
    
    if category:
        query = query.filter(Product.category == category)
    
    products = query.all()
    
    result = []
    for product in products:
        competitors = []
        for comp in product.competitors:
            competitors.append(
                CompetitorProductResponse(
                    competitor_name=comp.competitor_name,
                    competitor_product_name=comp.competitor_product_name,
                    price=comp.price,
                    url=comp.url,
                    image_url=comp.image_url,
                    last_checked=comp.last_checked
                )
            )
        
        result.append(
            ProductResponse(
                id=product.id,
                name=product.name,
                firefly_price=product.firefly_price,
                image_url=product.image_url,
                url=product.url,
                competitors=competitors
            )
        )
    
    return result

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    competitors = []
    for comp in product.competitors:
        competitors.append(
            CompetitorProductResponse(
                competitor_name=comp.competitor_name,
                competitor_product_name=comp.competitor_product_name,
                price=comp.price,
                url=comp.url,
                image_url=comp.image_url,
                last_checked=comp.last_checked
            )
        )
    
    return ProductResponse(
        id=product.id,
        name=product.name,
        firefly_price=product.firefly_price,
        image_url=product.image_url,
        url=product.url,
        competitors=competitors
    )

@router.post("/products/{product_id}/refresh")
async def refresh_product_prices(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get all competitor products for this product
    competitor_products = db.query(CompetitorProduct).filter(
        CompetitorProduct.product_id == product_id
    ).all()
    
    updated_competitors = []
    
    for comp_product in competitor_products:
        scraper = get_scraper(comp_product.competitor_name)
        
        if not scraper:
            continue
        
        # Get updated details
        details = await scraper.get_product_details(comp_product.url)
        
        if details:
            # Update the competitor product
            comp_product.price = details["price"]
            comp_product.is_available = details["is_available"]
            comp_product.last_checked = datetime.utcnow()
            
            db.add(comp_product)
            updated_competitors.append(comp_product.competitor_name)
    
    db.commit()
    
    return {"message": f"Updated prices from competitors: {', '.join(updated_competitors)}"}

@router.post("/products/search")
async def search_products(query: str, db: Session = Depends(get_db)):
    # Search for products across all competitor websites
    scrapers = get_all_scrapers()
    all_results = []
    
    for scraper in scrapers:
        results = await scraper.search_product(query)
        all_results.extend(results)
    
    return all_results
