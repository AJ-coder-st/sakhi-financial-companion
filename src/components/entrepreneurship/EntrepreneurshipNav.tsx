import React from 'react';
import { Home, BookOpen, Trophy, Users, Target } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const EntrepreneurshipNav: React.FC<{ activeSection: string; onNavigate: (section: string) => void }> = ({ 
  activeSection, 
  onNavigate 
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'मुख्य पृष्ठ / Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      id: 'learning',
      label: 'सीखना / Learn',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/entrepreneurship'
    },
    {
      id: 'quests',
      label: 'क्वेस्ट / Quests',
      icon: <Trophy className="w-5 h-5" />,
      path: '/entrepreneurship/quests'
    },
    {
      id: 'mentors',
      label: 'उद्यमगी / Mentors',
      icon: <Users className="w-5 h-5" />,
      path: '/entrepreneurship/mentors'
    },
    {
      id: 'credits',
      label: 'क्रेडिट्स / Credits',
      icon: <Target className="w-5 h-5" />,
      path: '/entrepreneurship/credits'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeSection === item.id
                  ? 'text-purple-600 bg-purple-50 border-purple-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default EntrepreneurshipNav;
