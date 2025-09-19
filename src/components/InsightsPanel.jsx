import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Send,
  MapPin,
  BarChart3,
  Clock,
  Users,
  Target
} from 'lucide-react';
import { mockInsights, notificationTemplates } from '../services/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const InsightsPanel = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('tsunami');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const insights = mockInsights;

  const handleSendNotification = () => {
    console.log('Sending notification:', {
      template: selectedTemplate,
      message: notificationMessage
    });
    setShowNotificationModal(false);
    setNotificationMessage('');
  };

  const getSeriousnessColor = (score) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeriousnessBg = (score) => {
    if (score >= 8) return 'bg-red-500/20';
    if (score >= 6) return 'bg-yellow-500/20';
    return 'bg-green-500/20';
  };

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Brain className="mr-2" size={20} />
          ML Insights & Tools
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {/* Hazard Seriousness Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Hazard Seriousness</h3>
            <TrendingUp className="text-primary-400" size={16} />
          </div>
          
          <div className="flex items-center justify-center mb-3">
            <div className={`w-20 h-20 rounded-full ${getSeriousnessBg(insights.seriousnessScore)} flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${getSeriousnessColor(insights.seriousnessScore)}`}>
                {insights.seriousnessScore}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-accent-grey mb-1">Overall Risk Level</p>
            <p className={`text-sm font-medium ${getSeriousnessColor(insights.seriousnessScore)}`}>
              {insights.seriousnessScore >= 8 ? 'CRITICAL' : insights.seriousnessScore >= 6 ? 'HIGH' : 'MODERATE'}
            </p>
          </div>
        </motion.div>

        {/* Verification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dark p-4"
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            <CheckCircle className="mr-2 text-green-400" size={16} />
            Report Verification
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-grey">Verified</span>
              <span className="text-sm font-medium text-green-400">{insights.verifiedPercentage}%</span>
            </div>
            <div className="w-full bg-accent-grey/20 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${insights.verifiedPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-grey">Unverified</span>
              <span className="text-sm font-medium text-red-400">{insights.fakePercentage}%</span>
            </div>
            <div className="w-full bg-accent-grey/20 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${insights.fakePercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Trending Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-dark p-4"
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            <Target className="mr-2 text-blue-400" size={16} />
            Trending Keywords
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {insights.trendingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-600/20 text-primary-300 text-xs rounded-full"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Regional Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-dark p-4"
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            <MapPin className="mr-2 text-purple-400" size={16} />
            Regional Impact
          </h3>
          
          <div className="space-y-2">
            {insights.regionalImpact.slice(0, 5).map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-accent-grey">{region.region}</span>
                    <span className="text-xs text-accent-grey">{region.incidents} incidents</span>
                  </div>
                  <div className="w-full bg-accent-grey/20 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${(region.impact / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-white ml-2">
                  {region.impact.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Authority Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-dark p-4"
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            <Send className="mr-2 text-orange-400" size={16} />
            Authority Tools
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-accent-grey mb-2">Notification Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {Object.entries(notificationTemplates).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setNotificationMessage(notificationTemplates[selectedTemplate].template);
                setShowNotificationModal(true);
              }}
              className="w-full btn-primary text-sm py-2"
            >
              Send Alert to Responders
            </button>
          </div>
        </motion.div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNotificationModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-dark p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Send Emergency Alert
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-accent-grey mb-2">
                  Template: {notificationTemplates[selectedTemplate].title}
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="Enter notification message..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  Send Alert
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsPanel;
