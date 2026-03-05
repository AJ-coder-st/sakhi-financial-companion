import React, { useState } from 'react';
import EntrepreneurshipNav from '../components/entrepreneurship/EntrepreneurshipNav';
import LearningDashboard from '../components/entrepreneurship/LearningDashboard';

const EntrepreneurshipLearning: React.FC = () => {
  const [activeSection, setActiveSection] = useState('learning');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">व्यापार डैशबोर्ड / Business Dashboard</h2>
            <p className="text-gray-600">Track your business progress and performance</p>
          </div>
        );
      case 'learning':
      case 'quests':
        return <LearningDashboard />;
      case 'mentors':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">उद्यमगी नेटवर्क / Mentor Network</h2>
            <p className="text-gray-600">Connect with experienced entrepreneurs in your area</p>
          </div>
        );
      case 'credits':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">क्रेडिट्स इतिहास / Credit History</h2>
            <p className="text-gray-600">View your earned credits and spending history</p>
          </div>
        );
      default:
        return <LearningDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <EntrepreneurshipNav 
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default EntrepreneurshipLearning;
