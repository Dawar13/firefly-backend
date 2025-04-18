import React, { useEffect, useState } from 'react';
import '../styles/ProductList.css';

const ProductList = ({ products, loading }) => {
  // Function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === '' || imageUrl === 'N/A') {
      // Fallback to a local placeholder image
      return chrome.runtime.getURL('images/product-placeholder.png');
    }
    
    // Check if the URL is relative (missing http:// or https://)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      // If it's a relative URL, use chrome.runtime.getURL
      return chrome.runtime.getURL(imageUrl);
    }
    
    // Return the original URL for absolute URLs
    return imageUrl;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Fetching products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-results">
        <p>No products found in the selected price range.</p>
        <p>Try adjusting your filters or price range.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Comparison Results ({products.length} items)</h2>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className={`product-card ${product.isFirefly ? 'firefly-product' : ''}`}
          >
            {product.isFirefly && <div className="firefly-badge">Firefly</div>}
            <div className="product-image">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                onError={(e) => {
                  // If image fails to load, replace with placeholder
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = chrome.runtime.getURL('images/product-placeholder.png');
                }}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-store">{product.store}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price.toLocaleString()}</p>
              <a 
                href={product.link} 
                className="view-button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
