import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Play, Volume2, X, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Enhanced Lesson Interface with financial content
 */
interface Lesson {
  id: number;
  level: number;
  title: string;
  description: string;
  text: string;
  audio: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  estimatedTime: string;
}

const DashboardLearn = () => {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize page and load data
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get or create user ID
        let currentUserId = localStorage.getItem("userId");
        if (!currentUserId) {
          currentUserId = `user_${Date.now()}`;
          localStorage.setItem("userId", currentUserId);
        }
        setUserId(currentUserId);

        // Fetch lessons from API
        const response = await fetch("/api/lessons");
        if (!response.ok) throw new Error("Failed to fetch lessons");
        
        const data = await response.json();
        setLessons(data.lessons || []);

        // Fetch user progress
        const progressResponse = await fetch(
          `/api/lessons/complete?userId=${encodeURIComponent(currentUserId)}`
        );
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setCompletedLessons(progressData.completedLessons || []);
        }
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError(t("loadingError") || "Unable to load lessons");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [t]);

  /**
   * Check if a lesson is unlocked based on completion status
   */
  const isLessonUnlocked = (lessonId: number): boolean => {
    if (lessonId === 1) return true;
    return completedLessons.includes(lessonId - 1);
  };

  /**
   * Get lesson status for display
   */
  const getLessonStatus = (lessonId: number): "completed" | "current" | "locked" => {
    if (completedLessons.includes(lessonId)) return "completed";
    if (isLessonUnlocked(lessonId)) return "current";
    return "locked";
  };

  /**
   * Handle lesson selection
   */
  const handleSelectLesson = (lesson: Lesson) => {
    if (getLessonStatus(lesson.id) !== "locked") {
      setSelectedLesson(lesson);
      setSelectedAnswer(null);
      setQuizFeedback(null);
    }
  };

  /**
   * Play audio using Web Speech API
   */
  const handleSpeak = () => {
    if (!selectedLesson) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(selectedLesson.audio);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = "en-IN";

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        alert(t("audioError") || "Error playing audio");
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsPlaying(false);
    }
  };

  /**
   * Handle quiz submission
   */
  const handleSubmitQuiz = async () => {
    if (!selectedLesson || selectedLesson.quiz === undefined || selectedAnswer === null) {
      alert(t("selectAnswer") || "Please select an answer");
      return;
    }

    const isCorrect = selectedAnswer === selectedLesson.quiz.correctAnswer;

    if (isCorrect) {
      setQuizFeedback("✅ Correct! Well done!");

      // Mark lesson as complete after 1 second
      setTimeout(() => {
        handleCompleteLesson();
      }, 1000);
    } else {
      setQuizFeedback(
        `❌ Not quite right. The correct answer is: ${selectedLesson.quiz.options[selectedLesson.quiz.correctAnswer]}`
      );
    }
  };

  /**
   * Mark lesson as complete
   */
  const handleCompleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      const response = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          userId,
          answers: selectedAnswer !== null ? { 0: selectedAnswer } : undefined,
        }),
      });

      if (response.ok) {
        // Update local state
        if (!completedLessons.includes(selectedLesson.id)) {
          setCompletedLessons([...completedLessons, selectedLesson.id].sort((a, b) => a - b));
        }
        
        // Close modal and show success
        setTimeout(() => {
          setSelectedLesson(null);
          setSelectedAnswer(null);
          setQuizFeedback(null);
        }, 500);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      alert(t("savingError") || "Error saving lesson completion");
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">{t("loading") || "Loading lessons..."}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  // No lessons state
  if (lessons.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">{t("noLessons") || "No lessons available yet"}</p>
      </div>
    );
  }

  const progressPercentage = Math.round((completedLessons.length / lessons.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("learn") || "Financial Learning"}</h2>
        <p className="text-sm text-muted-foreground">
          {t("learnSubtitle") || "Complete lessons sequentially to unlock financial knowledge"}
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t("yourProgress") || "Your Progress"}</span>
          <span className="text-sm font-bold text-primary">
            {completedLessons.length} / {lessons.length} {t("lessons")}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">{progressPercentage}% {t("complete") || "complete"}</p>
      </div>

      {/* Lessons List */}
      <div className="grid gap-3">
        {lessons.map((lesson, idx) => {
          const status = getLessonStatus(lesson.id);
          const isUnlocked = status !== "locked";

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleSelectLesson(lesson)}
              className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${
                status === "completed"
                  ? "bg-green-50 border-green-300 hover:shadow-md"
                  : status === "current"
                  ? "bg-blue-50 border-blue-300 hover:shadow-md"
                  : "bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                    status === "completed"
                      ? "bg-green-500 text-white"
                      : status === "current"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {status === "completed" ? "✓" : status === "current" ? lesson.level : "🔒"}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{lesson.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-white rounded border">Level {lesson.level}</span>
                    <span>⏱️ {lesson.estimatedTime}</span>
                    {lesson.quiz && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Quiz included</span>}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectLesson(lesson);
                  }}
                  disabled={!isUnlocked}
                  variant={status === "completed" ? "outline" : "default"}
                  size="sm"
                  className={status === "completed" ? "border-green-600 text-green-600" : ""}
                >
                  {status === "completed" ? "📖 Review" : "▶️ Start"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Milestone */}
      {completedLessons.length === lessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 text-center"
        >
          <p className="text-3xl mb-2">🎉</p>
          <h3 className="text-lg font-bold text-green-700 mb-2">{t("congratulations") || "Congratulations!"}</h3>
          <p className="text-sm text-green-600">
            {t("allLessonsComplete") || "You have completed all financial learning lessons!"}
          </p>
        </motion.div>
      )}

      {/* Lesson Player Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <Dialog open={true} onOpenChange={() => setSelectedLesson(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedLesson.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedLesson.description}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Lesson Content */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-bold text-sm mb-3">📖 {t("lessonContent") || "Lesson Content"}</h4>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {selectedLesson.text}
                  </p>
                </div>

                {/* Audio Playback */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    🔊 {t("audioExplanation") || "Audio Explanation"}
                  </h4>
                  <Button
                    onClick={handleSpeak}
                    className={`w-full ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"}`}
                  >
                    {isPlaying ? "⏸️ Stop" : "▶️ Play Audio"}
                  </Button>
                </div>

                {/* Quiz Section */}
                {selectedLesson.quiz && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm mb-3">📝 Quick Quiz</h4>
                    <p className="text-sm font-medium mb-3">{selectedLesson.quiz.question}</p>

                    <div className="space-y-2 mb-4">
                      {selectedLesson.quiz.options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-2 rounded border-2 cursor-pointer transition-colors ${
                            selectedAnswer === idx
                              ? "bg-purple-100 border-purple-500"
                              : "bg-white border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="answer"
                            value={idx}
                            checked={selectedAnswer === idx}
                            onChange={() => {
                              setSelectedAnswer(idx);
                              setQuizFeedback(null);
                            }}
                            className="w-4 h-4"
                          />
                          <span className="ml-2 text-sm">{option}</span>
                        </label>
                      ))}
                    </div>

                    {quizFeedback && (
                      <div
                        className={`p-2 rounded text-sm font-medium mb-3 ${
                          quizFeedback.includes("✅")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {quizFeedback}
                      </div>
                    )}

                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={selectedAnswer === null}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {t("submitAnswer") || "Submit Answer"}
                    </Button>
                  </div>
                )}

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 {t("lessonTip") || `${!selectedLesson.quiz ? "Click 'Complete' to finish this lesson." : "Answer the quiz correctly to mark complete."}`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedLesson(null)} className="flex-1">
                  {t("close") || "Close"}
                </Button>
                {!selectedLesson.quiz && (
                  <Button
                    onClick={handleCompleteLesson}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ✓ {t("completeLesson") || "Mark Complete"}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLearn;
