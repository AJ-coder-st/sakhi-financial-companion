import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

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

const QuestCardSimple: React.FC<QuestCardProps> = ({ quest, onComplete, userCredits }) => {
  const { t } = useLanguage();
  const canStart = userCredits >= quest.credits;

  const handleStart = () => {
    if (canStart && !quest.completed) {
      onComplete();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 transition-all duration-300">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{quest.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{quest.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800 border-green-300">
                  {quest.difficulty === 'beginner' && t('beginner')}
                  {quest.difficulty === 'intermediate' && t('intermediate')}
                  {quest.difficulty === 'advanced' && t('advanced')}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-purple-600">{quest.credits} {t('credits')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {quest.completed ? (
              <div className="flex items-center gap-1 text-green-600">
                <span className="text-sm font-medium">{t('completed')}</span>
              </div>
            ) : (
              <button
                onClick={handleStart}
                className="flex items-center gap-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                disabled={!canStart}
              >
                <span className="text-sm font-medium">{t('start')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{t('progress')}</span>
            <span>{quest.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => console.log('View details')}
          className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium py-2 transition-colors"
        >
          <span>{t('viewDetails')}</span>
        </button>
      </div>
    </div>
  );
};

export default QuestCardSimple;
