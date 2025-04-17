/**
 * API service for Firefly Diamonds application
 * Handles all API requests to the backend server
 */

// Use environment variable for API URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

/**
 * Fetches products based on price range and category
 * @param {number} minPrice - Minimum price filter
 * @param {number} maxPrice - Maximum price filter
 * @param {string} category - Product category filter
 * @returns {Promise<Array>} - Promise resolving to array of products
 */
export const fetchProducts = async (minPrice, maxPrice, category) => {
  try {
    const queryParams = new URLSearchParams();
    if (minPrice !== undefined) queryParams.append('min_price', minPrice);
    if (maxPrice !== undefined) queryParams.append('max_price', maxPrice);
    if (category) queryParams.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Gets detailed information for a specific product
 * @param {string} productId - ID of the product to fetch
 * @returns {Promise<Object>} - Promise resolving to product details
 */
export const getProductDetails = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

/**
 * Refreshes price information for a specific product
 * @param {string} productId - ID of the product to refresh
 * @returns {Promise<Object>} - Promise resolving to updated product data
 */
export const refreshProductPrices = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/refresh`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing product prices:', error);
    throw error;
  }
};
