'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import SensorDataForm from '@/components/SensorDataForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'View analytics and sensor data'
    },
    {
      id: 'upload',
      name: 'Upload Data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      description: 'Upload sensor readings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'dashboard' | 'upload')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Description */}
          <div className="mt-4 text-center">
            <p className="text-slate-600 text-sm">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'upload' && <SensorDataForm />}
        </div>
      </main>
    </div>
  );
}
