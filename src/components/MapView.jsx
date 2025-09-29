// MapView.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Clock
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
  const [incidents, setIncidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [timeIndex, setTimeIndex] = useState(mockIncidents.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sseStatus, setSseStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'
  const [layers, setLayers] = useState({
    hotspots: true,
    heatmap: true,
    verified: true,
    unverified: true
  });
  const [toasts, setToasts] = useState([]);
  const [newIncidentIds, setNewIncidentIds] = useState(new Set());
  const [mapKey, setMapKey] = useState(0); // Force map re-render

  // Toast management functions
  const addToast = (incident) => {
    console.log("Adding toast for incident:", incident);
    const toastId = Date.now() + Math.random();
    const newToast = {
      id: toastId,
      incident,
      timestamp: new Date(),
      type: incident.verified ? 'success' : 'warning'
    };
    
    console.log("New toast object:", newToast);
    
    setToasts(prev => {
      const updated = [...prev, newToast];
      console.log("Updated toasts array:", updated);
      return updated;
    });
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(toastId);
    }, 5000);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  useEffect(() => {
    let eventSource;
    let reconnectTimeout;
    let shouldReconnect = true;

    const connectToSSE = () => {
      if (!shouldReconnect) return;

      eventSource = new EventSource("http://localhost:8000/events");

      eventSource.onopen = () => {
        console.log("SSE connection established");
        setSseStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const newIncident = JSON.parse(event.data);
          console.log("SSE data received:", newIncident);
          console.log("SSE data keys:", Object.keys(newIncident));
          console.log("SSE data type:", typeof newIncident);
          
          // Helper function to safely convert any value to string
          const safeString = (value) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') {
              return JSON.stringify(value);
            }
            return String(value);
          };
          
          // Helper function to extract content from various possible fields
          const extractContent = (data) => {
            // Check for common content fields
            if (data.content) return safeString(data.content);
            if (data.description) return safeString(data.description);
            if (data.message) return safeString(data.message);
            if (data.citizen_report) return safeString(data.citizen_report);
            if (data.analysis_report) return safeString(data.analysis_report);
            if (data.social_media_text) return safeString(data.social_media_text);
            
            // If it's an object, try to find text content
            if (typeof data === 'object') {
              const textFields = ['text', 'content', 'description', 'message', 'report'];
              for (const field of textFields) {
                if (data[field]) return safeString(data[field]);
              }
            }
            
            return 'No description available';
          };
          
          // Helper function to extract location
          const extractLocation = (data) => {
            if (data.location) return safeString(data.location);
            if (data.place) return safeString(data.place);
            if (data.area) return safeString(data.area);
            if (data.region) return safeString(data.region);
            return 'Unknown Location';
          };
          
          // Helper function to extract coordinates
          const extractCoordinates = (data) => {
            console.log("Extracting coordinates from data:", data);
            
            // Try different coordinate formats
            if (data.coordinates ) {
              const coords = [Number(data.coordinates.latitude) || 0, data.coordinates.longitude || 0];
              console.log("Found coordinates array:", coords);
              return coords;
            }
            
            // if (data.lat && data.lng) {
            //   const coords = [Number(data.lat) || 0, Number(data.lng) || 0];
            //   console.log("Found lat/lng:", coords);
            //   return coords;
            // }
            
            if (data.latitude && data.longitude) {
              const coords = [Number(data.latitude) || 0, Number(data.longitude) || 0];
              console.log("Found latitude/longitude:", coords);
              return coords;
            }
            
            // Try nested coordinate objects
            if (data.location && data.location.coordinates) {
              const coords = [Number(data.location.coordinates[0]) || 0, Number(data.location.coordinates[1]) || 0];
              console.log("Found location.coordinates:", coords);
              return coords;
            }
            
            if (data.location && data.location.lat && data.location.lng) {
              const coords = [Number(data.location.lat) || 0, Number(data.location.lng) || 0];
              console.log("Found location.lat/lng:", coords);
              return coords;
            }
            
            // Try position object
            if (data.position && data.position.lat && data.position.lng) {
              const coords = [Number(data.position.lat) || 0, Number(data.position.lng) || 0];
              console.log("Found position.lat/lng:", coords);
              return coords;
            }
            
            // Try geo object
            if (data.geo && data.geo.lat && data.geo.lng) {
              const coords = [Number(data.geo.lat) || 0, Number(data.geo.lng) || 0];
              console.log("Found geo.lat/lng:", coords);
              return coords;
            }
            
            // Try lng/lat format (sometimes longitude comes first)
            if (data.lng && data.lat) {
              const coords = [Number(data.lat) || 0, Number(data.lng) || 0];
              console.log("Found lng/lat (swapped):", coords);
              return coords;
            }
            
            console.warn("⚠️ No valid coordinates found in data:", data);
            console.warn("Available data fields:", Object.keys(data));
            console.warn("Using default coordinates [0, 0] - marker will appear at center of map");
            return [0, 0];
          };
          
          // Ensure the incident has all required fields with safe string conversion
          const processedIncident = {
            id: safeString(newIncident.id) || Date.now() + Math.random(),
            type: safeString(newIncident.type) || 'unknown',
            severity: safeString(newIncident.severity) || 'medium',
            location: extractLocation(newIncident),
            coordinates: extractCoordinates(newIncident),
            timestamp: newIncident.timestamp ? new Date(newIncident.timestamp) : new Date(),
            source: safeString(newIncident.source) || 'sse',
            content: extractContent(newIncident),
            confidence: typeof newIncident.confidence === 'number' ? newIncident.confidence : 0.5,
            verified: Boolean(newIncident.verified),
            image: safeString(newIncident.image) || '',
            reporter: safeString(newIncident.reporter) || 'Unknown',
            tags: Array.isArray(newIncident.tags) ? newIncident.tags.map(safeString) : []
          };
          
          console.log("Processed incident:", processedIncident);
          
          // Validate coordinates
          const [lat, lng] = processedIncident.coordinates;
          if (lat === 0 && lng === 0) {
            console.error("❌ Invalid coordinates detected! Incident will appear at map center.");
            console.error("Original data:", newIncident);
            console.error("Please check your SSE data structure for coordinate fields.");
          } else {
            console.log("✅ Valid coordinates found:", processedIncident.coordinates);
            console.log("📍 Location:", processedIncident.location);
          }
          
          setIncidents((prev) => {
            const updated = [...prev, processedIncident];
            console.log("Updated incidents array length:", updated.length);
            console.log("New incident coordinates:", processedIncident.coordinates);
            console.log("New incident location:", processedIncident.location);
            
            // Mark this incident as new for highlighting
            setNewIncidentIds(prev => new Set([...prev, processedIncident.id]));
            
            // Remove the highlight after 5 seconds
            setTimeout(() => {
              setNewIncidentIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(processedIncident.id);
                return newSet;
              });
            }, 5000);
            
            // Force map re-render to ensure new markers appear
            setMapKey(prev => prev + 1);
            
            return updated;
          });
          
          // Show toast notification for new incident
          try {
            addToast(processedIncident);
            console.log("Toast added successfully for incident:", processedIncident.id);
          } catch (error) {
            console.error("Error adding toast:", error);
          }
          
        } catch (err) {
          console.error("Failed to parse SSE event:", err);
          console.error("Raw event data:", event.data);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setSseStatus('error');
        
        // Only attempt reconnection if the connection was not manually closed
        if (shouldReconnect && eventSource.readyState !== EventSource.CLOSED) {
          console.log("Attempting to reconnect SSE in 3 seconds...");
          setSseStatus('connecting');
          eventSource.close();
          
          // Retry connection after 3 seconds
          reconnectTimeout = setTimeout(() => {
            connectToSSE();
          }, 3000);
        }
      };
    };

    // Initial connection
    connectToSSE();

    return () => {
      shouldReconnect = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

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

  // Auto-update timeIndex when new incidents are added (if not playing)
  useEffect(() => {
    if (!isPlaying && incidents.length > 0) {
      setTimeIndex(incidents.length - 1);
    }
  }, [incidents.length, isPlaying]);

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

        {/* SSE Status */}
        <div className="card-dark p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              sseStatus === 'connected' ? 'bg-green-500' : 
              sseStatus === 'connecting' ? 'bg-yellow-500' : 
              sseStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm text-accent-grey">
              SSE: {sseStatus.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-accent-grey mb-2">
            Total Incidents: {incidents.length}
          </div>
          <div className="text-xs text-accent-grey mb-2">
            New Incidents: {newIncidentIds.size}
          </div>
          <div className="text-xs text-accent-grey mb-2">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                const testIncident = {
                  id: Date.now(),
                  type: 'test',
                  severity: 'medium',
                  location: 'Test Location',
                  coordinates: [15.3173, 76.7139],
                  timestamp: new Date(),
                  source: 'test',
                  content: 'This is a test incident to check toast functionality',
                  confidence: 0.8,
                  verified: true,
                  image: '',
                  reporter: 'Test User',
                  tags: ['test']
                };
                addToast(testIncident);
              }}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded w-full"
            >
              Test Toast
            </button>
            <button
              onClick={() => {
                const testIncident = {
                  id: Date.now(),
                  type: 'tsunami',
                  severity: 'high',
                  location: 'Mumbai, Maharashtra',
                  coordinates: [19.0760, 72.8777],
                  timestamp: new Date(),
                  source: 'test',
                  content: 'Test tsunami incident with coordinates',
                  confidence: 0.9,
                  verified: false,
                  image: '',
                  reporter: 'Test User',
                  tags: ['test', 'tsunami']
                };
                
                // Add to incidents array
                setIncidents(prev => [...prev, testIncident]);
                
                // Mark as new
                setNewIncidentIds(prev => new Set([...prev, testIncident.id]));
                
                // Remove highlight after 5 seconds
                setTimeout(() => {
                  setNewIncidentIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(testIncident.id);
                    return newSet;
                  });
                }, 5000);
                
                // Show toast
                addToast(testIncident);
              }}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded w-full"
            >
              Test Map Marker
            </button>
          </div>
        </div>

        {/* Debug Panel - Last 3 Incidents */}
        <div className="card-dark p-3">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-white">Recent Incidents</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {incidents.slice(-3).map((incident, index) => (
              <div key={incident.id} className="text-xs">
                <div className="text-white font-medium">
                  {incident.type?.toUpperCase() || 'UNKNOWN'}
                </div>
                <div className="text-accent-grey">
                  {incident.location || 'Unknown Location'}
                </div>
                <div className="text-accent-grey">
                  Coords: [{incident.coordinates[0]}, {incident.coordinates[1]}]
                </div>
                <div className={`text-xs ${incident.coordinates[0] === 0 && incident.coordinates[1] === 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {incident.coordinates[0] === 0 && incident.coordinates[1] === 0 ? '❌ Invalid Coords' : '✅ Valid Coords'}
                </div>
              </div>
            ))}
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
        key={mapKey} // Force re-render when new incidents are added
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
                        <h3 className="font-semibold text-sm">{String(incident.location || 'Unknown Location')}</h3>
                        <p className="text-xs text-gray-600">{String(incident.type || 'UNKNOWN').replace('_', ' ').toUpperCase()}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{String(incident.content || 'No description available')}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Confidence: {Math.round(Number(incident.confidence || 0) * 100)}%</span>
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

              {/* New Incident Highlight */}
              {newIncidentIds.has(incident.id) && (
                <CircleMarker
                  center={incident.coordinates}
                  radius={getSeverityRadius(incident.severity) / 500} // Larger radius for highlight
                  pathOptions={{
                    color: '#FFD700', // Gold color for new incidents
                    fillColor: '#FFD700',
                    fillOpacity: 0.3,
                    weight: 3,
                    dashArray: '5, 5' // Dashed line for pulsing effect
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
              <h3 className="font-semibold text-white">{String(selectedIncident.location || 'Unknown Location')}</h3>
              <p className="text-sm text-accent-grey">
                {String(selectedIncident.type || 'UNKNOWN').replace('_', ' ').toUpperCase()} • {String(selectedIncident.severity || 'UNKNOWN').toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-accent-grey hover:text-white"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-white mb-3">{String(selectedIncident.content || 'No description available')}</p>
          
          <div className="flex items-center justify-between text-xs text-accent-grey">
            <span>Confidence: {Math.round(Number(selectedIncident.confidence || 0) * 100)}%</span>
            <span>Source: {String(selectedIncident.source || 'Unknown')}</span>
            <span>{selectedIncident.verified ? 'Verified' : 'Unverified'}</span>
          </div>
        </motion.div>
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[2000] space-y-2">
          <AnimatePresence>
            {toasts.map((toast) => {
              try {
                return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[320px] max-w-[400px] border-l-4 ${
                toast.type === 'success' 
                  ? 'border-l-green-500' 
                  : 'border-l-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {String(toast.incident.type || 'UNKNOWN').replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        toast.incident.verified 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {toast.incident.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1">
                      {String(toast.incident.location || 'Unknown Location')}
                    </h4>
                    <p className="text-xs text-gray-300 mb-2 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {String(toast.incident.content || 'No description available')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Severity: {String(toast.incident.severity || 'UNKNOWN').toUpperCase()}</span>
                      <span>Confidence: {Math.round(Number(toast.incident.confidence || 0) * 100)}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-white ml-2 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </motion.div>
                );
              } catch (error) {
                console.error("Error rendering toast:", error);
                return null;
              }
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MapView;
