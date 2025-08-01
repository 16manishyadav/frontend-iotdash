'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import axios from 'axios';

interface AnalyticsData {
  total_readings: number;
  fields: string[];
  sensor_types: string[];
  average_by_field: Record<string, number>;
  average_by_sensor_type: Record<string, number>;
  recent_readings: Array<{
    timestamp: string;
    field_id: string;
    sensor_type: string;
    reading_value: number;
    unit: string;
  }>;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAnalytics();
        setAnalytics(data);
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch analytics';
        
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const getSensorIcon = (sensorType: string) => {
    const icons: Record<string, string> = {
      soil_moisture: '💧',
      temperature: '🌡️',
      humidity: '💨',
      ph_level: '🧪',
      nitrogen: '🌱'
    };
    return icons[sensorType] || '📊';
  };

  const getFieldColor = (fieldId: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600'];
    const index = parseInt(fieldId.split('_')[1]) - 1;
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Readings</p>
              <p className="text-3xl font-bold text-slate-900">{analytics.total_readings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Fields</p>
              <p className="text-3xl font-bold text-slate-900">{analytics.fields.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Sensor Types</p>
              <p className="text-3xl font-bold text-slate-900">{analytics.sensor_types.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Data Quality</p>
              <p className="text-3xl font-bold text-slate-900">98%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Field Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Field Performance</h3>
          <div className="space-y-4">
            {analytics.fields.map((field) => (
              <div key={field} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getFieldColor(field)} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    {field.split('_')[1]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{field}</p>
                    <p className="text-sm text-slate-500">Average: {analytics.average_by_field[field]?.toFixed(1) || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${Math.min((analytics.average_by_field[field] || 0) / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sensor Types</h3>
          <div className="space-y-4">
            {analytics.sensor_types.map((sensorType) => (
              <div key={sensorType} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                    {getSensorIcon(sensorType)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{sensorType.replace('_', ' ')}</p>
                    <p className="text-sm text-slate-500">Average: {analytics.average_by_sensor_type[sensorType]?.toFixed(1) || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${Math.min((analytics.average_by_sensor_type[sensorType] || 0) / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Readings */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Readings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Field</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Sensor</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Value</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Unit</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recent_readings.map((reading, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {new Date(reading.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getFieldColor(reading.field_id)} text-white`}>
                      {reading.field_id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSensorIcon(reading.sensor_type)}</span>
                      <span className="text-sm text-slate-700 capitalize">{reading.sensor_type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{reading.reading_value}</td>
                  <td className="py-3 px-4 text-sm text-slate-500">{reading.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 