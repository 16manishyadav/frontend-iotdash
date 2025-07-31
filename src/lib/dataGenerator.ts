import axios from 'axios';

interface SensorReading {
  timestamp: string;
  field_id: string;
  sensor_type: string;
  reading_value: number;
  unit: string;
}

// Configuration for different LLM APIs
const API_CONFIGS = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export class DataGenerator {
  private apiKey: string;
  private provider: 'openai' | 'gemini' | 'local';

  constructor(provider: 'openai' | 'gemini' | 'local' = 'local', apiKey?: string) {
    this.provider = provider;
    this.apiKey = apiKey || '';
  }

  /**
   * Generate realistic sensor data using API calls
   */
  async generateRealisticData(count: number = 100): Promise<SensorReading[]> {
    if (this.provider === 'local') {
      return this.generateLocalData(count);
    }

    try {
      const prompt = this.createPrompt(count);
      const response = await this.callLLMAPI(prompt);
      return this.parseAPIResponse(response);
    } catch (error) {
      console.error('API generation failed, falling back to local generation:', error);
      return this.generateLocalData(count);
    }
  }

  /**
   * Create a prompt for LLM API
   */
  private createPrompt(count: number): string {
    return `Generate ${count} realistic agricultural sensor readings in JSON format. Each reading should have:
- timestamp: ISO 8601 format from the last 30 days
- field_id: one of ["field_001", "field_002", "field_003", "field_004", "field_005"]
- sensor_type: one of ["soil_moisture", "temperature", "humidity", "ph_level", "nitrogen"]
- reading_value: realistic numeric value based on sensor type
- unit: appropriate unit for the sensor type

Sensor type ranges:
- soil_moisture: 15-85% (percentage)
- temperature: -5 to 45°C (celsius)
- humidity: 30-95% (percentage)
- ph_level: 5.5-8.5 (pH)
- nitrogen: 0-200 ppm (parts per million)

Return only valid JSON array, no explanations.`;
  }

  /**
   * Call the appropriate LLM API
   */
  private async callLLMAPI(prompt: string): Promise<any> {
    const config = API_CONFIGS[this.provider];
    
    if (this.provider === 'openai') {
      const headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      };
      
      const response = await axios.post(config.url, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      }, { headers });
      
      return response.data.choices[0].message.content;
    }
    
    if (this.provider === 'gemini') {
      const apiKey = this.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const response = await axios.post(`${config.url}?key=${apiKey}`, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, { headers: config.headers });
      
      return response.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unsupported provider');
  }

  /**
   * Parse API response into sensor readings
   */
  private parseAPIResponse(response: string): SensorReading[] {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\[.*\]/s);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      
      const data = JSON.parse(jsonString);
      
      // Validate and clean the data
      return data.map((item: any) => ({
        timestamp: item.timestamp,
        field_id: item.field_id,
        sensor_type: item.sensor_type,
        reading_value: parseFloat(item.reading_value),
        unit: item.unit
      }));
    } catch (error) {
      console.error('Failed to parse API response:', error);
      throw new Error('Invalid response format from API');
    }
  }

  /**
   * Generate data locally (fallback method)
   */
  private generateLocalData(count: number): SensorReading[] {
    const data: SensorReading[] = [];
    const sensorTypes = ['soil_moisture', 'temperature', 'humidity', 'ph_level', 'nitrogen'];
    const fields = ['field_001', 'field_002', 'field_003', 'field_004', 'field_005'];
    
    for (let i = 0; i < count; i++) {
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
    
    return data;
  }
}

// Export singleton instance
export const dataGenerator = new DataGenerator('local'); 