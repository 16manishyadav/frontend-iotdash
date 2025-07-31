# Field Insights Dashboard - Frontend

A modern, responsive React/Next.js frontend for the Field Insights Dashboard, built with TypeScript and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Analytics**: Live dashboard with auto-refresh capabilities
- **Data Upload**: JSON-based sensor data upload with validation
- **Interactive Charts**: Visual representation of field and sensor data
- **Mobile Responsive**: Optimized for all device sizes
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Heroicons (via SVG)
- **Charts**: Custom responsive charts with Tailwind

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main page with tab navigation
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Application header
│   ├── Dashboard.tsx       # Analytics dashboard
│   └── SensorDataForm.tsx  # Data upload form
└── lib/
    └── api.ts              # API service utilities
```

## Components

### Header Component
- Application branding and navigation
- System status indicator
- API status button

### Dashboard Component
- **Summary Cards**: Key metrics display
- **Field Analytics**: Average readings by field
- **Sensor Analytics**: Average readings by sensor type
- **Recent Readings**: Latest sensor data table
- **Auto-refresh**: Updates every 30 seconds

### SensorDataForm Component
- **JSON Input**: Structured data entry
- **Data Generation**: Sample and large dataset generation
- **Progress Tracking**: Upload progress indicator
- **Validation**: JSON format validation
- **Error Handling**: Comprehensive error messages

## API Integration

The frontend uses a flexible API service that supports both real backend calls and mock data for development:

### Real API (Production)
- Connects to FastAPI backend
- Handles authentication and error responses
- Supports real-time data processing

### Mock API (Development)
- Provides realistic mock data
- Simulates API delays and responses
- Enables frontend development without backend

## Data Format

### Sensor Reading Structure
```typescript
interface SensorReading {
  timestamp: string;      // ISO 8601 format
  field_id: string;       // Field identifier
  sensor_type: string;    // Sensor type
  reading_value: number;  // Numeric reading
  unit: string;          // Unit of measurement
}
```

### Analytics Response
```typescript
interface AnalyticsData {
  total_readings: number;
  fields: string[];
  sensor_types: string[];
  average_by_field: Record<string, number>;
  average_by_sensor_type: Record<string, number>;
  recent_readings?: SensorReading[];
}
```

## Usage

### Uploading Sensor Data
1. Navigate to the "Upload Data" tab
2. Use "Generate Sample Data" for testing
3. Or paste your JSON data in the textarea
4. Click "Submit Data" to process
5. Monitor progress and success/error messages

### Viewing Analytics
1. Navigate to the "Dashboard" tab
2. View summary cards for key metrics
3. Analyze field and sensor type averages
4. Review recent readings table
5. Use refresh button for latest data

## Development

### Adding New Components
1. Create component in `src/components/`
2. Use TypeScript interfaces for props
3. Follow Tailwind CSS conventions
4. Add proper error handling

### API Integration
1. Update `src/lib/api.ts` for new endpoints
2. Add corresponding mock data
3. Update TypeScript interfaces
4. Test with both real and mock APIs

### Styling
- Use Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent color scheme
- Use semantic HTML structure

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Set environment variables

### Static Export
```bash
npm run build
npm run export
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
