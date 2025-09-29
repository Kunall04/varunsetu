import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Map, BarChart3, FileText } from 'lucide-react';
import IncidentFeed from './IncidentFeed';
import MapView from './MapView';
import InsightsPanel from './InsightsPanel';
import Analytics from './Analytics';
import AuditLog from './AuditLog';

const Layout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  const sidebarVariants = {
    open: { width: 320, opacity: 1 },
    closed: { width: 0, opacity: 0 }
  };

  const mainContentVariants = {
    open: { marginLeft: 0, marginRight: 0 },
    leftClosed: { marginLeft: -320 },
    rightClosed: { marginRight: -320 },
    bothClosed: { marginLeft: -320, marginRight: -320 }
  };

  const getMainContentMargin = () => {
    if (!leftSidebarOpen && !rightSidebarOpen) return 'bothClosed';
    if (!leftSidebarOpen) return 'leftClosed';
    if (!rightSidebarOpen) return 'rightClosed';
    return 'open';
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'audit':
        return <AuditLog />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-primary-800/50 backdrop-blur-md border-b border-white/10 flex items-center justify-start px-4 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLeftSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">
            Varunsetu - Bridge of Safety for Indian Coasts
          </h1>
        </div>
        <div className="flex-1" />

        <nav className="flex items-center space-x-2 mr-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'dashboard'
                ? 'bg-primary-600 text-white'
                : 'hover:bg-white/10 text-accent-grey'
            }`}
          >
            <Map size={16} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'bg-primary-600 text-white'
                : 'hover:bg-white/10 text-accent-grey'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === 'audit'
                ? 'bg-primary-600 text-white'
                : 'hover:bg-white/10 text-accent-grey'
            }`}
          >
            <FileText size={16} />
            <span>Audit Log</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleRightSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Incident Feed */}
        <motion.aside
          variants={sidebarVariants}
          animate={leftSidebarOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-primary-800/30 backdrop-blur-md border-r border-white/10 overflow-hidden"
        >
          {leftSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-80"
            >
              <IncidentFeed />
            </motion.div>
          )}
        </motion.aside>

        {/* Main Content Area */}
        <motion.main
          variants={mainContentVariants}
          animate={getMainContentMargin()}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 relative"
        >
          {renderMainContent()}
        </motion.main>

        {/* Right Sidebar - Insights */}
        <motion.aside
          variants={sidebarVariants}
          animate={rightSidebarOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-primary-800/30 backdrop-blur-md border-l border-white/10 overflow-hidden"
        >
          {rightSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-80"
            >
              <InsightsPanel />
            </motion.div>
          )}
        </motion.aside>
      </div>
    </div>
  );
};

export default Layout;
