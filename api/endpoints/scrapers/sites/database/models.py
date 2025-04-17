from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore
from sqlalchemy.orm import relationship # type: ignore
import datetime
import uuid

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    sku = Column(String, unique=True)
    description = Column(String)
    category = Column(String)
    firefly_price = Column(Float, nullable=False)
    image_url = Column(String)
    url = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    competitors = relationship("CompetitorProduct", back_populates="product", cascade="all, delete-orphan")

class CompetitorProduct(Base):
    __tablename__ = "competitor_products"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey("products.id"))
    competitor_name = Column(String, nullable=False)
    competitor_product_name = Column(String)
    competitor_sku = Column(String)
    price = Column(Float)
    url = Column(String, nullable=False)
    image_url = Column(String)
    is_available = Column(Boolean, default=True)
    last_checked = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product", back_populates="competitors")
