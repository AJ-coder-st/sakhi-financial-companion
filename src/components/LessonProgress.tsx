'use client';

import React from 'react';

/**
 * LessonProgress Component
 * 
 * Displays the user's learning progress with a progress bar and completion statistics.
 * Shows:
 * - Progress bar (0-100%)
 * - Completed vs total lessons
 * - Completion percentage
 * 
 * @param {number} completed - Number of lessons completed
 * @param {number} total - Total number of lessons (default: 6)
 * @param {string} [className] - Additional CSS classes
 */
interface LessonProgressProps {
  completed: number;
  total?: number;
  className?: string;
}

export function LessonProgress({
  completed,
  total = 6,
  className = '',
}: LessonProgressProps) {
  const progressPercentage = Math.round((completed / total) * 100);
  const isComplete = completed === total;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        <span className="text-sm font-medium text-green-600">
          {completed} / {total} lessons
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-sm">
        {/* Animated Progress Fill */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-600">
          You're {progressPercentage}% through your financial learning journey
        </p>
        <span className={`text-sm font-bold ${
          isComplete
            ? 'text-green-600'
            : progressPercentage > 50
            ? 'text-blue-600'
            : 'text-orange-600'
        }`}>
          {progressPercentage}%
        </span>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 Congratulations! You've completed all lessons. Keep learning!
          </p>
        </div>
      )}

      {/* Next Milestone */}
      {!isComplete && (
        <div className="mt-3 text-xs text-gray-500">
          {completed === 0 && 'Start with Lesson 1 to begin your journey'}
          {completed > 0 && completed < total && `Complete ${total - completed} more lesson${total - completed !== 1 ? 's' : ''} to finish`}
        </div>
      )}
    </div>
  );
}

export default LessonProgress;
