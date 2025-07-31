'use client';

import { useState } from 'react';
import DataGeneratorConfig from './DataGeneratorConfig';

interface SensorReading {
  timestamp: string;
  field_id: string;
  sensor_type: string;
  reading_value: number;
  unit: string;
}

export default function SensorDataForm() {
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatorConfig, setGeneratorConfig] = useState({
    provider: 'local' as 'local' | 'openai' | 'gemini',
    apiKey: ''
  });

  const generateSampleData = () => {
    const sampleData: SensorReading[] = [
      {
        timestamp: new Date().toISOString(),
        field_id: "field_001",
        sensor_type: "soil_moisture",
        reading_value: 45.2,
        unit: "%"
      },
      {
        timestamp: new Date().toISOString(),
        field_id: "field_001",
        sensor_type: "temperature",
        reading_value: 22.5,
        unit: "°C"
      },
      {
        timestamp: new Date().toISOString(),
        field_id: "field_002",
        sensor_type: "humidity",
        reading_value: 65.8,
        unit: "%"
      }
    ];
    setJsonData(JSON.stringify(sampleData, null, 2));
  };

  const [generatingData, setGeneratingData] = useState(false);

  const generateLargeDataset = async () => {
    try {
      setGeneratingData(true);
      
      // Import the data generator
      const { DataGenerator } = await import('@/lib/dataGenerator');
      
      // Create generator with current config
      const generator = new DataGenerator(generatorConfig.provider, generatorConfig.apiKey);
      
      // Generate realistic data (can use API if configured)
      const data = await generator.generateRealisticData(100);
      
      setJsonData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to generate data:', error);
      // Fallback to local generation
      const data: SensorReading[] = [];
      const sensorTypes = ['soil_moisture', 'temperature', 'humidity', 'ph_level', 'nitrogen'];
      const fields = ['field_001', 'field_002', 'field_003', 'field_004', 'field_005'];
      
      for (let i = 0; i < 100; i++) {
        const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
        const field = fields[Math.floor(Math.random() * fields.length)];
        
        let readingValue: number;
        let unit: string;
        
        switch (sensorType) {
          case 'soil_moisture':
            readingValue = Math.random() * 70 + 15; // 15-85%
            unit = '%';
            break;
          case 'temperature':
            readingValue = Math.random() * 50 - 5; // -5 to 45°C
            unit = '°C';
            break;
          case 'humidity':
            readingValue = Math.random() * 65 + 30; // 30-95%
            unit = '%';
            break;
          case 'ph_level':
            readingValue = Math.random() * 3 + 5.5; // 5.5-8.5
            unit = 'pH';
            break;
          case 'nitrogen':
            readingValue = Math.random() * 200; // 0-200 ppm
            unit = 'ppm';
            break;
          default:
            readingValue = Math.random() * 100;
            unit = 'units';
        }
        
        data.push({
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          field_id: field,
          sensor_type: sensorType,
          reading_value: parseFloat(readingValue.toFixed(2)),
          unit
        });
      }
      
      setJsonData(JSON.stringify(data, null, 2));
    } finally {
      setGeneratingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!jsonData.trim()) {
      setMessage({ type: 'error', text: 'Please enter JSON data' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      setUploadProgress(0);

      const data = JSON.parse(jsonData);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Use API service
      const { apiService } = await import('@/lib/api');
      const result = await apiService.uploadSensorData(Array.isArray(data) ? data : [data]);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setMessage({ 
        type: 'success', 
        text: result.message || `Successfully processed ${Array.isArray(data) ? data.length : 1} sensor readings` 
      });
      setJsonData('');
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Invalid JSON format. Please check your data structure.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Sensor Data</h2>
          <p className="text-gray-600">Upload sensor readings in JSON format to process and analyze field data.</p>
          
          {/* Data Generation Configuration */}
          <DataGeneratorConfig onConfigChange={setGeneratorConfig} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={generateSampleData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Generate Sample Data
          </button>
                     <button 
             onClick={generateLargeDataset}
             disabled={generatingData}
             className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
           >
             {generatingData ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Generating...
               </>
             ) : (
               'Generate Large Dataset (100 records)'
             )}
           </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Submit Data'
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Processing data... {uploadProgress}%</p>
          </div>
        )}

        {/* JSON Input */}
        <div className="mb-4">
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
            Sensor Data (JSON Format)
          </label>
          <textarea
            id="jsonInput"
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            placeholder='[
  {
    "timestamp": "2024-01-01T10:00:00Z",
    "field_id": "field_001",
    "sensor_type": "soil_moisture",
    "reading_value": 45.2,
    "unit": "%"
  }
]'
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
          />
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Data Format Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Expected Data Format:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>timestamp:</strong> ISO 8601 format (e.g., "2024-01-01T10:00:00Z")</p>
            <p>• <strong>field_id:</strong> String identifier for the field (e.g., "field_001")</p>
            <p>• <strong>sensor_type:</strong> Type of sensor (e.g., "soil_moisture", "temperature")</p>
            <p>• <strong>reading_value:</strong> Numeric sensor reading</p>
            <p>• <strong>unit:</strong> Unit of measurement (e.g., "%", "°C", "ppm")</p>
          </div>
        </div>
      </div>
    </div>
  );
} 