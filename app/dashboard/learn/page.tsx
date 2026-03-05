'use client';

import React, { useState, useEffect } from 'react';
import { LessonCard } from '@/components/LessonCard';
import { LessonPlayer } from '@/components/LessonPlayer';
import { LessonProgress } from '@/components/LessonProgress';
import { Lesson, getLessonAccessStatus, getAllLessons, getUserProgress } from '@/lib/lessonService';

/**
 * Learning Dashboard Page
 * 
 * Main learning module page that displays:
 * - User's overall progress
 * - List of all lessons with status
 * - Lesson player modal
 * - Progression-based access control
 * 
 * Flow:
 * 1. Load user progress from API
 * 2. Load all available lessons
 * 3. Determine which lessons are unlocked for user
 * 4. Display lesson cards with appropriate status
 * 5. Open lesson player when lesson is selected
 * 6. Update progress when lesson is completed
 */
export default function LearnPage() {
  // State management
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Initialize user ID and load data
  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get or create user ID (using localStorage for demo)
        let currentUserId = localStorage.getItem('userId');
        if (!currentUserId) {
          currentUserId = `user_${Date.now()}`;
          localStorage.setItem('userId', currentUserId);
        }
        setUserId(currentUserId);

        // Load lessons from API
        const lessonsData = await getAllLessons();
        setLessons(lessonsData);

        // Load user progress
        const progressData = await getUserProgress(currentUserId);
        setCompletedLessons(progressData.completedLessons);
      } catch (err) {
        console.error('Error loading page data:', err);
        setError('Unable to load lessons. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  /**
   * Handle lesson completion
   * Update local state and refresh progress
   */
  const handleLessonComplete = async (lessonId: number) => {
    setCompletedLessons(prev => {
      if (!prev.includes(lessonId)) {
        return [...prev, lessonId].sort((a, b) => a - b);
      }
      return prev;
    });

    // Optional: Show completion toast/notification
    console.log(`Lesson ${lessonId} completed! 🎉`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin inline-block">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading your learning journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Lessons</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No lessons state
  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
            <p className="text-blue-800 font-medium">No lessons available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📚 Financial Learning</h1>
          <p className="text-blue-100 text-lg">
            Learn financial concepts step by step. Complete lessons to unlock your financial future.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="mb-10">
          <LessonProgress
            completed={completedLessons.length}
            total={lessons.length}
            className="bg-white rounded-lg shadow-md p-6"
          />
        </div>

        {/* Lessons Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Lessons
          </h2>

          {lessons.map(lesson => {
            const accessStatus = getLessonAccessStatus(lesson, completedLessons);

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                status={accessStatus.status as 'completed' | 'current' | 'locked'}
                onSelect={setSelectedLesson}
                disabled={accessStatus.status === 'locked'}
              />
            );
          })}
        </div>

        {/* Completion Milestone */}
        {completedLessons.length === lessons.length && (
          <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-2">🏆 Congratulations!</h2>
            <p className="text-green-600 text-lg mb-4">
              You've completed all financial literacy lessons!
            </p>
            <p className="text-green-600 mb-6">
              You now have the knowledge to make better financial decisions. Keep practicing and help others learn too!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setCompletedLessons([])}
                className="px-6 py-2 bg-green-200 text-green-700 rounded-lg hover:bg-green-300 font-semibold"
              >
                Review Lessons
              </button>
            </div>
          </div>
        )}

        {/* Learning Tips */}
        <div className="mt-10 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">💡 Learning Tips</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>✓ Complete lessons in order to unlock the next level</li>
            <li>✓ Listen to the audio explanations for better understanding</li>
            <li>✓ Answer quiz questions correctly to demonstrate your learning</li>
            <li>✓ Share what you learn with your family and friends</li>
            <li>✓ Revisit any lesson anytime to refresh your knowledge</li>
          </ul>
        </div>
      </div>

      {/* Lesson Player Modal */}
      {selectedLesson && userId && (
        <LessonPlayer
          lesson={selectedLesson}
          userId={userId}
          onComplete={handleLessonComplete}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
