import React, { useState, useEffect } from 'react';
import '../styles/PriceRangeSelector.css';

const PriceRangeSelector = ({ priceRange, setPriceRange }) => {
  const [minInput, setMinInput] = useState(priceRange[0]);
  const [maxInput, setMaxInput] = useState(priceRange[1]);
  
  // Update inputs when slider changes
  useEffect(() => {
    setMinInput(priceRange[0]);
    setMaxInput(priceRange[1]);
  }, [priceRange]);

  const handleSliderChange = (event) => {
    const value = Number(event.target.value);
    if (event.target.id === 'min-price') {
      if (value < maxInput) {
        setPriceRange([value, maxInput]);
      }
    } else {
      if (value > minInput) {
        setPriceRange([minInput, value]);
      }
    }
  };

  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value < maxInput) {
      setMinInput(value);
    }
  };

  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);
    if (value > minInput && value <= 500000) {
      setMaxInput(value);
    }
  };

  const handleInputBlur = () => {
    setPriceRange([minInput, maxInput]);
  };

  return (
    <div className="price-range-container">
      <h3>Select Price Range (₹)</h3>
      
      <div className="price-inputs">
        <div className="input-field">
          <label>Min Price</label>
          <input
            type="number"
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={handleInputBlur}
            min="0"
            max={maxInput - 1000}
          />
        </div>
        
        <div className="input-field">
          <label>Max Price</label>
          <input
            type="number"
            value={maxInput}
            onChange={handleMaxInputChange}
            onBlur={handleInputBlur}
            min={minInput + 1000}
            max="500000"
          />
        </div>
      </div>
      
      <div className="slider-container">
        <input
          id="min-price"
          type="range"
          min="0"
          max="500000"
          step="1000"
          value={minInput}
          onChange={handleSliderChange}
          className="slider"
        />
        <input
          id="max-price"
          type="range"
          min="0"
          max="500000"
          step="1000"
          value={maxInput}
          onChange={handleSliderChange}
          className="slider"
        />
        <div className="slider-labels">
          <span>₹0</span>
          <span>₹500,000</span>
        </div>
      </div>
      
      <div className="selected-range">
        Selected Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
      </div>
    </div>
  );
};

export default PriceRangeSelector;
