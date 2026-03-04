import React, { useState } from 'react';
import { Calendar, CheckCircle, Gift, Clock, Zap } from 'lucide-react';

interface DailyChallengeProps {
  challenge: {
    title: string;
    description: string;
    credits: number;
    completed: boolean;
  };
  onComplete: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ challenge, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calculate time until next daily challenge
  React.useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}घंटे ${minutes}मिनट / ${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}मिनट / ${minutes}m`);
      } else {
        setTimeLeft('जल्द ही रीसेट होगया / Resetting soon');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    if (!challenge.completed) {
      onComplete();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
      challenge.completed 
        ? 'border-green-300 bg-green-50' 
        : 'border-orange-300 bg-orange-50 hover:shadow-lg'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{challenge.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600">दैनिक चुनौती / Daily Challenge</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {challenge.completed ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">पूर्ण हो गया / Completed</span>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-1 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">पूरा करें / Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
        
        {/* Reward */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-500" />
            <div>
              <span className="text-sm text-gray-600">इनाम / Reward:</span>
              <span className="text-lg font-bold text-purple-600">{challenge.credits} क्रेडिट्स</span>
            </div>
          </div>
          
          {!challenge.completed && timeLeft && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{timeLeft} में रीसेट / Resets in {timeLeft}</span>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium py-2 transition-colors"
        >
          <Gift className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          {isExpanded ? 'विवरण छुपाएं / Hide Tips' : 'टिप्स देखें / View Tips'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-lg p-3">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  त्वरित सुझाव / Quick Tips
                </h4>
                <ul className="text-sm text-orange-700 space-y-2">
                  <li>• छोटे से शुरू करें / Start small and grow gradually</li>
                  <li>• रोजाना बनाएं रखें / Keep track of your progress</li>
                  <li>• रोज़ अनुसार लें / Ask for help when needed</li>
                  <li>• रोज़ाना समय पर करें / Practice every day</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <h4 className="font-semibold text-purple-800 mb-2">आज के लिए विचार / Strategy for Today</h4>
                <div className="text-sm text-purple-700 space-y-1">
                  {React.createElement('p', {}, 
                    React.createElement('strong', {}, 'बचत बचत / Step 1:'), ' अपने व्यय का 10% बचत करें / Save 10% of your income')}
                  {React.createElement('p', {}, 
                    React.createElement('strong', {}, 'खर्च विश्लेषण / Step 2:'), ' एक छोटे मालिक से बात करें / Talk to one shop owner')}
                  {React.createElement('p', {}, 
                    React.createElement('strong', {}, 'योजना / Step 3:'), ' कल के लिए एक नया विचार बनाएं / Plan one new idea for tomorrow')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
