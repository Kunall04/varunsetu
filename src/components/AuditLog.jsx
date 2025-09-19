import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Bell, 
  User, 
  Clock,
  Filter,
  Search,
  AlertTriangle,
  Eye,
  Calendar
} from 'lucide-react';

const AuditLog = () => {
  const [filters, setFilters] = useState({
    action: 'all',
    user: 'all',
    date: 'all',
    search: ''
  });

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      user: 'Analyst_001',
      action: 'verified',
      target: 'Incident #1234 - Tsunami Alert Chennai',
      details: 'Marked incident as verified after cross-referencing with sensor data',
      severity: 'high'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      user: 'Analyst_002',
      action: 'notification',
      target: 'Emergency Alert - Mumbai Oil Spill',
      details: 'Sent tsunami warning to coastal authorities in Tamil Nadu',
      severity: 'high'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      user: 'Analyst_001',
      action: 'flagged',
      target: 'Incident #1230 - False Flood Report',
      details: 'Flagged incident as fake after verification with local authorities',
      severity: 'medium'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      user: 'Supervisor_001',
      action: 'viewed',
      target: 'Analytics Dashboard',
      details: 'Viewed regional impact statistics for decision making',
      severity: 'low'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      user: 'Analyst_003',
      action: 'verified',
      target: 'Incident #1228 - Storm Surge Visakhapatnam',
      details: 'Verified storm surge report with meteorological data',
      severity: 'medium'
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      user: 'Analyst_002',
      action: 'notification',
      target: 'Flood Warning - Kerala',
      details: 'Issued flood warning to emergency response teams',
      severity: 'high'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filters.action === 'all' || log.action === filters.action;
    const matchesUser = filters.user === 'all' || log.user === filters.user;
    const matchesSearch = filters.search === '' || 
      log.target.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.details.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.user.toLowerCase().includes(filters.search.toLowerCase());

    return matchesAction && matchesUser && matchesSearch;
  });

  const getActionIcon = (action) => {
    switch (action) {
      case 'verified': return <CheckCircle className="text-green-400" size={16} />;
      case 'flagged': return <XCircle className="text-red-400" size={16} />;
      case 'notification': return <Bell className="text-blue-400" size={16} />;
      case 'viewed': return <Eye className="text-gray-400" size={16} />;
      default: return <AlertTriangle className="text-yellow-400" size={16} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'notification': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
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

  const formatDateTime = (timestamp) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FileText className="mr-3" size={24} />
          Audit Log
        </h1>
        <p className="text-accent-grey">Track all analyst actions and system activities</p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-white/10 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-grey" size={16} />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-accent-grey focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-accent-grey mb-2">Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Actions</option>
              <option value="verified">Verified</option>
              <option value="flagged">Flagged</option>
              <option value="notification">Notification</option>
              <option value="viewed">Viewed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-accent-grey mb-2">User</label>
            <select
              value={filters.user}
              onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Users</option>
              <option value="Analyst_001">Analyst_001</option>
              <option value="Analyst_002">Analyst_002</option>
              <option value="Analyst_003">Analyst_003</option>
              <option value="Supervisor_001">Supervisor_001</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-accent-grey mb-2">Time Range</label>
            <select
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-dark p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {/* Action Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}></span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-accent-grey">
                      <Clock size={14} />
                      <span>{formatTimeAgo(log.timestamp)}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-medium mb-1">{log.target}</h3>
                  <p className="text-sm text-accent-grey mb-3">{log.details}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-accent-grey">
                      <div className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-accent-grey">
                      ID: #{log.id.toString().padStart(4, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-accent-grey opacity-50" />
            <p className="text-accent-grey">No audit logs found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{filteredLogs.length}</p>
            <p className="text-sm text-accent-grey">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {filteredLogs.filter(log => log.action === 'verified').length}
            </p>
            <p className="text-sm text-accent-grey">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {filteredLogs.filter(log => log.action === 'flagged').length}
            </p>
            <p className="text-sm text-accent-grey">Flagged</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {filteredLogs.filter(log => log.action === 'notification').length}
            </p>
            <p className="text-sm text-accent-grey">Notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
