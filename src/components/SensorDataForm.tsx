'use client';

import { useState } from 'react';
import { dataGenerator } from '@/lib/dataGenerator';
import { apiService } from '@/lib/api';
import axios from 'axios';

export default function SensorDataForm() {
  const [sensorData, setSensorData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorData.trim()) {
      setMessage('Please enter sensor data');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setUploadProgress(0);

    try {
      // Start progress simulation for cloud submission
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const data = JSON.parse(sensorData);
      const response = await apiService.uploadSensorData(data);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setMessage('Data uploaded successfully!');
      setSensorData('');
      
      // Reset progress after 2 seconds
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      
      let errorMessage = 'Failed to upload data. Please try again.';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomData = async () => {
    setIsGenerating(true);
    setMessage('');

    try {
      const data = await dataGenerator.generateRealisticData(20); // Reduced to 20 records
      setSensorData(JSON.stringify(data, null, 2));
      setMessage('Random data generated successfully! (20 records)');
    } catch (error: unknown) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate random data';
      setMessage(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Upload Sensor Data
        </h2>
        <p className="text-slate-600">Generate or upload sensor readings for analysis</p>
      </div>
      
      {/* Data Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Random Generation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Generate Random Data</h3>
              <p className="text-sm text-slate-600">Create 20 realistic sensor readings</p>
            </div>
          </div>
          <button
            onClick={generateRandomData}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Random Data'
            )}
          </button>
        </div>

        {/* Manual Entry */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Manual Data Entry</h3>
              <p className="text-sm text-slate-600">Paste your JSON data below</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 font-medium">Format Requirements</p>
            <p className="text-xs text-green-700 mt-1">Array of objects with: timestamp, field_id, sensor_type, reading_value, unit</p>
          </div>
        </div>
      </div>

      {/* Data Input Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sensorData" className="block text-sm font-semibold text-slate-700 mb-3">
              Sensor Data (JSON Format)
            </label>
            <textarea
              id="sensorData"
              value={sensorData}
              onChange={(e) => setSensorData(e.target.value)}
              placeholder={`[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "field_id": "field_001",
    "sensor_type": "soil_moisture",
    "reading_value": 45.2,
    "unit": "%"
  }
]`}
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white/50 backdrop-blur-sm resize-none"
              required
            />
          </div>

          {/* Upload Progress */}
          {isSubmitting && (
            <div className="space-y-3">
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Uploading to cloud...</span>
                <span>{uploadProgress}%</span>
              </div>
              <p className="text-xs text-slate-500">This may take up to 30 seconds for cloud processing</p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-xl text-sm border ${
              message.includes('success') 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {message.includes('success') ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !sensorData.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading to Cloud...</span>
              </div>
            ) : (
              'Upload Data'
            )}
          </button>
        </form>
      </div>

      {/* Data Format Guide */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data Format Requirements</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>timestamp:</strong> ISO 8601 format (e.g., "2024-01-15T10:30:00Z")</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>field_id:</strong> One of ["field_001", "field_002", "field_003", "field_004", "field_005"]</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span><strong>sensor_type:</strong> One of ["soil_moisture", "temperature", "humidity", "ph_level", "nitrogen"]</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span><strong>reading_value:</strong> Numeric value appropriate for the sensor type</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span><strong>unit:</strong> Appropriate unit for the sensor type</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 