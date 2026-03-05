'use client';

import React from 'react';
import { Lesson } from '@/lib/lessonService';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/**
 * LessonCard Component
 * 
 * Displays a lesson card with:
 * - Lesson title and description
 * - Lesson status (locked, unlocked, completed)
 * - Estimated time
 * - Click action to open lesson
 * - Color-coded UI based on status
 * 
 * Status colors:
 * - Green: Completed
 * - Blue: Unlocked (current/available)
 * - Gray: Locked (prerequisite not met)
 * 
 * @param {Lesson} lesson - The lesson object
 * @param {string} status - Current status: 'completed' | 'unlocked' | 'locked'
 * @param {function} onSelect - Callback when lesson is clicked
 * @param {boolean} [disabled] - Whether the card is disabled
 */
interface LessonCardProps {
  lesson: Lesson;
  status: 'completed' | 'current' | 'locked';
  onSelect: (lesson: Lesson) => void;
  disabled?: boolean;
}

export function LessonCard({
  lesson,
  status,
  onSelect,
  disabled = false,
}: LessonCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  // Determine card styling based on status
  const cardClasses = {
    base: 'rounded-lg border-2 p-5 transition-all duration-300 cursor-pointer',
    locked: 'bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed hover:shadow-none',
    current: 'bg-blue-50 border-blue-300 hover:shadow-lg hover:border-blue-400',
    completed: 'bg-green-50 border-green-300 hover:shadow-lg hover:border-green-400',
  };

  const selectedClass = isLocked
    ? cardClasses.locked
    : isCompleted
    ? cardClasses.completed
    : cardClasses.current;

  return (
    <div
      className={`${cardClasses.base} ${selectedClass}`}
      onClick={() => !isLocked && onSelect(lesson)}
      role={isLocked ? undefined : 'button'}
      tabIndex={isLocked ? -1 : 0}
      onKeyPress={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
          onSelect(lesson);
        }
      }}
    >
      {/* Header with Title and Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${
            isLocked ? 'text-gray-500' : isCompleted ? 'text-green-700' : 'text-blue-700'
          }`}>
            Lesson {lesson.id}: {lesson.title}
          </h3>
          <p className={`text-sm ${
            isLocked ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {lesson.description}
          </p>
        </div>

        {/* Status Badge */}
        <Badge
          variant={isCompleted ? 'default' : isCurrent ? 'secondary' : 'outline'}
          className={`whitespace-nowrap ${
            isCompleted
              ? 'bg-green-600 text-white'
              : isCurrent
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {isCompleted && '✓ Completed'}
          {isCurrent && '🔓 Unlocked'}
          {isLocked && '🔒 Locked'}
        </Badge>
      </div>

      {/* Level and Duration Info */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className={`px-2 py-1 rounded ${
          isLocked
            ? 'bg-gray-200 text-gray-600'
            : isCompleted
            ? 'bg-green-200 text-green-700'
            : 'bg-blue-200 text-blue-700'
        }`}>
          Level {lesson.level}
        </span>
        <span className={`flex items-center gap-1 ${
          isLocked ? 'text-gray-500' : 'text-gray-600'
        }`}>
          ⏱️ {lesson.estimatedTime}
        </span>
      </div>

      {/* Content Preview */}
      {!isLocked && (
        <p className="text-sm text-gray-700 line-clamp-2 mb-4">
          {lesson.text}
        </p>
      )}

      {/* Locked Message */}
      {isLocked && (
        <p className="text-sm text-gray-500 mb-4 italic">
          Complete the previous lesson to unlock this content
        </p>
      )}

      {/* Action Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => onSelect(lesson)}
          disabled={isLocked}
          variant={isCompleted ? 'outline' : 'default'}
          className={`w-full ${
            isCompleted
              ? 'border-green-600 text-green-600 hover:bg-green-50'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isCompleted ? '📖 Review' : '📚 Start Learning'}
        </Button>

        {/* Quiz Indicator */}
        {lesson.quiz && !isLocked && (
          <div className="flex items-center justify-center w-10 px-2 border border-purple-300 rounded-lg bg-purple-50">
            <span title="This lesson has a quiz" className="text-sm font-bold text-purple-600">
              ?
            </span>
          </div>
        )}
      </div>

      {/* Progress Hint */}
      {isCurrent && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600 font-medium">
            👉 This is your next lesson. Click above to start!
          </p>
        </div>
      )}
    </div>
  );
}

export default LessonCard;
