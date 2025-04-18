import React, { useEffect, useState } from 'react';
import '../styles/ProductList.css';

// Utility function to get product images using chrome.runtime.getURL
const getProductImage = (productName) => {
  // Map product names to image files
  const imageMap = {
    'Diamond Solitaire Ring': 'diamond-ring.jpg',
    'Diamond Pendant': 'diamond-pendant.jpg',
    'Diamond Earrings': 'diamond-earrings.jpg',
    'Diamond Bracelet': 'diamond-bracelet.jpg',
    
    // Add more mappings as needed
  };
  
  // Default fallback image
  const defaultImage = 'default-product.jpg';
  
  try {
    // Try to find an exact match
    if (imageMap[productName]) {
      return chrome.runtime.getURL(`images/${imageMap[productName]}`);
    }
    
    // Try to find a partial match
    for (const [key, imagePath] of Object.entries(imageMap)) {
      if (productName.toLowerCase().includes(key.toLowerCase())) {
        return chrome.runtime.getURL(`images/${imagePath}`);
      }
    }
    
    // Return default image if no match found
    return chrome.runtime.getURL(`images/${defaultImage}`);
  } catch (error) {
    console.error("Error generating image URL:", error);
    // Fallback to a data URI in case chrome.runtime is not available (during development)
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
};

const ProductList = ({ products, loading }) => {
  // State to track if images are loaded
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  // Console log to check URLs and available images
  useEffect(() => {
    console.log("Products loaded:", products.length);
    
    // Log available images for debugging
    try {
      // Log the actual extension URL that will be used
      const testImageUrl = chrome.runtime.getURL('images/default-product.jpg');
      console.log("Extension URL format:", testImageUrl);
      
      // Log all image paths that will be used
      const imagePaths = products.map(p => ({
        name: p.name,
        imagePath: getProductImage(p.name)
      }));
      console.log("Image paths for products:", imagePaths);
    } catch (error) {
      console.error("Extension runtime not available:", error);
    }
  }, [products]);
  
  // Function to handle image errors with better fallback
  const handleImageError = (e, productId, productName) => {
    console.error(`Image failed to load for product ${productId}: ${productName}`);
    e.target.onerror = null; // Prevent infinite loops
    
    try {
      // Try the default image first
      e.target.src = chrome.runtime.getURL('images/default-product.jpg');
    } catch (error) {
      console.error("Error setting fallback image:", error);
      // Use a data URI as last resort fallback
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    
    // Update state to track that this image had an error
    setImagesLoaded(prev => ({...prev, [productId]: false}));
  };

  // Function to handle image load success
  const handleImageLoad = (productId) => {
    console.log(`Image loaded successfully for product ${productId}`);
    setImagesLoaded(prev => ({...prev, [productId]: true}));
  };

  // Function to ensure URLs are valid
  const ensureValidUrl = (url) => {
    if (!url) return '#'; // Default fallback
    
    try {
      // If URL is already valid, this will work
      new URL(url);
      return url;
    } catch (e) {
      // If URL is missing protocol, add https://
      if (url.match(/^www\./i) || !url.match(/^[a-z]+:\/\//i)) {
        return `https://${url.replace(/^www\./i, '')}`;
      }
      return '#'; // Invalid URL fallback
    }
  };

  // Function to handle product link clicks with better error handling
  const handleProductClick = (url, event) => {
    event.preventDefault();
    
    // Ensure URL is valid before attempting to open
    const validUrl = ensureValidUrl(url);
    
    try {
      console.log("Opening URL:", validUrl); // Debug log
      const newWindow = window.open(validUrl, '_blank', 'noopener,noreferrer');
      
      // Check if the window was successfully opened
      if (newWindow === null || typeof newWindow === 'undefined') {
        console.error('Failed to open new window. Popup might be blocked.');
        // Fallback: try to navigate in the same tab
        window.location.href = validUrl;
      }
    } catch (error) {
      console.error('Error opening product link:', error);
      // Fallback: try to navigate in the same tab
      window.location.href = validUrl;
    }
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
                src={getProductImage(product.name)}
                alt={product.name}
                onLoad={() => handleImageLoad(product.id)}
                onError={(e) => handleImageError(e, product.id, product.name)}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-store">{product.store}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price.toLocaleString()}</p>
              <button 
                className="view-button"
                onClick={(e) => handleProductClick(product.link, e)}
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
