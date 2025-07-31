'use client';

import { useState } from 'react';

interface DataGeneratorConfigProps {
  onConfigChange: (config: {
    provider: 'local' | 'openai' | 'gemini';
    apiKey?: string;
  }) => void;
}

export default function DataGeneratorConfig({ onConfigChange }: DataGeneratorConfigProps) {
  const [provider, setProvider] = useState<'local' | 'openai' | 'gemini'>('local');
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleProviderChange = (newProvider: 'local' | 'openai' | 'gemini') => {
    setProvider(newProvider);
    onConfigChange({
      provider: newProvider,
      apiKey: newProvider === 'local' ? undefined : apiKey
    });
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (provider !== 'local') {
      onConfigChange({ provider, apiKey: key });
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowConfig(!showConfig)}
        className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Data Generation Settings
      </button>

      {showConfig && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Data Generation Method</h4>
          
          <div className="space-y-3">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generation Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="provider"
                    value="local"
                    checked={provider === 'local'}
                    onChange={() => handleProviderChange('local')}
                    className="mr-2"
                  />
                  <span className="text-sm">Local Generation (Fast, Basic)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="provider"
                    value="openai"
                    checked={provider === 'openai'}
                    onChange={() => handleProviderChange('openai')}
                    className="mr-2"
                  />
                  <span className="text-sm">OpenAI GPT (Realistic, Requires API Key)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="provider"
                    value="gemini"
                    checked={provider === 'gemini'}
                    onChange={() => handleProviderChange('gemini')}
                    className="mr-2"
                  />
                  <span className="text-sm">Google Gemini (Realistic, Requires API Key)</span>
                </label>
              </div>
            </div>

            {/* API Key Input */}
            {provider !== 'local' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : 'Google'} API key`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            )}

            {/* Info */}
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
              <p><strong>Local Generation:</strong> Uses JavaScript Math.random() for basic data generation.</p>
              <p><strong>API Generation:</strong> Uses AI models to generate more realistic and varied sensor data.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 