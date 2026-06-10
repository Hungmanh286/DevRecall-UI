import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { Lesson, Topic, UserProgress } from '../types';
import { TOPICS } from '../data/topics';

interface LessonsListProps {
  lessons: Lesson[];
  progress: UserProgress;
  onToggleComplete: (lessonId: string) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
}

export default function LessonsList({ 
  lessons, 
  progress, 
  onToggleComplete,
  selectedLessonId,
  setSelectedLessonId 
}: LessonsListProps) {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(search.toLowerCase()) || 
                          lesson.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || lesson.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const getDifficultyBadge = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Dễ</span>;
      case 'medium':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">T.Bình</span>;
      case 'hard':
        return <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Khó</span>;
    }
  };

  const getTopicLabel = (topicId: Topic) => {
    const topic = TOPICS.find(t => t.id === topicId);
    return topic ? topic.vietnameseName : topicId;
  };

  const isCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);

  return (
    <div className="space-y-6">
      {!selectedLesson ? (
        // List View
        <div className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-400" /> Giáo trình Ôn luyện Phỏng vấn
            </h2>
            <p className="text-sm text-slate-400">Các chủ đề cốt lõi được chắt lọc chuyên biệt giúp xây dựng tư duy lập trình vững chắc từ lý thuyết đến thực tế.</p>
          </header>

          {/* Filters & Search Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/30 p-4 rounded-xl border border-slate-900" id="filter-row">
            {/* Topic Filter Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedTopic === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
                id="topic-tab-all"
              >
                Mọi chủ đề
              </button>
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  id={`topic-tab-${topic.id}`}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedTopic === topic.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {topic.vietnameseName}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tiêu đề bài học..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-900 focus:outline-none focus:border-indigo-500/80 transition-colors"
                id="lesson-search-input"
              />
            </div>
          </div>

          {/* Lessons Grid list */}
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="lessons-grid">
              {filteredLessons.map((lesson) => {
                const complete = isCompleted(lesson.id);
                return (
                  <div 
                    key={lesson.id}
                    id={`lesson-card-${lesson.id}`}
                    className="bg-slate-900/30 hover:bg-slate-900/40 rounded-xl border border-slate-900 p-5 flex flex-col justify-between group hover:border-slate-800 transition-all shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                          {getTopicLabel(lesson.topic)}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          {getDifficultyBadge(lesson.difficulty)}
                          {complete && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Hoàn thành</span>}
                        </div>
                      </div>

                      <h3 className="font-extrabold text-slate-200 text-sm mt-3.5 group-hover:text-sky-400 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {lesson.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-900/60 flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {lesson.duration} học tập
                      </div>
                      <button 
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer bg-transparent border-0"
                        id={`read-lesson-btn-${lesson.id}`}
                      >
                        <span>Học ngay</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/10 rounded-xl border border-slate-900/60">
              <p className="text-slate-400 text-sm">Không tìm thấy bài học nào phù hợp với yêu cầu tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
      ) : (
        // Detailed Reader Screen
        <div className="bg-slate-950 rounded-2xl border border-slate-900 p-6 md:p-8 space-y-6 max-w-4xl mx-auto" id="lesson-reader">
          {/* Back Trigger */}
          <button
            onClick={() => setSelectedLessonId(null)}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-xs font-bold bg-transparent border-0 cursor-pointer focus:outline-none"
            id="back-to-lessons-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại bài học</span>
          </button>

          {/* Lesson Header Information */}
          <div className="space-y-4 pb-6 border-b border-slate-900/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] uppercase py-1 px-3 bg-slate-900 border border-slate-800 rounded-full font-extrabold text-indigo-400 tracking-wider">
                {getTopicLabel(selectedLesson.topic)}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium flex items-center py-1">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Đọc ước tính: {selectedLesson.duration}
                </span>
                {getDifficultyBadge(selectedLesson.difficulty)}
              </div>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-slate-100 tracking-tight leading-tight">
              {selectedLesson.title}
            </h1>
            <p className="text-sm font-medium text-slate-400 italic">
              {selectedLesson.summary}
            </p>
          </div>

          {/* Reading Sandbox */}
          <div className="markdown-body text-slate-300 space-y-4 text-xs md:text-sm leading-relaxed prose prose-invert max-w-none">
            <Markdown>{selectedLesson.content}</Markdown>
          </div>

          {/* Completed State toggle action panel */}
          <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/10 p-5 rounded-xl border border-slate-900">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">Ghi dấu mốc học tập!</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Xác nhận để ghi nhận tiến độ giải phỏng vấn của bạn.</p>
              </div>
            </div>
            
            <button
              onClick={() => onToggleComplete(selectedLesson.id)}
              className={`
                w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide flex items-center justify-center transition-all cursor-pointer
                ${isCompleted(selectedLesson.id)
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15'}
              `}
              id="lesson-toggle-complete-btn"
            >
              {isCompleted(selectedLesson.id) ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Đã hoàn thành (Hủy bỏ)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Đánh dấu đã học hoàn tất
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
