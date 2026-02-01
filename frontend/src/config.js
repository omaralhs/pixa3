// API Configuration
// This file centralizes the API URL configuration

// Use environment variable if available, otherwise use production URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://54.88.53.94';

// Export for easy import
export default API_URL;
