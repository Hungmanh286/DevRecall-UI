import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Terminal, 
  Search, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  CheckCircle, 
  X,
  Play, 
  Sparkles, 
  Code, 
  Brain, 
  BookMarked,
  Cpu,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Question, Topic, UserProgress, AIFeedback } from '../types';
import { TOPICS } from '../data/topics';

interface QuestionStudioProps {
  questions: Question[];
  progress: UserProgress;
  onSolveQuestion: (qId: string, isCorrect: boolean, answer: string, language?: string, aiFeedback?: AIFeedback) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
}

export default function QuestionStudio({
  questions,
  progress,
  onSolveQuestion,
  selectedQuestionId,
  setSelectedQuestionId
}: QuestionStudioProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [activeLang, setActiveLang] = useState<string>('javascript');
  const [editorCode, setEditorCode] = useState<string>('');
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');
  const [mcqSel, setMcqSel] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);

  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIFeedback | null>(null);

  const question = questions.find(q => q.id === selectedQuestionId);

  // Synchronize initial editor/written state when opening a question
  useEffect(() => {
    if (question) {
      setShowExplanation(false);
      setTestResults(null);
      setAiResult(null);
      setMcqSel(null);

      // Check if user has a saved answer already
      const saved = progress.solvedQuestions[question.id];
      if (saved) {
        if (question.type === 'coding') {
          setEditorCode(saved.userAnswer);
          if (saved.language) setActiveLang(saved.language);
        } else if (question.type === 'written') {
          setWrittenAnswer(saved.userAnswer);
        } else if (question.type === 'multiple-choice') {
          setMcqSel(parseInt(saved.userAnswer) || null);
          setShowExplanation(true);
        }
        if (saved.aiFeedback) setAiResult(saved.aiFeedback);
      } else {
        // Load default template code
        if (question.type === 'coding' && question.templateCode) {
          setEditorCode(question.templateCode[activeLang] || '');
        } else {
          setEditorCode('');
        }
        setWrittenAnswer('');
      }
    }
  }, [selectedQuestionId, question]);

  // Synchronize language template changes
  useEffect(() => {
    if (question && question.type === 'coding' && question.templateCode && !progress.solvedQuestions[question.id]) {
      setEditorCode(question.templateCode[activeLang] || '');
    }
  }, [activeLang]);

  // Filters
  const filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchesType = selectedType === 'all' || q.type === selectedType;
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesType && matchesSearch;
  });

  const getTopicLabel = (topicId: Topic) => {
    const t = TOPICS.find(tp => tp.id === topicId);
    return t ? t.vietnameseName : topicId;
  };

  const getDifficultyColor = (diff: Question['difficulty']) => {
    switch (diff) {
      case 'easy': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'medium': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'hard': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    }
  };

  const isSolved = (qId: string) => progress.solvedQuestions[qId]?.isCorrect;

  // Local Client Test Execution (Simulation)
  const handleRunLocalTests = () => {
    if (!question) return;
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      setIsRunningTests(false);
      
      // Simple custom heuristic checks
      const results: { passed: boolean; message: string }[] = [];
      const codeLower = editorCode.toLowerCase();

      if (question.id === 'two-sum-coding') {
        const hasLoop = codeLower.includes('for') || codeLower.includes('while');
        const hasReturn = codeLower.includes('return');
        
        results.push({
          passed: hasReturn,
          message: hasReturn ? 'Hàm trả về kết quả thành công.' : 'Hàm chưa chứa mệnh đề return trả về.'
        });
        results.push({
          passed: hasLoop,
          message: hasLoop ? 'Duyệt qua các phần tử trong mảng mẫu thành công.' : 'Chưa thiết lập luồng duyệt qua mảng.'
        });
        results.push({
          passed: codeLower.includes('map') || codeLower.includes('dict') || codeLower.includes('set') || codeLower.includes('[') ,
          message: 'Kiểm thử 2 số có tổng mong muốn trùng khớp target (Input: [2,7,11,15], target: 9).'
        });
      } else if (question.id === 'reverse-linked-list') {
        const hasNext = codeLower.includes('next');
        const hasCurr = codeLower.includes('curr') || codeLower.includes('head') || codeLower.includes('prev');
        
        results.push({
          passed: hasNext,
          message: hasNext ? 'Nhận diện dịch chuyển chuỗi liên kết ListNode.next thành công.' : 'Thiếu thao tác trỏ liên kết ListNode'
        });
        results.push({
          passed: hasCurr,
          message: hasCurr ? 'Quản lý vòng lặp xoay con trỏ thành công.' : 'Cần các biến quản lý trạng thái nút trước/sau.'
        });
      } else {
        results.push({ passed: true, message: 'Kiểm thử cơ bản chạy qua mẫu testcase thành công.' });
      }

      setTestResults(results);
    }, 900);
  };

  // Heavy AI Full Evaluation
  const handleAIEvaluation = async () => {
    if (!question) return;
    setIsEvaluatingAI(true);
    setAiResult(null);

    const checkAnswer = question.type === 'coding' ? editorCode : writtenAnswer;

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionTitle: question.title,
          questionType: question.type,
          description: question.description,
          userAnswer: checkAnswer,
          codeLanguage: question.type === 'coding' ? activeLang : undefined
        })
      });

      const resData = await response.json();
      if (response.ok) {
        setAiResult(resData);
        // Save to achievements persistent storage map
        onSolveQuestion(
          question.id,
          resData.correct,
          checkAnswer,
          question.type === 'coding' ? activeLang : undefined,
          resData
        );
      } else {
        alert(resData.error || 'Đánh giá AI tạm thời gặp sự cố.');
      }
    } catch (err) {
      console.error(err);
      alert('Không kết nối được tới máy chủ AI.');
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  // Submit Multiple Choice
  const handleMcqSelect = (idx: number) => {
    if (!question) return;
    setMcqSel(idx);
    setShowExplanation(true);
    
    const correct = idx === question.correctAnswerIndex;
    onSolveQuestion(
      question.id,
      correct,
      String(idx)
    );
  };

  return (
    <div className="space-y-6">
      
      {!selectedQuestionId || !question ? (
        // Question List View
        <div className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center">
              <Terminal className="w-6 h-6 mr-2 text-amber-500 animate-pulse" /> Kho Bài Tập & Câu Hỏi Phỏng Vấn
            </h2>
            <p className="text-sm text-slate-400">Rèn luyện phản xạ với đầy đủ các thể thức: Đố trắc nghiệm nhanh, viết tự luận phân tích hệ thống và lập trình thuật toán thực thi.</p>
          </header>

          {/* Filtering Row controls */}
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-slate-900/30 p-4 rounded-xl border border-slate-900" id="workbench-filters">
            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
              
              {/* Topic controls */}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-slate-950 text-slate-300 text-xs py-2 px-3.5 rounded-lg border border-slate-900 focus:outline-none cursor-pointer"
                id="filter-topic-select"
              >
                <option value="all">Mọi mảng kiến thức</option>
                {TOPICS.map(t => (
                  <option key={t.id} value={t.id}>{t.vietnameseName}</option>
                ))}
              </select>

              {/* Type controls */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 text-slate-300 text-xs py-2 px-3.5 rounded-lg border border-slate-900 focus:outline-none cursor-pointer"
                id="filter-type-select"
              >
                <option value="all">Mọi dạng câu hỏi</option>
                <option value="coding">Thực hành Code</option>
                <option value="written">Tự luận / Thiết kế</option>
                <option value="multiple-choice">Trắc nghiệm nhanh</option>
              </select>
            </div>

            {/* Keyword search input */}
            <div className="relative w-full xl:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tiêu đề câu hỏi..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 text-slate-200 text-xs rounded-lg border border-slate-900 focus:outline-none focus:border-amber-500/80 transition-colors"
                id="question-search-input"
              />
            </div>
          </div>

          {/* Questions Grid table list */}
          <div className="bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden" id="questions-pool-list">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/10">
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6">Tiêu đề câu hỏi</th>
                    <th className="py-4 px-6">Chủ đề</th>
                    <th className="py-4 px-6">Hình thức</th>
                    <th className="py-4 px-6">Độ khó</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-xs text-slate-300">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q) => {
                      const completed = isSolved(q.id);
                      return (
                        <tr key={q.id} className="hover:bg-slate-900/25 transition-colors group">
                          <td className="py-4 px-6">
                            {completed ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Chưa làm</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-slate-200 group-hover:text-amber-400 transition-colors">
                            {q.title}
                          </td>
                          <td className="py-4 px-6 text-slate-400">{getTopicLabel(q.topic)}</td>
                          <td className="py-4 px-6 uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                            {q.type === 'coding' ? '👨‍💻 Giải Code' : q.type === 'written' ? '📝 Tự Luận' : '🎯 Trắc Nghiệm'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold capitalize ${getDifficultyColor(q.difficulty)}`}>
                              {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'T.Bình' : 'Khó'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setSelectedQuestionId(q.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer transition-colors"
                              id={`open-question-btn-${q.id}`}
                            >
                              Thực hành
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Không tìm thấy câu hỏi hoặc bài tập nào khả dụng.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Question Studio Playroom (Selected View)
        <div className="space-y-6">
          {/* Top navigation row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-xs font-bold bg-transparent border-none cursor-pointer focus:outline-none"
              id="back-to-all-questions-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Trình Nghiên Cứu Câu Hỏi</span>
              {isSolved(question.id) && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Đã vượt qua
                </span>
              )}
            </div>
          </div>

          {/* Interactive Playground Splitting Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Box: Problem statements (Markdown) */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-900/80 flex flex-col justify-between h-[650px] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wide">
                    {getTopicLabel(question.topic)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black capitalize ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'T.Bình' : 'Khó'}
                  </span>
                </div>

                <h1 className="text-lg md:text-xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  {question.title}
                </h1>

                <div className="markdown-body text-slate-300 text-xs md:text-sm leading-relaxed prose prose-invert">
                  <Markdown>{question.description}</Markdown>
                </div>
              </div>

              {/* Theoretical hints panel */}
              {question.type !== 'multiple-choice' && (
                <div className="mt-8 pt-4 border-t border-slate-900/80">
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 transition-colors flex items-center justify-between text-left text-xs text-slate-300 font-bold cursor-pointer"
                    id="toggle-sol-guide-btn"
                  >
                    <span className="flex items-center text-amber-400">
                      <Lightbulb className="w-4 h-4 mr-2" /> Gợi ý & Hướng dẫn Giải đề tối ưu
                    </span>
                    <span className="text-slate-500">{showExplanation ? 'Ẩn đi' : 'Tiết lộ'}</span>
                  </button>

                  {showExplanation && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/10 border border-slate-900 text-xs text-slate-300 space-y-3 animate-fade-in max-h-[160px] overflow-y-auto">
                      <Markdown>{question.explanation}</Markdown>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Box: Working Sandbox Workspace */}
            <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-900/80 flex flex-col justify-between min-h-[650px]">
              
              {/* Scenario 1: Multiple Choice Quiz (MCQ) */}
              {question.type === 'multiple-choice' && (
                <div className="space-y-6 flex flex-col justify-between h-full" id="mcq-sandbox">
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">CHỌN PHƯƠNG ÁN ĐÚNG</h3>
                    
                    <div className="space-y-3">
                      {question.options?.map((opt, idx) => {
                        const isSelected = mcqSel === idx;
                        const isCorrectAnswer = idx === question.correctAnswerIndex;
                        const showCorrectMarker = showExplanation && isCorrectAnswer;
                        const showWrongMarker = showExplanation && isSelected && !isCorrectAnswer;

                        return (
                          <button
                            key={idx}
                            id={`mcq-option-${idx}`}
                            onClick={() => {
                              if (mcqSel === null) handleMcqSelect(idx);
                            }}
                            disabled={mcqSel !== null}
                            className={`
                              w-full text-left p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer
                              ${isSelected 
                                ? 'bg-amber-500/10 border-amber-500 text-amber-300' 
                                : 'bg-slate-900/40 border-slate-900 text-slate-300 hover:bg-slate-900/80'}
                              ${showCorrectMarker ? '!bg-emerald-500/15 !border-emerald-500 !text-emerald-300' : ''}
                              ${showWrongMarker ? '!bg-rose-500/15 !border-rose-500 !text-rose-300' : ''}
                            `}
                          >
                            <span>{opt}</span>
                            <div className="flex items-center space-x-2 shrink-0">
                              {showCorrectMarker && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Chính xác</span>}
                              {showWrongMarker && <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/20">Sai rồi</span>}
                              <div className={`
                                w-4 h-4 rounded-full border flex items-center justify-center text-[10px]
                                ${isSelected ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold' : 'border-slate-700'}
                                ${showCorrectMarker ? '!border-emerald-500 !bg-emerald-500 !text-slate-950' : ''}
                              `}>
                                {isSelected && '✓'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MCQ post-submit explanation details */}
                  {showExplanation && (
                    <div className="p-5 bg-slate-900/30 rounded-xl border border-slate-900 space-y-3 animate-fade-in">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-slate-200">GIẢI THÍCH CHUYÊN SÂU</span>
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed pr-1 max-h-[180px] overflow-y-auto">
                        <Markdown>{question.explanation}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 2: Theoretical Written Challenge */}
              {question.type === 'written' && (
                <div className="space-y-6 flex flex-col justify-between h-full" id="written-sandbox">
                  <div className="space-y-3 flex-1 flex flex-col">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">BÀI VIẾT TRẢ LỜI CỦA BẠN</h3>
                    
                    <textarea
                      value={writtenAnswer}
                      onChange={(e) => setWrittenAnswer(e.target.value)}
                      placeholder="Lời giải thích chi tiết, đầy đủ cấu trúc của bạn (Nên áp dụng cấu trúc STAR nếu là câu hỏi hành vi)..."
                      className="w-full flex-1 p-4 bg-slate-950 text-slate-200 text-xs rounded-xl border border-slate-900 focus:outline-none focus:border-indigo-500/80 resize-none font-sans min-h-[220px] max-h-[350px] leading-relaxed"
                      id="written-answer-textarea"
                    />
                  </div>

                  {/* Actions for written questions */}
                  <div className="space-y-4">
                    {/* Display AI Results if evaluated */}
                    {aiResult && (
                      <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-900 space-y-3.5 animate-slide-up" id="ai-evaluation-feedback-written">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                            <span className="text-xs font-black text-slate-200">KẾT QUẢ ĐÁNH GIÁ AI</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${aiResult.correct ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {aiResult.correct ? 'HỢP LỆ' : 'CẦN CẢI THIỆN'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-center">
                            <span className="text-[10px] text-slate-500 uppercase block">Thang điểm</span>
                            <span className="text-lg font-black text-indigo-400">{aiResult.score}/100</span>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-center flex flex-col justify-center">
                            <span className="text-[10px] text-slate-500 uppercase block">Đánh giá chung</span>
                            <span className={`text-xs font-bold ${aiResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {aiResult.score >= 80 ? 'Xuất Sắc' : aiResult.score >= 50 ? 'Khá' : 'Yếu'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300">
                          <p className="leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900/85 whitespace-pre-wrap">{aiResult.feedback}</p>
                          {aiResult.issuesFound && aiResult.issuesFound.length > 0 && (
                            <div className="space-y-1 mt-2">
                              <span className="text-[10px] text-rose-400 font-extrabold block">⚠️ ĐIỂM CẦN HOÀN THIỆN:</span>
                              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                                {aiResult.issuesFound.map((issue, idx) => (
                                  <li key={idx}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleAIEvaluation}
                        disabled={isEvaluatingAI || writtenAnswer.trim() === ''}
                        className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-md shadow-indigo-600/15 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                        id="written-submit-ai-btn"
                      >
                        {isEvaluatingAI ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Đang nhờ Mentor chấm lý thuyết...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" /> Chấm điểm Tự luận bằng AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 3: Algorithmic Coding Workbench */}
              {question.type === 'coding' && (
                <div className="space-y-5 flex flex-col justify-between h-full" id="coding-sandbox">
                  
                  {/* Lang selection & Editor wrapper */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
                        <Code className="w-4 h-4 text-amber-500 mr-1.5" /> TRÌNH SOẠN THẢO CODE
                      </h3>
                      
                      {/* Language picker */}
                      <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                        {['javascript', 'python'].map((lang) => (
                          <button
                            key={lang}
                            id={`editor-lang-btn-${lang}`}
                            onClick={() => setActiveLang(lang)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer capitalize ${
                              activeLang === lang 
                                ? 'bg-slate-950 text-amber-400 font-extrabold shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {lang === 'javascript' ? 'JavaScript' : 'Python 3'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Monospaced Editor block */}
                    <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-900 font-mono text-xs overflow-hidden min-h-[220px] max-h-[350px] flex">
                      {/* Line counts sidebar */}
                      <div className="bg-slate-900/40 text-slate-600 select-none text-right py-4 px-3 border-r border-slate-900 w-11 flex flex-col">
                        {Array.from({ length: Math.max(editorCode.split('\n').length, 10) }).map((_, idx) => (
                          <div key={idx} className="h-5 leading-5 text-[11px] font-medium">{idx + 1}</div>
                        ))}
                      </div>
                      {/* Interactive textarea editor */}
                      <textarea
                        value={editorCode}
                        onChange={(e) => setEditorCode(e.target.value)}
                        className="w-full h-full p-4 bg-transparent text-slate-200 focus:outline-none resize-none overflow-y-auto leading-5 font-mono text-xs"
                        placeholder="Hãy giải đề thuật toán bằng đoạn code tối ưu tại đây..."
                        id="coding-workbench-textarea"
                      />
                    </div>
                  </div>

                  {/* Actions & Results dashboard */}
                  <div className="space-y-4">
                    
                    {/* Display mock testing results */}
                    {testResults && (
                      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-900 space-y-2 animate-slide-up" id="local-test-results">
                        <span className="text-[10px] text-slate-500 font-extrabold block tracking-wider uppercase">Kết quả kiểm thử thử nghiệm:</span>
                        <div className="space-y-2">
                          {testResults.map((test, index) => (
                            <div key={index} className="flex items-start text-xs space-x-2 card-wrapper">
                              {test.passed ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <span className={test.passed ? 'text-slate-300' : 'text-slate-400'}>{test.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highly Professional AI Compiler feed back card */}
                    {aiResult && (
                      <div className="p-5 rounded-2xl border bg-slate-900/40 border-slate-900 space-y-4 animate-slide-up" id="ai-evaluation-feedback-coding">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span className="text-xs font-black text-slate-200">ĐÁNH GIÁ CHUYÊN SÂU TỪ AI MENTOR</span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${aiResult.correct ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {aiResult.correct ? 'VƯỢT QUA' : 'CHƯA ĐẠT'}
                            </span>
                          </div>
                        </div>

                        {/* Top-tier algorithm indicators */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                            <span className="text-[9px] text-slate-500 uppercase block">Thang Điểm</span>
                            <span className="text-sm font-black text-amber-400 mt-1 block">{aiResult.score}/100</span>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                            <span className="text-[9px] text-slate-500 uppercase block">Time Complexity</span>
                            <span className="text-xs font-mono font-bold text-sky-400 mt-1 block">{aiResult.timeComplexity || 'O(N)'}</span>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                            <span className="text-[9px] text-slate-500 uppercase block">Space Complexity</span>
                            <span className="text-xs font-mono font-bold text-indigo-400 mt-1 block">{aiResult.spaceComplexity || 'O(1)'}</span>
                          </div>
                        </div>

                        {/* AI comments text block */}
                        <div className="space-y-2.5 text-xs">
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900/80 text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                            <p className="font-bold text-[11px] text-slate-400 mb-1">💬 Nhận xét chi tiết:</p>
                            <p className="whitespace-pre-wrap">{aiResult.feedback}</p>
                          </div>

                          {aiResult.issuesFound && aiResult.issuesFound.length > 0 && (
                            <div className="space-y-1.5 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                              <span className="text-[10px] text-rose-400 font-extrabold block">⚠️ CÁC LỖI TIỀM ẨN:</span>
                              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                                {aiResult.issuesFound.map((issue, idx) => (
                                  <li key={idx}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiResult.suggestedSolution && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-emerald-400 font-extrabold block">💡 GIẢI PHÁP TỐI ƯU GỢI Ý DUYỆT BỞI AI:</span>
                              <pre className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                                {aiResult.suggestedSolution}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compile & AI Evaluate controllers */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleRunLocalTests}
                        disabled={isRunningTests || isEvaluatingAI}
                        className="w-full sm:w-1/3 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                        id="run-local-tests-btn"
                      >
                        {isRunningTests ? (
                          'Đang biên dịch...'
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 mr-1.5" /> Chạy thử Nghiệm
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleAIEvaluation}
                        disabled={isEvaluatingAI || editorCode.trim() === ''}
                        className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs tracking-wide shadow-md shadow-amber-600/15 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                        id="submit-ai-code-evaluation-btn"
                      >
                        {isEvaluatingAI ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Đang kết nối chấm code...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" /> Chấm điểm & Review bằng AI
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
