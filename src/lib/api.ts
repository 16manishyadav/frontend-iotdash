import axios from 'axios';

// Create axios instance with base configuration
const sensorAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000, // Increased timeout to 30 seconds for cloud submission
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
sensorAPI.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
sensorAPI.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Provide more specific error messages
    if (error.response?.status === 404) {
      error.message = 'API endpoint not found. Please check if the backend is running and the endpoint is correct.';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Cannot connect to backend. Please check if the server is running.';
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// Define types for sensor data
interface SensorReading {
  timestamp: string;
  field_id: string;
  sensor_type: string;
  reading_value: number;
  unit: string;
}

// API service functions
export const apiService = {
  async uploadSensorData(data: SensorReading[]) {
    const response = await sensorAPI.post('/sensor-data', data);
    return response.data;
  },

  async getAnalytics() {
    const response = await sensorAPI.get('/analytics');
    return response.data;
  }
}; 