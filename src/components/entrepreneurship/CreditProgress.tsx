import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';

interface CreditProgressProps {
  currentCredits: number;
  nextMilestone: number;
  nextMilestoneTitle: string;
}

const CreditProgress: React.FC<CreditProgressProps> = ({ 
  currentCredits, 
  nextMilestone, 
  nextMilestoneTitle 
}) => {
  const progressPercentage = Math.min((currentCredits / nextMilestone) * 100, 100);
  const creditsNeeded = Math.max(nextMilestone - currentCredits, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          क्रेडिट प्रगति / Credit Progress
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{currentCredits}</div>
          <div className="text-sm text-gray-600">कुल क्रेडिट्स / Total Credits</div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>अगला लक्ष्य / Next Goal</span>
            <span>{nextMilestone} क्रेडिट्स</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {/* Progress Markers */}
            <div className="absolute top-0 left-0 w-full h-4 flex items-center">
              {/* 25% marker */}
              {progressPercentage >= 25 && (
                <div className="absolute" style={{ left: '25%' }}>
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-purple-300"></div>
                </div>
              )}
              {/* 50% marker */}
              {progressPercentage >= 50 && (
                <div className="absolute" style={{ left: '50%' }}>
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-purple-300"></div>
                </div>
              )}
              {/* 75% marker */}
              {progressPercentage >= 75 && (
                <div className="absolute" style={{ left: '75%' }}>
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-purple-300"></div>
                </div>
              )}
              {/* 100% marker */}
              {progressPercentage >= 100 && (
                <div className="absolute" style={{ left: '100%' }}>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-300 flex items-center justify-center">
                    <Target className="w-2 h-2 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">पूर्णति / Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{creditsNeeded}</div>
            <div className="text-sm text-gray-600">क्रेडिट्स चाहिए / Credits Needed</div>
          </div>
          <div className="text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-semibold text-green-600">{nextMilestoneTitle}</div>
            <div className="text-sm text-gray-600">अगला इनाम / Next Unlock</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg text-center">
          {progressPercentage >= 100 ? (
            <div>
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-lg font-bold text-purple-700">बधाई! आपने लक्ष्य पूरा कर लिया है! / Congratulations! You've reached your goal!</div>
              <div className="text-sm text-purple-600 mt-1">अब {nextMilestoneTitle} अनलॉक हो गया है / {nextMilestoneTitle} is now unlocked!</div>
            </div>
          ) : progressPercentage >= 75 ? (
            <div>
              <div className="text-xl mb-2">💪</div>
              <div className="text-lg font-semibold text-purple-700">बहुत अच्छा! Almost there! / Almost there!</div>
              <div className="text-sm text-purple-600">और मात्र {creditsNeeded} क्रेडिट्स चाहिए / Just {creditsNeeded} more credits needed!</div>
            </div>
          ) : progressPercentage >= 50 ? (
            <div>
              <div className="text-xl mb-2">📈</div>
              <div className="text-lg font-semibold text-purple-700">अच्छा प्रगति / Good Progress!</div>
              <div className="text-sm text-purple-600">आप आधे से आधे की ओर हैं / You're halfway there!</div>
            </div>
          ) : (
            <div>
              <div className="text-xl mb-2">🚀</div>
              <div className="text-lg font-semibold text-purple-700">शुरू करें / Get Started!</div>
              <div className="text-sm text-purple-600">पहला कदम पूरा करें / Complete quests to earn credits!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditProgress;
