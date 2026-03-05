/**
 * Lesson Service
 * 
 * Manages lesson data fetching, completion tracking, and progression logic.
 * This service acts as a bridge between the React components and the API endpoints.
 */

/**
 * Lesson interface
 */
export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: number;
  level: number;
  title: string;
  description: string;
  text: string;
  audio: string;
  quiz?: Quiz;
  estimatedTime: string;
}

/**
 * Completion record interface
 */
export interface CompletionRecord {
  userId: string;
  lessonId: number;
  completedAt: string;
  answers?: Record<string, number>;
  score?: number;
}

/**
 * User progress interface
 */
export interface UserProgress {
  userId: string;
  completedLessons: number[];
  totalCompleted: number;
  progress: number;
  nextUnlockedLesson: number;
}

/**
 * Fetch all lessons from the API
 * 
 * @returns Promise<Lesson[]> - Array of all available lessons
 * @throws Error if the API request fails
 */
export async function getAllLessons(): Promise<Lesson[]> {
  try {
    const response = await fetch('/api/lessons', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const data = await response.json();
    return data.lessons || [];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
}

/**
 * Get a specific lesson by ID
 * 
 * @param lessonId - The ID of the lesson to retrieve
 * @returns Promise<Lesson | null> - The lesson object or null if not found
 */
export async function getLessonById(lessonId: number): Promise<Lesson | null> {
  try {
    const lessons = await getAllLessons();
    return lessons.find(lesson => lesson.id === lessonId) || null;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    return null;
  }
}

/**
 * Mark a lesson as completed for the current user
 * 
 * @param lessonId - The ID of the lesson to mark complete
 * @param userId - The user's unique identifier
 * @param answers - Optional quiz answers object
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function completeLesson(
  lessonId: number,
  userId: string,
  answers?: Record<string, number>
): Promise<boolean> {
  try {
    const response = await fetch('/api/lessons/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId,
        userId,
        answers,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to complete lesson: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error completing lesson ${lessonId}:`, error);
    return false;
  }
}

/**
 * Fetch user's progress and completed lessons
 * 
 * @param userId - The user's unique identifier
 * @returns Promise<UserProgress> - User's progress data
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    const response = await fetch(`/api/lessons/complete?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user progress: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      userId: data.userId,
      completedLessons: data.completedLessons || [],
      totalCompleted: data.totalCompleted || 0,
      progress: data.progress || 0,
      nextUnlockedLesson: data.nextUnlockedLesson || 1,
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    // Return default progress if API fails
    return {
      userId,
      completedLessons: [],
      totalCompleted: 0,
      progress: 0,
      nextUnlockedLesson: 1,
    };
  }
}

/**
 * Check if a lesson is unlocked for the user
 * 
 * @param lessonId - The lesson to check
 * @param completedLessons - Array of completed lesson IDs
 * @returns boolean - True if the lesson is unlocked
 * 
 * Logic: A lesson is unlocked if the user has completed all previous lessons
 * or if it's the first lesson.
 */
export function isLessonUnlocked(lessonId: number, completedLessons: number[]): boolean {
  // First lesson is always unlocked
  if (lessonId === 1) {
    return true;
  }

  // A lesson is unlocked if all previous lessons are completed
  // For example, lesson 3 is unlocked if lessons 1 and 2 are completed
  for (let i = 1; i < lessonId; i++) {
    if (!completedLessons.includes(i)) {
      return false;
    }
  }

  return true;
}

/**
 * Get the next unlocked lesson
 * 
 * @param completedLessons - Array of completed lesson IDs
 * @param totalLessons - Total number of lessons available
 * @returns number - The ID of the next unlocked lesson
 */
export function getNextUnlockedLesson(
  completedLessons: number[],
  totalLessons: number = 6
): number {
  for (let i = 1; i <= totalLessons; i++) {
    if (!completedLessons.includes(i)) {
      return i;
    }
  }
  return totalLessons; // All lessons completed
}

/**
 * Calculate progress percentage
 * 
 * @param completedLessons - Number of completed lessons
 * @param totalLessons - Total number of lessons
 * @returns number - Progress percentage (0-100)
 */
export function calculateProgress(
  completedLessons: number,
  totalLessons: number = 6
): number {
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Get lessons grouped by level
 * 
 * @param lessons - Array of all lessons
 * @returns Record<number, Lesson[]> - Lessons organized by level
 */
export function lessonsByLevel(lessons: Lesson[]): Record<number, Lesson[]> {
  return lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.level]) {
        acc[lesson.level] = [];
      }
      acc[lesson.level].push(lesson);
      return acc;
    },
    {} as Record<number, Lesson[]>
  );
}

/**
 * Validate quiz answer
 * 
 * @param quiz - The quiz object
 * @param selectedAnswer - The user's selected answer index
 * @returns boolean - True if the answer is correct
 */
export function validateQuizAnswer(quiz: Quiz, selectedAnswer: number): boolean {
  return selectedAnswer === quiz.correctAnswer;
}

/**
 * Get lesson access status for user
 * 
 * @param lesson - The lesson to check
 * @param completedLessons - Array of completed lesson IDs
 * @returns Object with status information
 */
export function getLessonAccessStatus(lesson: Lesson, completedLessons: number[]) {
  const isUnlocked = isLessonUnlocked(lesson.id, completedLessons);
  const isCompleted = completedLessons.includes(lesson.id);
  const isCurrentLesson = !isCompleted && isUnlocked;

  return {
    isUnlocked,
    isCompleted,
    isCurrentLesson,
    status: isCompleted ? 'completed' : isCurrentLesson ? 'current' : 'locked',
  };
}
