import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Bell, 
  MapPin, 
  Clock, 
  User,
  AlertTriangle,
  Droplets,
  Wind,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { mockIncidents } from '../services/mockData';

const IncidentFeed = () => {
  const [incidents] = useState(mockIncidents);
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    verified: 'all',
    search: ''
  });
  const [expandedIncident, setExpandedIncident] = useState(null);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesType = filters.type === 'all' || incident.type === filters.type;
      const matchesSeverity = filters.severity === 'all' || incident.severity === filters.severity;
      const matchesVerified = filters.verified === 'all' || 
        (filters.verified === 'verified' && incident.verified) ||
        (filters.verified === 'unverified' && !incident.verified);
      const matchesSearch = filters.search === '' || 
        incident.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        incident.location.toLowerCase().includes(filters.search.toLowerCase());

      return matchesType && matchesSeverity && matchesVerified && matchesSearch;
    });
  }, [incidents, filters]);

  const handleVerify = (incidentId) => {
    console.log('Verifying incident:', incidentId);
    // In real app, this would update the backend
  };

  const handleMarkFake = (incidentId) => {
    console.log('Marking incident as fake:', incidentId);
    // In real app, this would update the backend
  };

  const handleNotify = (incidentId) => {
    console.log('Notifying authorities for incident:', incidentId);
    // In real app, this would trigger notification system
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'tsunami': return <AlertTriangle className="text-red-400" size={16} />;
      case 'flood': return <Droplets className="text-blue-400" size={16} />;
      case 'oil_spill': return <Zap className="text-yellow-400" size={16} />;
      case 'storm_surge': return <Wind className="text-purple-400" size={16} />;
      default: return <AlertTriangle className="text-gray-400" size={16} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Incident Feed</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-grey" size={16} />
          <input
            type="text"
            placeholder="Search incidents..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-accent-grey focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-accent-grey mb-1">Hazard Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="tsunami">Tsunami</option>
              <option value="flood">Flood</option>
              <option value="oil_spill">Oil Spill</option>
              <option value="storm_surge">Storm Surge</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-accent-grey mb-1">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-accent-grey mb-1">Status</label>
            <select
              value={filters.verified}
              onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredIncidents.map((incident) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getIncidentIcon(incident.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      {incident.verified ? (
                        <CheckCircle className="text-green-400" size={14} />
                      ) : (
                        <XCircle className="text-red-400" size={14} />
                      )}
                    </div>
                    <span className="text-xs text-accent-grey flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTimeAgo(incident.timestamp)}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-white mb-1">
                    {incident.location}
                  </h3>
                  
                  <p className="text-sm text-accent-grey line-clamp-2">
                    {incident.content}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-accent-grey">
                      <User size={12} className="mr-1" />
                      {incident.reporter}
                    </div>
                    <div className="text-xs text-accent-grey">
                      Confidence: {Math.round(incident.confidence * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {expandedIncident === incident.id ? (
                    <ChevronUp className="text-accent-grey" size={16} />
                  ) : (
                    <ChevronDown className="text-accent-grey" size={16} />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedIncident === incident.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    {incident.image && (
                      <img
                        src={incident.image}
                        alt="Incident"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex flex-wrap gap-2">
                      {incident.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-600/20 text-primary-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerify(incident.id);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors"
                      >
                        <CheckCircle size={12} />
                        <span>Verify</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkFake(incident.id);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors"
                      >
                        <XCircle size={12} />
                        <span>Mark Fake</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotify(incident.id);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors"
                      >
                        <Bell size={12} />
                        <span>Notify</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredIncidents.length === 0 && (
          <div className="p-8 text-center text-accent-grey">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No incidents found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentFeed;
