'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lesson, completeLesson, validateQuizAnswer } from '@/lib/lessonService';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from './ui/alert-dialog';

/**
 * LessonPlayer Component
 * 
 * Full-featured lesson player with:
 * - Lesson title and text content
 * - Text-to-speech audio playback
 * - Quiz questions with answer validation
 * - Mark lesson complete functionality
 * - Error handling for speech synthesis
 * - Progress navigation
 * 
 * Supports multiple languages through SpeechSynthesis API.
 * Falls back gracefully if speech synthesis is unavailable.
 * 
 * @param {Lesson} lesson - The lesson to display
 * @param {string} userId - Current user's ID
 * @param {function} onComplete - Callback when lesson is marked complete
 * @param {function} onClose - Callback to close the player
 */
interface LessonPlayerProps {
  lesson: Lesson;
  userId: string;
  onComplete: (lessonId: number) => void;
  onClose: () => void;
}

export function LessonPlayer({
  lesson,
  userId,
  onComplete,
  onClose,
}: LessonPlayerProps) {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{
    questionIndex: number;
    isCorrect: boolean;
    message: string;
  } | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSpeechSupported(false);
    }
  }, []);

  /**
   * Speak the lesson text using SpeechSynthesis API
   * Supports multiple languages with fallback to English
   */
  const handleSpeak = () => {
    if (!isSpeechSupported) {
      alert('Speech synthesis is not supported in your browser. Try using Chrome or Firefox.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      // Cancel any previous speech
      window.speechSynthesis.cancel();

      // Create utterance with lesson audio text
      const utterance = new SpeechSynthesisUtterance(lesson.audio);
      
      // Configure voice properties
      utterance.rate = 1.0; // Normal speaking speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume

      // Set language (detect from lesson or default to English)
      utterance.lang = 'en-IN'; // Default to Indian English

      // Handle speech start
      utterance.onstart = () => {
        setIsPlaying(true);
      };

      // Handle speech end
      utterance.onend = () => {
        setIsPlaying(false);
      };

      // Handle speech error
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        alert('Error playing audio. Please try again.');
      };

      // Store reference and speak
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error initiating speech:', error);
      alert('Error playing audio. Please try again.');
      setIsPlaying(false);
    }
  };

  /**
   * Handle quiz answer selection
   */
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
    // Clear previous feedback
    setQuizFeedback(null);
  };

  /**
   * Validate and submit quiz answers
   */
  const handleSubmitQuiz = () => {
    if (!lesson.quiz) return;

    const selectedAnswer = selectedAnswers[0];
    
    if (selectedAnswer === undefined) {
      alert('Please select an answer before submitting.');
      return;
    }

    const isCorrect = validateQuizAnswer(lesson.quiz, selectedAnswer);
    
    setQuizFeedback({
      questionIndex: 0,
      isCorrect,
      message: isCorrect
        ? '🎉 Correct! Great job!'
        : `❌ Not quite. The correct answer is: ${lesson.quiz.options[lesson.quiz.correctAnswer]}`,
    });

    // If correct, allow marking as complete
    if (isCorrect) {
      setTimeout(() => {
        handleMarkComplete();
      }, 1000);
    }
  };

  /**
   * Mark lesson as complete and save to database
   */
  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    try {
      const success = await completeLesson(lesson.id, userId, selectedAnswers);
      
      if (success) {
        onComplete(lesson.id);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        alert('Error saving lesson completion. Please try again.');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Error saving lesson completion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* Main Card */}
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-blue-100">{lesson.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-blue-200 transition"
            aria-label="Close lesson"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lesson Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pb-4 border-b">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              Level {lesson.level}
            </span>
            <span className="flex items-center gap-1">
              ⏱️ {lesson.estimatedTime}
            </span>
          </div>

          {/* Main Text Content */}
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Lesson Content</h3>
            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
              {lesson.text}
            </p>
          </div>

          {/* Audio Playback Controls */}
          <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                🔊 Listen to Explanation
              </h3>
              {isPlaying && <span className="text-orange-600 font-medium animate-pulse">Playing...</span>}
            </div>
            
            <Button
              onClick={handleSpeak}
              disabled={!isSpeechSupported}
              className={`w-full py-3 font-semibold rounded-lg transition ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isPlaying ? (
                <>🎙️ Stop Playing (Click to Stop)</>
              ) : (
                <>▶️ Play Audio Explanation</>
              )}
            </Button>

            {!isSpeechSupported && (
              <p className="text-sm text-orange-600 mt-2 italic">
                Note: Speech synthesis is not supported in your browser. Try Chrome or Firefox.
              </p>
            )}
          </div>

          {/* Quiz Section */}
          {lesson.quiz && (
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                📝 Quick Quiz
              </h3>

              {/* Question */}
              <p className="text-base font-medium text-gray-800 mb-4">
                {lesson.quiz.question}
              </p>

              {/* Answer Options */}
              <div className="space-y-2 mb-4">
                {lesson.quiz.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      selectedAnswers[0] === index
                        ? 'bg-purple-100 border-purple-500'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-answer"
                      value={index}
                      checked={selectedAnswers[0] === index}
                      onChange={() => handleAnswerSelect(0, index)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>

              {/* Quiz Feedback */}
              {quizFeedback && (
                <div className={`p-3 rounded-lg mb-4 ${
                  quizFeedback.isCorrect
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {quizFeedback.message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers[0] === undefined || isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          )}

          {/* Progress Note */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800">
              💡 <strong>Tip:</strong> {lesson.quiz ? 'Answer the quiz correctly to mark this lesson complete.' : 'Click the button below to mark this lesson as complete.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
          {!lesson.quiz && (
            <Button
              onClick={() => setShowCompleteDialog(true)}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isSubmitting ? '⏳ Saving...' : '✓ Mark as Complete'}
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Mark Lesson as Complete?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this lesson as complete? You'll be able to start the next lesson.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkComplete}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Saving...' : 'Complete Lesson'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LessonPlayer;
