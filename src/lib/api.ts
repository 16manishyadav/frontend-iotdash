import axios from 'axios';

// API base URL - change this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const sensorAPI = {
  // Upload sensor data
  uploadSensorData: async (data: any[]) => {
    try {
      const response = await api.post('/sensor-data', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to upload sensor data');
    }
  },

  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch analytics');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Backend service is not available');
    }
  },
};

// Mock API functions for development (when backend is not available)
export const mockAPI = {
  uploadSensorData: async (data: any[]) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success response
    return {
      message: `Successfully processed ${data.length} sensor readings`,
      processed_count: data.length,
      timestamp: new Date().toISOString()
    };
  },

  getAnalytics: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock analytics data
    return {
      total_readings: 1247,
      fields: ['field_001', 'field_002', 'field_003', 'field_004', 'field_005'],
      sensor_types: ['soil_moisture', 'temperature', 'humidity', 'ph_level', 'nitrogen'],
      average_by_field: {
        'field_001': 45.2,
        'field_002': 52.8,
        'field_003': 38.9,
        'field_004': 61.3,
        'field_005': 47.6
      },
      average_by_sensor_type: {
        'soil_moisture': 48.5,
        'temperature': 22.3,
        'humidity': 65.7,
        'ph_level': 6.8,
        'nitrogen': 85.2
      },
      recent_readings: [
        {
          timestamp: new Date().toISOString(),
          field_id: 'field_001',
          sensor_type: 'soil_moisture',
          reading_value: 45.2,
          unit: '%'
        },
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          field_id: 'field_002',
          sensor_type: 'temperature',
          reading_value: 22.5,
          unit: '°C'
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(),
          field_id: 'field_003',
          sensor_type: 'humidity',
          reading_value: 65.8,
          unit: '%'
        }
      ]
    };
  },

  healthCheck: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 'healthy', timestamp: new Date().toISOString() };
  },
};

// Export the appropriate API based on environment
// For now, use real API - change this to mockAPI for development without backend
export const apiService = sensorAPI; 