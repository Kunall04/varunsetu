import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Clock,
  AlertTriangle,
  Droplets,
  Wind,
  Zap,
  MapPin
} from 'lucide-react';
import { mockIncidents } from '../services/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [incidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [timeIndex, setTimeIndex] = useState(incidents.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [layers, setLayers] = useState({
    hotspots: true,
    heatmap: true,
    verified: true,
    unverified: true
  });

  // Timeline replay effect
  useEffect(() => {
    let interval;
    if (isPlaying && timeIndex < incidents.length - 1) {
      interval = setInterval(() => {
        setTimeIndex(prev => prev + 1);
      }, 1000);
    } else if (isPlaying && timeIndex >= incidents.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeIndex, incidents.length]);

  const getIncidentIcon = (type, verified) => {
    const color = verified ? 'green' : 'red';
    const iconMap = {
      tsunami: '🌊',
      flood: '🌊',
      oil_spill: '🛢️',
      storm_surge: '💨'
    };
    
    return L.divIcon({
      html: `<div style="
        background-color: ${color === 'green' ? '#10B981' : '#EF4444'};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${iconMap[type] || '⚠️'}</div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const getSeverityRadius = (severity) => {
    switch (severity) {
      case 'high': return 200;
      case 'medium': return 100;
      case 'low': return 50;
      default: return 75;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const visibleIncidents = incidents.slice(0, timeIndex + 1);

  const MapEvents = () => {
    useMapEvents({
      click: () => {
        setSelectedIncident(null);
      }
    });
    return null;
  };

  return (
    <div className="h-full relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        {/* Timeline Controls */}
        <div className="card-dark p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => {
                setTimeIndex(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-accent-grey/20 hover:bg-accent-grey/30 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <span className="text-sm text-accent-grey">
              {timeIndex + 1} / {incidents.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-accent-grey" />
            <input
              type="range"
              min="0"
              max={incidents.length - 1}
              value={timeIndex}
              onChange={(e) => setTimeIndex(parseInt(e.target.value))}
              className="flex-1 h-2 bg-accent-grey/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Layer Controls */}
        <div className="card-dark p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Layers size={16} className="text-accent-grey" />
            <span className="text-sm font-medium text-white">Layers</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.hotspots}
                onChange={(e) => setLayers(prev => ({ ...prev, hotspots: e.target.checked }))}
                className="rounded border-white/20 bg-transparent"
              />
              <span className="text-sm text-accent-grey">Hotspots</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.heatmap}
                onChange={(e) => setLayers(prev => ({ ...prev, heatmap: e.target.checked }))}
                className="rounded border-white/20 bg-transparent"
              />
              <span className="text-sm text-accent-grey">Heatmap</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.verified}
                onChange={(e) => setLayers(prev => ({ ...prev, verified: e.target.checked }))}
                className="rounded border-white/20 bg-transparent"
              />
              <span className="text-sm text-green-400">Verified</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.unverified}
                onChange={(e) => setLayers(prev => ({ ...prev, unverified: e.target.checked }))}
                className="rounded border-white/20 bg-transparent"
              />
              <span className="text-sm text-red-400">Unverified</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[15.3173, 76.7139]} // Center of India
        zoom={6}
        className="h-full w-full"
        style={{ backgroundColor: '#0A2540' }}
      >
        <MapEvents />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Incident Markers */}
        {visibleIncidents.map((incident) => {
          if (!layers.verified && incident.verified) return null;
          if (!layers.unverified && !incident.verified) return null;

          return (
            <React.Fragment key={incident.id}>
              <Marker
                position={incident.coordinates}
                icon={getIncidentIcon(incident.type, incident.verified)}
                eventHandlers={{
                  click: () => setSelectedIncident(incident)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      {getIncidentIcon(incident.type, incident.verified)}
                      <div>
                        <h3 className="font-semibold text-sm">{incident.location}</h3>
                        <p className="text-xs text-gray-600">{incident.type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{incident.content}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Confidence: {Math.round(incident.confidence * 100)}%</span>
                      <span>{incident.verified ? 'Verified' : 'Unverified'}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Hotspot Circles */}
              {layers.hotspots && (
                <CircleMarker
                  center={incident.coordinates}
                  radius={getSeverityRadius(incident.severity) / 1000}
                  pathOptions={{
                    color: getSeverityColor(incident.severity),
                    fillColor: getSeverityColor(incident.severity),
                    fillOpacity: 0.2,
                    weight: 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedIncident(incident)
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 z-[1000] card-dark p-4 max-h-64 overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white">{selectedIncident.location}</h3>
              <p className="text-sm text-accent-grey">
                {selectedIncident.type.replace('_', ' ').toUpperCase()} • {selectedIncident.severity.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-accent-grey hover:text-white"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-white mb-3">{selectedIncident.content}</p>
          
          <div className="flex items-center justify-between text-xs text-accent-grey">
            <span>Confidence: {Math.round(selectedIncident.confidence * 100)}%</span>
            <span>Source: {selectedIncident.source}</span>
            <span>{selectedIncident.verified ? 'Verified' : 'Unverified'}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;
