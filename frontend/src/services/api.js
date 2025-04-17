const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://firefly-diamonds-api.onrender.com/api/v1' 
  : '/api/v1';



// Function to fetch products based on price range
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

// Function to get product details
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

// Function to refresh product prices
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

