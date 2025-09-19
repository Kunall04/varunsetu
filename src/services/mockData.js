// Mock data for incidents, analytics, and insights

export const mockIncidents = [
  {
    id: 1,
    type: 'tsunami',
    severity: 'high',
    location: 'Chennai, Tamil Nadu',
    coordinates: [13.0827, 80.2707],
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    source: 'social_media',
    content: 'Massive waves spotted near Marina Beach. People evacuating the area.',
    confidence: 0.87,
    verified: false,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    reporter: '@coastal_observer',
    tags: ['evacuation', 'emergency', 'beach']
  },
  {
    id: 2,
    type: 'oil_spill',
    severity: 'medium',
    location: 'Mumbai Port, Maharashtra',
    coordinates: [19.0760, 72.8777],
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    source: 'sensor',
    content: 'Oil spill detected in Mumbai harbor. Environmental impact assessment required.',
    confidence: 0.94,
    verified: true,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    reporter: 'Harbor Sensors',
    tags: ['environmental', 'port', 'pollution']
  },
  {
    id: 3,
    type: 'flood',
    severity: 'high',
    location: 'Kochi, Kerala',
    coordinates: [9.9312, 76.2673],
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    source: 'crowdsourced',
    content: 'Heavy flooding reported in Ernakulam district. Roads submerged.',
    confidence: 0.76,
    verified: false,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    reporter: 'Local Resident',
    tags: ['flooding', 'roads', 'emergency']
  },
  {
    id: 4,
    type: 'storm_surge',
    severity: 'medium',
    location: 'Visakhapatnam, Andhra Pradesh',
    coordinates: [17.6868, 83.2185],
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    source: 'social_media',
    content: 'Unusual wave patterns observed. Storm surge warning issued.',
    confidence: 0.82,
    verified: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    reporter: '@weather_tracker',
    tags: ['storm', 'waves', 'warning']
  },
  {
    id: 5,
    type: 'tsunami',
    severity: 'low',
    location: 'Puri, Odisha',
    coordinates: [19.8135, 85.8312],
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    source: 'crowdsourced',
    content: 'Minor wave activity reported. No immediate threat detected.',
    confidence: 0.65,
    verified: false,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    reporter: 'Beach Patrol',
    tags: ['minor', 'waves', 'monitoring']
  }
];

export const mockAnalytics = {
  hazardDistribution: [
    { name: 'Tsunami', value: 35, color: '#EF4444' },
    { name: 'Flood', value: 25, color: '#3B82F6' },
    { name: 'Oil Spill', value: 20, color: '#F59E0B' },
    { name: 'Storm Surge', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#6B7280' }
  ],
  incidentGrowth: [
    { time: '00:00', incidents: 12 },
    { time: '04:00', incidents: 8 },
    { time: '08:00', incidents: 15 },
    { time: '12:00', incidents: 22 },
    { time: '16:00', incidents: 18 },
    { time: '20:00', incidents: 25 },
    { time: '24:00', incidents: 28 }
  ],
  locationStats: [
    { location: 'Chennai', incidents: 8, verified: 6 },
    { location: 'Mumbai', incidents: 6, verified: 5 },
    { location: 'Kochi', incidents: 4, verified: 2 },
    { location: 'Visakhapatnam', incidents: 3, verified: 3 },
    { location: 'Puri', incidents: 2, verified: 1 }
  ]
};

export const mockInsights = {
  seriousnessScore: 7.2,
  fakePercentage: 23,
  verifiedPercentage: 77,
  trendingKeywords: ['evacuation', 'emergency', 'flooding', 'waves', 'warning'],
  regionalImpact: [
    { region: 'Tamil Nadu', impact: 8.5, incidents: 12 },
    { region: 'Maharashtra', impact: 6.8, incidents: 8 },
    { region: 'Kerala', impact: 7.2, incidents: 6 },
    { region: 'Andhra Pradesh', impact: 5.5, incidents: 4 },
    { region: 'Odisha', impact: 3.2, incidents: 2 }
  ]
};

export const notificationTemplates = {
  tsunami: {
    title: 'Tsunami Alert',
    template: 'URGENT: Tsunami warning issued for {location}. Immediate evacuation required. Move to higher ground immediately. Follow emergency protocols.',
    priority: 'high'
  },
  flood: {
    title: 'Flood Warning',
    template: 'Flood warning for {location}. Avoid low-lying areas. Emergency services mobilized. Stay tuned for updates.',
    priority: 'high'
  },
  oil_spill: {
    title: 'Oil Spill Alert',
    template: 'Oil spill detected in {location}. Environmental cleanup initiated. Avoid affected waters. Health advisory issued.',
    priority: 'medium'
  },
  storm_surge: {
    title: 'Storm Surge Warning',
    template: 'Storm surge warning for {location}. Coastal areas at risk. Secure vessels and property. Monitor weather updates.',
    priority: 'medium'
  }
};
