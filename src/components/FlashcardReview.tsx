import React, { useState } from 'react';
import { 
  Layers, 
  HelpCircle, 
  RotateCw, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  Award,
  ChevronRight,
  Bookmark,
  Info
} from 'lucide-react';
import { SRSCard, Topic } from '../types';
import { TOPICS } from '../data/topics';

interface FlashcardReviewProps {
  srsCards: SRSCard[];
  onReviewCard: (cardId: string, quality: number) => void;
}

export default function FlashcardReview({ srsCards, onReviewCard }: FlashcardReviewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [reviewAll, setReviewAll] = useState(false);

  // Filter cards due today
  const now = new Date();
  const dueCards = srsCards.filter(card => new Date(card.nextReviewDate) <= now);
  
  // Decide active session cards
  const activeCards = reviewAll ? srsCards : dueCards;
  const currentCard = activeCards[currentIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (quality: number) => {
    if (!currentCard) return;
    
    // Call SM-2 evaluate
    onReviewCard(currentCard.id, quality);
    
    // Animation reset & slide next
    setIsFlipped(false);
    setShowHint(false);
    
    if (currentIdx < activeCards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Done with batch!
      setCurrentIdx(0);
    }
  };

  const getTopicLabel = (topicId: Topic) => {
    const t = TOPICS.find(tp => tp.id === topicId);
    return t ? t.vietnameseName : topicId;
  };

  // If there are no due cards and not review-all yet
  if (activeCards.length === 0) {
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center py-10 animate-fade-in" id="no-cards-due-screen">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/15">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Tuyệt vời! Bạn đã hoàn thành hôm nay!</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Hiện tại không có thẻ ghi nhớ nào đến hạn ôn tập dãn cách. Não bộ của bạn đang lưu vững kiến thức này.
          </p>
        </div>

        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-900 text-left space-y-2 max-w-md mx-auto text-xs text-slate-400">
          <p className="font-bold text-slate-300 flex items-center mb-1">
            <Info className="w-4 h-4 mr-1.5 text-indigo-400" /> Hệ thống đang hoạt động tối ưu
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Lặp lại dãn cách sẽ tự động lên lịch thẻ ôn tập tiếp theo sau vài ngày tùy chất lượng ghi nhớ của bạn.</li>
            <li>Giúp tiết kiệm đến 80% thời gian ôn luyện lý thuyết.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => setReviewAll(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide transition-colors cursor-pointer"
            id="review-all-deck-btn"
          >
            Xem Lại Cả Kho Thẻ ({srsCards.length} Thẻ)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Upper Progress tracker */}
      <div className="flex items-center justify-between bg-slate-900/30 px-5 py-3.5 rounded-xl border border-slate-900">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">
            {reviewAll ? 'Đang ôn lại toàn bộ' : 'Thẻ đến hạn hôm nay'}
          </span>
          <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold text-slate-400 border border-slate-900">
            {currentIdx + 1}/{activeCards.length}
          </span>
        </div>
        
        {reviewAll && (
          <button
            onClick={() => {
              setReviewAll(false);
              setCurrentIdx(0);
              setIsFlipped(false);
            }}
            className="text-[10px] font-bold text-rose-400 hover:underline bg-transparent border-none cursor-pointer"
            id="stop-review-all-btn"
          >
            Quay lại chế độ dãn cách
          </button>
        )}
      </div>

      {/* 3D Perspective Flip space */}
      <div className="perspective-1000 w-full min-h-[300px] relative cursor-pointer" onClick={handleFlip}>
        <div className={`
          w-full min-h-[300px] rounded-2xl border transition-all duration-500 transform-style-3d relative p-6 md:p-8 flex flex-col justify-between select-none shadow-2xl
          ${isFlipped 
            ? 'rotate-y-180 bg-slate-900/60 border-indigo-500/40 shadow-indigo-500/5' 
            : 'bg-slate-900/40 border-slate-900 hover:border-slate-800'}
        `} id="srs-card-flipper">
          
          {/* Card Face: FRONT */}
          {!isFlipped ? (
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                    {getTopicLabel(currentCard.topic)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500">Mức: {currentCard.difficulty === 'easy' ? 'Dễ' : currentCard.difficulty === 'medium' ? 'T.Bình' : 'Khó'}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-md font-extrabold text-slate-400">Câu Hỏi:</h3>
                  <p className="text-sm md:text-md text-slate-100 font-medium leading-relaxed">
                    {currentCard.front}
                  </p>
                </div>
              </div>

              {/* Hint space */}
              <div>
                {currentCard.hint && (
                  <div className="mb-4">
                    {showHint ? (
                      <p className="text-xs text-indigo-300 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 flex items-start">
                        <HelpCircle className="w-4 h-4 mr-1.5 shrink-0 text-indigo-400 mt-0.5" />
                        Gợi ý: {currentCard.hint}
                      </p>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline bg-transparent border-0 cursor-pointer flex items-center"
                        id="show-hint-btn"
                      >
                        <HelpCircle className="w-3.5 h-3.5 mr-1" /> Tiết lộ gợi ý
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center text-xs text-slate-500 font-semibold pt-2 border-t border-slate-900/60 mt-4 group">
                  <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin-slow group-hover:scale-110" /> click vào bất kì vị trí nào để lật thẻ
                </div>
              </div>
            </div>
          ) : (
            // Card Face: BACK
            <div className="flex flex-col justify-between h-full space-y-6 rotate-y-180">
              <div>
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-400 tracking-wider">
                    ĐÁP ÁN CHUẨN KIẾN THỨC
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Lặp lại lần thứ {currentCard.repetitions}
                  </span>
                </div>

                <div className="mt-6 space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentCard.back}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-900/60 pt-4 flex items-center justify-center text-xs text-slate-500 font-semibold group">
                <RotateCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Nhấp tiếp để thu gọn quay lại câu hỏi
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spaced repetition scoring controllers */}
      {isFlipped && (
        <div className="bg-slate-950 rounded-2xl border border-slate-900 p-5 space-y-4 animate-slide-up" id="srs-evaluation-section">
          <div className="text-center space-y-1">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">ĐÁNH GIÁ MỨC ĐỘ THUỘC</h4>
            <p className="text-[11px] text-slate-500">Mức độ tự nhớ của bạn đối với đáp án trên ra sao? Để SM-2 tính khoảng cách lặp lại:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { score: 5, label: 'Hoàn Hảo', color: 'hover:bg-emerald-600 hover:text-white border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
              { score: 4, label: 'Rất Nhớ', color: 'hover:bg-teal-600 hover:text-white border-teal-500/20 text-teal-400 bg-teal-500/5' },
              { score: 3, label: 'Khó Khăn', color: 'hover:bg-sky-600 hover:text-white border-sky-500/20 text-sky-400 bg-sky-500/5' },
              { score: 2, label: 'Sai (Quen)', color: 'hover:bg-amber-600 hover:text-white border-amber-500/20 text-amber-400 bg-amber-500/5' },
              { score: 1, label: 'Lờ Mờ', color: 'hover:bg-orange-600 hover:text-white border-orange-500/20 text-orange-400 bg-orange-500/5' },
              { score: 0, label: 'Quên Hẳn', color: 'hover:bg-rose-600 hover:text-white border-rose-500/20 text-rose-400 bg-rose-500/5' },
            ].map((btn) => (
              <button
                key={btn.score}
                id={`evaluate-srs-btn-${btn.score}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRate(btn.score);
                }}
                className={`
                  p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between items-center cursor-pointer focus:outline-none
                  ${btn.color}
                `}
              >
                <span className="text-[13px] font-black">{btn.score}</span>
                <span className="text-[9px] font-bold mt-0.5 whitespace-nowrap">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
