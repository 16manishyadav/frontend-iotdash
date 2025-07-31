interface SensorReading {
  timestamp: string;
  field_id: string;
  sensor_type: string;
  reading_value: number;
  unit: string;
}

export class DataGenerator {
  /**
   * Generate realistic sensor data locally
   */
  async generateRealisticData(count: number = 100): Promise<SensorReading[]> {
    return this.generateLocalData(count);
  }

  /**
   * Generate data locally
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
export const dataGenerator = new DataGenerator(); 