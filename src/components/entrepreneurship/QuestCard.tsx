import React, { useState } from 'react';
import { Lock, CheckCircle, Play, BookOpen, Trophy } from 'lucide-react';

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

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
  userCredits: number;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete, userCredits }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const canStart = userCredits >= quest.credits;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleStart = () => {
    if (canStart && !quest.completed) {
      onComplete();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      quest.completed ? 'border-purple-300' : getDifficultyColor(quest.difficulty)
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{quest.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{quest.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty === 'beginner' && 'शुरुआती / Beginner'}
                  {quest.difficulty === 'intermediate' && 'मध्यमिक / Intermediate'}
                  {quest.difficulty === 'advanced' && 'उन्नत / Advanced'}
                </span>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-purple-600">{quest.credits} क्रेडिट्स</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {quest.completed ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">पूर्ण हो गया / Completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {canStart ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">शुरू करें / Start</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">{quest.credits - userCredits} क्रेडिट्स और चाहिए / Need {quest.credits - userCredits} more credits</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
        
        {/* Progress Bar */}
        {quest.progress > 0 && !quest.completed && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>प्रगति / Progress</span>
              <span>{quest.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${quest.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium py-2 transition-colors"
        >
          <BookOpen className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          {isExpanded ? 'विवरण छुपाएं / Hide Details' : 'और जानें / View Details'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">इस क्वेस में आप सीखेंगे / What you'll learn:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                <li>• व्यापारिक रणनीती / Business planning</li>
                <li>• लागत व्यवस्थापन / Cost management</li>
                <li>• ग्राहक संबंध / Customer service</li>
                <li>• मुनाफा बढ़ाना / Profit strategies</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
