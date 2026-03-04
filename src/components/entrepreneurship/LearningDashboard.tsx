import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Users, Target, Zap, Lock, CheckCircle } from 'lucide-react';
import { QuestCard } from './QuestCard';
import { CreditProgress } from './CreditProgress';
import { DailyChallenge } from './DailyChallenge';
import { MentorConnect } from './MentorConnect';

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  credits: number;
  completed: boolean;
  progress: number;
}

interface UserProfile {
  credits: number;
  level: string;
  badges: string[];
  nextMilestone: number;
  nextMilestoneTitle: string;
}

const LearningDashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    credits: 120,
    level: 'Smart Saver',
    badges: ['Beginner Entrepreneur', 'Quick Learner'],
    nextMilestone: 150,
    nextMilestoneTitle: 'Mentor Access'
  });

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'quest1',
      title: 'छोटे शुरू करें / Start a Small Shop',
      description: 'Learn how to start your own small business with minimal investment',
      icon: '🛍️',
      difficulty: 'beginner',
      credits: 30,
      completed: true,
      progress: 100
    },
    {
      id: 'quest2', 
      title: 'मुनाफा बढ़ाना और निवेश करना / Save and Reinvest',
      description: 'Understand profit margins and how to grow your business',
      icon: '💰',
      difficulty: 'beginner',
      credits: 40,
      completed: false,
      progress: 60
    },
    {
      id: 'quest3',
      title: 'उत्पाद मूल्यांकन / Product Pricing',
      description: 'Learn to price your products competitively while maintaining profit',
      icon: '🏷️',
      difficulty: 'intermediate',
      credits: 50,
      completed: false,
      progress: 0
    },
    {
      id: 'quest4',
      title: 'ग्राहक संबंध / Customer Management',
      description: 'Build loyal customer relationships for sustainable business',
      icon: '👥',
      difficulty: 'intermediate',
      credits: 60,
      completed: false,
      progress: 0
    }
  ]);

  const [dailyChallenge, setDailyChallenge] = useState({
    title: 'आज की चुनौती / Today\'s Choice',
    description: 'Save ₹20 today or ask one shop owner about their pricing strategy',
    credits: 15,
    completed: false
  });

  const completeQuest = (questId: string, creditsEarned: number) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, progress: 100 }
        : quest
    ));
    setUserProfile(prev => ({
      ...prev,
      credits: prev.credits + creditsEarned
    }));
  };

  const completeDailyChallenge = () => {
    setDailyChallenge(prev => ({ ...prev, completed: true }));
    setUserProfile(prev => ({
      ...prev,
      credits: prev.credits + dailyChallenge.credits
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          🎯 उद्यमगी पाठशाला / Entrepreneurship Learning
        </h1>
        <p className="text-purple-600 text-lg">
          Learn business skills, earn credits, and connect with mentors
        </p>
      </div>

      {/* User Profile Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">मेरा प्रोफाइल / My Profile</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-purple-600">{userProfile.credits}</span>
              <span className="text-gray-600">क्रेडिट्स</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">अगला स्तर / Level</div>
            <div className="text-lg font-semibold text-purple-700">{userProfile.level}</div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">अगला लक्ष्य / Next Goal</span>
            <span className="text-sm text-purple-600">{userProfile.nextMilestone} क्रेडिट्स</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3 mb-2">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(userProfile.credits / userProfile.nextMilestone) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-purple-700 font-medium">
            {userProfile.nextMilestoneTitle} अनलॉक करें / Unlock {userProfile.nextMilestoneTitle}
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">उपलब्धियाँ / Badges</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.badges.map((badge, index) => (
              <div key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                🏆 {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <DailyChallenge 
        challenge={dailyChallenge}
        onComplete={completeDailyChallenge}
      />

      {/* Learning Quests */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          सीखने के क्वेस्ट / Learning Quests
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={() => completeQuest(quest.id, quest.credits)}
              userCredits={userProfile.credits}
            />
          ))}
        </div>
      </div>

      {/* Mentor Connect Section */}
      <MentorConnect 
        userCredits={userProfile.credits}
        canConnect={userProfile.credits >= 150}
      />
    </div>
  );
};

export default LearningDashboard;
