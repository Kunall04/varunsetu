import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Activity,
  Clock
} from 'lucide-react';
import { mockAnalytics } from '../services/mockData';

const Analytics = () => {
  const analytics = mockAnalytics;

  const COLORS = ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#6B7280'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary-800/90 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-medium">{`${label}`}</p>
          <p className="text-primary-300 text-sm">
            Incidents: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full p-6 space-y-6 overflow-y-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-accent-grey">Comprehensive insights into ocean hazard incidents</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-dark p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-grey">Total Incidents</p>
              <p className="text-2xl font-bold text-white">32</p>
            </div>
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-400 mr-1" size={14} />
            <span className="text-green-400">+12% from last week</span>
          </div>
        </div>

        <div className="card-dark p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-grey">Active Regions</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <MapPin className="text-blue-400" size={24} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Activity className="text-yellow-400 mr-1" size={14} />
            <span className="text-yellow-400">5 high-risk zones</span>
          </div>
        </div>

        <div className="card-dark p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-grey">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">4.2m</p>
            </div>
            <Clock className="text-green-400" size={24} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-400 mr-1" size={14} />
            <span className="text-green-400">-15% improvement</span>
          </div>
        </div>

        <div className="card-dark p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-grey">Verification Rate</p>
              <p className="text-2xl font-bold text-white">77%</p>
            </div>
            <BarChart3 className="text-purple-400" size={24} />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="text-green-400 mr-1" size={14} />
            <span className="text-green-400">+8% this month</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hazard Distribution Pie Chart */}
        <motion.div variants={itemVariants} className="card-dark p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="mr-2 text-blue-400" size={20} />
            Hazard Type Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.hazardDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.hazardDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Incident Growth Line Chart */}
        <motion.div variants={itemVariants} className="card-dark p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-400" size={20} />
            Incident Growth (24h)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.incidentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Location Statistics */}
      <motion.div variants={itemVariants} className="card-dark p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <MapPin className="mr-2 text-purple-400" size={20} />
          Location-Based Statistics
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.locationStats} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                dataKey="location" 
                type="category"
                stroke="#9CA3AF"
                fontSize={12}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="incidents" 
                fill="#3B82F6"
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="verified" 
                fill="#10B981"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-accent-grey">Total Incidents</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-accent-grey">Verified Incidents</span>
          </div>
        </div>
      </motion.div>

      {/* Top 5 Active Coastal Regions */}
      <motion.div variants={itemVariants} className="card-dark p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <AlertTriangle className="mr-2 text-red-400" size={20} />
          Top 5 Active Coastal Regions
        </h3>
        
        <div className="space-y-4">
          {analytics.locationStats.map((location, index) => (
            <motion.div
              key={location.location}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{location.location}</p>
                  <p className="text-sm text-accent-grey">
                    {location.verified}/{location.incidents} verified
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{location.incidents}</p>
                <p className="text-xs text-accent-grey">incidents</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
