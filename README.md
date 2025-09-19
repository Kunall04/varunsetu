# Varunsetu - Bridge of Safety for Ocean Hazards

A comprehensive internal dashboard for analysts and authorities to monitor and respond to ocean hazard incidents in real-time.

## 🎯 Features

- **Real-time Incident Feed**: Live stream of social media, crowdsourced, and sensor data
- **Interactive Map**: Full-featured map with hotspots, heatmaps, and timeline replay
- **ML Insights**: AI-powered analysis with seriousness scores and trending keywords
- **Authority Tools**: Notification system with pre-filled templates
- **Analytics Dashboard**: Comprehensive charts and regional impact analysis
- **Audit Logging**: Complete tracking of analyst actions and system activities

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom ocean-themed design system
- **Maps**: React-Leaflet with custom markers and layers
- **Charts**: Recharts for analytics visualization
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🎨 Design System

### Colors
- **Background**: Black (#000000)
- **Primary**: Deep ocean blue (#0A2540, #102A43)
- **Secondary**: Light/Dark blue shades (#1E3A8A, #3B82F6)
- **Accents**: White (#FFFFFF) + Grey (#CBD5E1)

### Layout
- **3-Pane Design**: Left Sidebar (Incidents) - Map - Right Sidebar (Insights)
- **Glassmorphism**: Frosted glass effects with soft shadows
- **Responsive**: Collapsible sidebars for mobile/tablet views

## 📱 Components

### Left Sidebar - Incident Feed
- Real-time incident stream with filtering
- Actions: Verify, Mark Fake, Notify authorities
- Expandable incident details with ML confidence scores

### Center Panel - Interactive Map
- Full-screen map with multiple layers
- Timeline slider for hazard progression replay
- Clickable hotspots with incident details
- Layer controls for different data views

### Right Sidebar - ML Insights
- Hazard seriousness scoring
- Verification statistics
- Trending keywords analysis
- Regional impact assessment
- Authority notification tools

### Analytics Tab
- Pie charts for hazard distribution
- Line charts for incident growth
- Bar charts for location-based stats
- Top 5 active coastal regions

### Audit Log
- Complete action tracking
- User activity monitoring
- Filterable log entries
- Summary statistics

## 🔧 Development

The project uses a modular component structure:

```
src/
├── components/          # Reusable UI components
├── services/           # Mock data and API services
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── styles/             # Global styles
```

## 📊 Mock Data

The application includes realistic mock data for:
- Ocean hazard incidents (tsunami, flood, oil spill, storm surge)
- Regional impact statistics
- ML insights and trending keywords
- Notification templates
- Audit log entries

## 🌊 Ocean Hazards Covered

- **Tsunami**: Wave alerts and evacuation warnings
- **Flood**: Inland flooding and water level monitoring
- **Oil Spill**: Environmental contamination tracking
- **Storm Surge**: Coastal flooding and wind warnings

## 🔐 Security Note

This is an internal dashboard for authorized analysts and authorities only. It is not intended for public use or citizen access.

## 📝 License

This project is developed for internal use by ocean hazard monitoring authorities.