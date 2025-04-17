import React, { useState, useEffect } from 'react';
import { fetchProducts } from './services/api';
import PriceRangeSelector from './components/PriceRangeSelector';
import ProductList from './components/ProductList';
import './styles/App.css';

function App() {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([5000, 100000]);
  const [jewelryType, setJewelryType] = useState('all');

  // Function to load products from API
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProducts(
        priceRange[0], 
        priceRange[1], 
        jewelryType !== 'all' ? jewelryType : null
      );
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect hook to call API when filters change
  useEffect(() => {
    loadProducts();
  }, [priceRange, jewelryType]);
  
  // Event handlers
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };
  
  const handleFilterChange = (type) => {
    setJewelryType(type);
  };
  
  // Component render
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Firefly Diamonds Price Comparison</h1>
        <p>Compare jewelry prices across multiple retailers</p>
      </header>
      
      <main className="app-main">
        <div className="filter-section">
          <PriceRangeSelector 
            priceRange={priceRange} 
            setPriceRange={handlePriceRangeChange} 
          />
          
          <div className="jewelry-type-filter">
            <h3>Filter by Type</h3>
            <select 
              value={jewelryType} 
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Jewelry</option>
              <option value="ring">Rings</option>
              <option value="pendant">Pendants</option>
              <option value="earring">Earrings</option>
              <option value="bracelet">Bracelets</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <ProductList products={products} loading={loading} />
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Firefly Diamonds | Price Comparison Extension</p>
      </footer>
    </div>
  );
}

export default App;
