import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LessonsList from './components/LessonsList';
import FlashcardReview from './components/FlashcardReview';
import QuestionStudio from './components/QuestionStudio';
import AIAssistant from './components/AIAssistant';

import { UserProgress, SRSCard, Topic } from './types';
import { LESSONS } from './data/lessons';
import { QUESTIONS } from './data/questions';
import { INITIAL_FLASHCARDS } from './data/flashcards';
import { calculateSM2 } from './utils/srs';

const LOCAL_STORAGE_KEY = 'prepinterview_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  solvedQuestions: {},
  srsCards: {},
  streak: 3, // Encouraging starter streak
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // Core local persistence progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify structure validity
        if (parsed.completedLessons && parsed.solvedQuestions && parsed.srsCards) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse progress from localStorage, loading default instead.', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Write changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Merge static flashcard list with dynamic scheduled reviews in progress state
  const srsCards: SRSCard[] = INITIAL_FLASHCARDS.map(card => {
    const userCardState = progress.srsCards[card.id];
    if (userCardState) {
      return {
        ...card,
        repetitions: userCardState.repetitions,
        interval: userCardState.interval,
        easeFactor: userCardState.easeFactor,
        nextReviewDate: userCardState.nextReviewDate
      };
    }
    return card;
  });

  // Calculate global summary stats
  const totalSolved = Object.keys(progress.solvedQuestions).length;
  
  // Calculate total cards reviewed: sum up all repetitions
  const totalCardsReviewed = Object.values(progress.srsCards).reduce((acc, current) => {
    return acc + (current.repetitions || 0);
  }, 0);

  // Toggle lesson complete state
  const handleToggleCompleteLesson = (lessonId: string) => {
    setProgress(prev => {
      const completed = [...prev.completedLessons];
      const isAlreadyCompleted = completed.includes(lessonId);
      
      const newCompleted = isAlreadyCompleted
        ? completed.filter(id => id !== lessonId)
        : [...completed, lessonId];

      return {
        ...prev,
        completedLessons: newCompleted,
        ...updateStreakHelper(prev)
      };
    });
  };

  // Mark interactive question solved
  const handleSolveQuestion = (
    qId: string, 
    isCorrect: boolean, 
    answer: string, 
    language?: string, 
    aiFeedback?: any
  ) => {
    setProgress(prev => {
      const solved = { ...prev.solvedQuestions };
      solved[qId] = {
        isCorrect,
        userAnswer: answer,
        language,
        solvedAt: new Date().toISOString(),
        aiFeedback
      };

      return {
        ...prev,
        solvedQuestions: solved,
        ...updateStreakHelper(prev)
      };
    });
  };

  // Process SM2 rating score on selected flashcard
  const handleReviewCard = (cardId: string, quality: number) => {
    setProgress(prev => {
      const srsState = { ...prev.srsCards };
      const currentCard = srsState[cardId] || {
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString()
      };

      const updated = calculateSM2(
        quality,
        currentCard.repetitions,
        currentCard.interval,
        currentCard.easeFactor
      );

      srsState[cardId] = {
        repetitions: updated.repetitions,
        interval: updated.interval,
        easeFactor: updated.easeFactor,
        nextReviewDate: updated.nextReviewDate
      };

      return {
        ...prev,
        srsCards: srsState,
        ...updateStreakHelper(prev)
      };
    });
  };

  // Helper: auto-manages user activity streak
  const updateStreakHelper = (prev: UserProgress): Partial<UserProgress> => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (prev.lastActiveDate === todayStr) {
      return {}; // No change needed
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = prev.streak;
    if (prev.lastActiveDate === yesterdayStr) {
      newStreak += 1; // Increment streak
    } else {
      newStreak = 1; // Reset streak
    }

    return {
      streak: newStreak,
      lastActiveDate: todayStr
    };
  };

  // Helper trigger to jump to Lesson from dashboard cards
  const onSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lessons');
  };

  // Helper trigger to jump to Problem from dashboard cards
  const onSelectQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setActiveTab('questions');
  };

  // Select component views based on chosen menu tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            progress={progress}
            srsCards={srsCards}
            lessons={LESSONS}
            questions={QUESTIONS}
            setActiveTab={setActiveTab}
            onSelectLesson={onSelectLesson}
            onSelectQuestion={onSelectQuestion}
          />
        );
      case 'lessons':
        return (
          <LessonsList 
            lessons={LESSONS}
            progress={progress}
            onToggleComplete={handleToggleCompleteLesson}
            selectedLessonId={selectedLessonId}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
      case 'flashcards':
        return (
          <FlashcardReview 
            srsCards={srsCards}
            onReviewCard={handleReviewCard}
          />
        );
      case 'questions':
        return (
          <QuestionStudio 
            questions={QUESTIONS}
            progress={progress}
            onSolveQuestion={handleSolveQuestion}
            selectedQuestionId={selectedQuestionId}
            setSelectedQuestionId={setSelectedQuestionId}
          />
        );
      case 'coach':
        const activeItemContext = selectedQuestionId 
          ? `Đang giải câu hỏi: ${QUESTIONS.find(q => q.id === selectedQuestionId)?.title}`
          : selectedLessonId 
            ? `Đang đọc giáo trình: ${LESSONS.find(l => l.id === selectedLessonId)?.title}`
            : undefined;

        return (
          <AIAssistant 
            currentContext={activeItemContext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto clean child selectors when navigating between top tabs
          if (tab !== 'lessons') setSelectedLessonId(null);
          if (tab !== 'questions') setSelectedQuestionId(null);
        }}
        streak={progress.streak}
        totalSolved={totalSolved}
        totalCardsReviewed={totalCardsReviewed}
      />

      {/* Main Content Workspace viewport */}
      <main className="flex-1 bg-slate-950 px-4 md:px-8 py-6 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto h-full">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
