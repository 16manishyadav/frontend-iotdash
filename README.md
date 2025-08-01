# IoT Sensor Dashboard - Frontend

A modern, responsive React/Next.js frontend for IoT sensor data visualization and management, built with TypeScript and Tailwind CSS.

## 🚀 Features & Functionalities

### **Dashboard Analytics**
- **Real-time Data Visualization**: Live sensor readings with auto-refresh
- **Overview Metrics**: Total readings, active fields, sensor types, and data quality
- **Field Performance**: Individual field analytics with color-coded performance indicators
- **Sensor Type Analytics**: Breakdown by sensor type (soil moisture, temperature, humidity, pH, nitrogen)
- **Recent Readings Table**: Latest sensor data with timestamps and values
- **Interactive UI**: Modern glassmorphism design with gradients and animations

### **Data Management**
- **Random Data Generation**: Generate 20 realistic sensor readings automatically
- **Manual Data Upload**: Paste JSON data with real-time validation
- **Progress Tracking**: Visual upload progress with cloud processing simulation
- **Error Handling**: Comprehensive error messages and validation feedback
- **Data Format Guide**: Built-in documentation for JSON structure requirements

### **Technical Features**
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Glassmorphism effects, gradients, and smooth animations
- **API Integration**: Flexible backend integration with error handling
- **Environment Configuration**: Easy setup with environment variables

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **HTTP Client**: Axios
- **Icons**: Heroicons (SVG)
- **Build Tool**: Vite (via Next.js)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Backend API**: FastAPI backend running (optional for development)

## 🚀 Local Development Setup

### **Step 1: Clone the Repository**
```bash
git clone <your-repository-url>
cd frontend-iotdash
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Environment Configuration**
Create a `.env.local` file in the root directory:

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: For production deployment
# NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### **Step 4: Start Development Server**
```bash
npm run dev
```

### **Step 5: Access the Application**
Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
frontend-iotdash/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Main page with tab system
│   │   └── globals.css         # Global styles and Tailwind
│   ├── components/
│   │   ├── Header.tsx          # Application header with branding
│   │   ├── Dashboard.tsx       # Analytics dashboard component
│   │   └── SensorDataForm.tsx  # Data upload and generation form
│   └── lib/
│       ├── api.ts              # API service and HTTP client
│       └── dataGenerator.ts    # Random data generation utility
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── eslint.config.mjs          # ESLint configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Deployment

### **Option 1: Vercel (Recommended)**

1. **Connect to Vercel:**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will auto-detect Next.js configuration

2. **Environment Variables:**
   In your Vercel dashboard, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Each push to main branch triggers a new deployment

### **Option 2: Manual Deployment**

1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Start Production Server:**
   ```bash
   npm start
   ```

### **Option 3: Docker Deployment**

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t iot-dashboard .
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-api iot-dashboard
   ```

## 🔧 Configuration Examples

### **Environment Variables Reference**

#### **Development (.env.local)**
```env
# Local development
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### **Production (.env.production)**
```env
# Production backend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### **Staging (.env.staging)**
```env
# Staging environment
NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com
```

### **Backend API Endpoints**

The frontend expects these endpoints from your backend:

```typescript
// POST /sensor-data
// Upload sensor readings
{
  "timestamp": "2024-01-15T10:30:00Z",
  "field_id": "field_001",
  "sensor_type": "soil_moisture",
  "reading_value": 45.2,
  "unit": "%"
}

// GET /analytics
// Retrieve analytics data
{
  "total_readings": 1250,
  "fields": ["field_001", "field_002"],
  "sensor_types": ["soil_moisture", "temperature"],
  "average_by_field": {"field_001": 45.2},
  "average_by_sensor_type": {"soil_moisture": 42.1},
  "recent_readings": [...]
}
```

## 📊 Data Format

### **Sensor Data JSON Structure**
```json
[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "field_id": "field_001",
    "sensor_type": "soil_moisture",
    "reading_value": 45.2,
    "unit": "%"
  }
]
```

### **Supported Sensor Types**
- `soil_moisture` - Soil moisture percentage
- `temperature` - Temperature in Celsius
- `humidity` - Humidity percentage
- `ph_level` - pH level measurement
- `nitrogen` - Nitrogen content

### **Supported Field IDs**
- `field_001` through `field_005`

## 🐛 Troubleshooting

### **Common Issues**

1. **Build Errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **API Connection Issues:**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check if backend is running
   - Ensure CORS is configured on backend

3. **TypeScript Errors:**
   ```bash
   # Check for type errors
   npm run lint
   ```

### **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the environment configuration examples

---

**Happy Coding! 🚀**
