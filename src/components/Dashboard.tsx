import React from 'react';
import { 
  Flame, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Binary, 
  Server, 
  Layout, 
  Users, 
  FileCode,
  CheckCircle
} from 'lucide-react';
import { Topic, UserProgress, SRSCard, Lesson, Question } from '../types';
import { TOPICS } from '../data/topics';

interface DashboardProps {
  progress: UserProgress;
  srsCards: SRSCard[];
  lessons: Lesson[];
  questions: Question[];
  setActiveTab: (tab: string) => void;
  onSelectLesson: (id: string) => void;
  onSelectQuestion: (id: string) => void;
}

export default function Dashboard({ 
  progress, 
  srsCards, 
  lessons, 
  questions, 
  setActiveTab,
  onSelectLesson,
  onSelectQuestion
}: DashboardProps) {

  // Calculate stats
  const totalLessons = lessons.length;
  const completedLessonsCount = progress.completedLessons.length;
  const lessonsPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const solvedQuestionsCount = Object.keys(progress.solvedQuestions).length;
  const totalQuestions = questions.length;
  const questionsPercentage = totalQuestions > 0 ? Math.round((solvedQuestionsCount / totalQuestions) * 100) : 0;

  // Calculte SRS Status
  const now = new Date();
  const dueCards = srsCards.filter(card => new Date(card.nextReviewDate) <= now);
  const totalCards = srsCards.length;

  const topicMap = {
    dsa: { icon: Binary, bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/30' },
    'system-design': { icon: Server, bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/30' },
    frontend: { icon: Layout, bg: 'from-violet-500/10 to-purple-500/10', border: 'border-pink-500/30' },
    behavioral: { icon: Users, bg: 'from-purple-500/10 to-fuchsia-500/10', border: 'border-purple-500/30' },
    'language-basics': { icon: FileCode, bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/30' }
  };

  // Get next due card or a card in general to review
  const urgentCard = dueCards[0] || srsCards[0];

  // Recommendations
  const uncompletedLessons = lessons.filter(l => !progress.completedLessons.includes(l.id));
  const unsolvedQuestions = questions.filter(q => !progress.solvedQuestions[q.id]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Header */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-900">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Chào mừng bạn trở lại ôn luyện! 👋</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">Hôm nay hãy cùng nâng cao kỹ năng phản xạ tư duy kỹ thuật, giải quyết các thuật toán dãn cách và vượt qua phỏng vấn.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-900/60 self-start lg:self-center">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-slate-300 font-medium tracking-wide">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Grid Quick Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1: Streak */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex items-center justify-between group hover:border-slate-800 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase block">Chuỗi Học Tập</span>
            <span className="text-2xl font-black text-amber-500 block mt-1">{progress.streak} ngày</span>
            <span className="text-xs text-slate-400 mt-1 block">Duy trì ôn luyện hằng ngày</span>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 group-hover:scale-105 transition-transform">
            <Flame className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 2: Spaced Repetition Due */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex items-center justify-between group hover:border-slate-800 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase block">Thẻ Đang Chờ (SRS)</span>
            <span className="text-2xl font-black text-rose-500 block mt-1">{dueCards.length} thẻ</span>
            <span className="text-xs text-slate-400 mt-1 block">Yêu cầu lặp lại dãn cách</span>
          </div>
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 group-hover:scale-105 transition-transform">
            <Layers className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 3: Completed Lessons */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex items-center justify-between group hover:border-slate-800 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase block">Tiến độ Giáo trình</span>
            <span className="text-2xl font-black text-sky-400 block mt-1">{completedLessonsCount}/{totalLessons} bài</span>
            <div className="w-24 bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${lessonsPercentage}%` }}></div>
            </div>
          </div>
          <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform" id="lesson-stat-icon">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>

        {/* Stat 4: Solved coding */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex items-center justify-between group hover:border-slate-800 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase block">Bài tập Đã Giải</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">{solvedQuestionsCount}/{totalQuestions} câu</span>
            <div className="w-24 bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${questionsPercentage}%` }}></div>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform" id="question-stat-icon">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </section>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 col: Topic Grid & Lessons Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Spaced Repetition Callout */}
          {dueCards.length > 0 && (
            <div className="bg-gradient-to-r from-rose-500/10 to-indigo-500/10 p-6 rounded-2xl border border-rose-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <p className="text-sm font-bold text-rose-400">Yêu cầu lặp lại ngắt quãng hôm nay!</p>
                </div>
                <h3 className="text-lg font-bold text-slate-200">Bạn có {dueCards.length} thẻ ghi nhớ sẵn sàng để phản xạ</h3>
                <p className="text-xs text-slate-400">Thuật toán SM-2 khuyên bạn nên làm ván ôn tập nhanh này để củng cố trí nhớ dài hạn, tránh rơi vào "đường cong lãng quên".</p>
              </div>
              <button
                onClick={() => setActiveTab('flashcards')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-rose-600/15 flex items-center justify-center transition-colors shrink-0"
                id="review-now-btn"
              >
                Ôn Tập Ngay <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Topics Roadmap section */}
          <section className="space-y-4">
            <h3 className="text-md font-extrabold text-slate-300 uppercase tracking-widest pl-1 border-l-2 border-sky-500">Chủ Đề Ôn Luyện</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPICS.map((topic) => {
                const meta = topicMap[topic.id];
                const TopicIcon = meta.icon;
                
                // Track progress
                const topicLessons = lessons.filter(l => l.topic === topic.id);
                const comTopicLessons = topicLessons.filter(l => progress.completedLessons.includes(l.id));
                const completedCount = comTopicLessons.length;
                const totalCount = topicLessons.length;
                const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div 
                    key={topic.id}
                    className="bg-slate-900/30 rounded-2xl border border-slate-900/80 p-5 hover:border-slate-800 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 bg-gradient-to-br ${meta.bg} rounded-xl border ${meta.border}`}>
                          <TopicIcon className="w-5 h-5 text-slate-200" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {percentage}% Hoàn thành
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mt-4 group-hover:text-sky-400 transition-colors">{topic.vietnameseName}</h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{topic.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{completedCount}/{totalCount} Bài học</span>
                      <button 
                        onClick={() => {
                          setActiveTab('lessons');
                        }}
                        className="text-sky-400 font-semibold flex items-center hover:underline bg-transparent border-0 cursor-pointer"
                        id={`explore-topic-${topic.id}`}
                      >
                        Khám phá <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right 1 col: Suggestions & Insights */}
        <div className="space-y-6">

          {/* Quick learning trigger recommendation */}
          <section className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900/80 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-2" /> Gợi ý học tiếp
            </h3>
            
            <div className="space-y-3.5">
              {/* Suggestion 1: Uncompleted Lesson */}
              {uncompletedLessons.length > 0 ? (
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex items-start justify-between gap-3 hover:border-slate-800 transition-colors group">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-400">Giáo trình đề xuất</span>
                    <h4 className="text-xs font-bold text-slate-300 truncate group-hover:text-sky-400 transition-all">{uncompletedLessons[0].title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {uncompletedLessons[0].duration}
                    </p>
                  </div>
                  <button 
                    onClick={() => onSelectLesson(uncompletedLessons[0].id)}
                    className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 cursor-pointer shrink-0"
                    id="recommend-lesson-btn"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-center py-5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-300">Tuyệt vời! Đã học xong mọi giáo trình</p>
                </div>
              )}

              {/* Suggestion 2: Unsolved Question */}
              {unsolvedQuestions.length > 0 ? (
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex items-start justify-between gap-3 hover:border-slate-800 transition-colors group">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">Thử thách câu hỏi</span>
                    <h4 className="text-xs font-bold text-slate-300 truncate group-hover:text-amber-400 transition-all">{unsolvedQuestions[0].title}</h4>
                    <p className="text-[11px] text-slate-500 capitalize">
                      Độ khó: <span className={`font-semibold ${
                        unsolvedQuestions[0].difficulty === 'easy' ? 'text-emerald-400' :
                        unsolvedQuestions[0].difficulty === 'medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>{unsolvedQuestions[0].difficulty === 'easy' ? 'Dễ' : unsolvedQuestions[0].difficulty === 'medium' ? 'Trung bình' : 'Khó'}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => onSelectQuestion(unsolvedQuestions[0].id)}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 cursor-pointer shrink-0"
                    id="recommend-question-btn"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-center py-5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-300">Tuyệt phẩm! Đã giải hết toàn bộ câu hỏi</p>
                </div>
              )}
            </div>
          </section>

          {/* Spaced repetition memory guidelines */}
          <section className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900/80 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest pl-1 border-l-2 border-indigo-400">Bí quyết nhớ lâu (SRS)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Học ngắt nhịp dãn cách (Spaced Repetition) là mô hình khoa học thần kinh chứng minh rằng trí nhớ con người phai lạt dần dạng lũy thừa. Bằng cách hiển thị lại thẻ ngay tại mốc **sắp lãng quên**, bạn sẽ tái cố định khớp thần kinh, giúp lưu trữ kiến thức phỏng vấn vĩnh viễn ở vỏ não.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900/80 flex items-center space-x-3.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-medium text-slate-400">Độ phức tạp và cơ chế tính toán đạt tiêu chuẩn SuperMemo-2.</span>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
