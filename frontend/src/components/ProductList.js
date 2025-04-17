import React from 'react';
import '../styles/ProductList.css';

const ProductList = ({ products, loading }) => {
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
              <img src={product.image} alt={product.name} />
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
