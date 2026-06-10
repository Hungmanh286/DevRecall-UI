import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Brain, 
  Bot, 
  User, 
  HelpCircle, 
  Briefcase, 
  Compass, 
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  currentContext?: string;
}

export default function AIAssistant({ currentContext }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `🤖 **Chào bạn! Tôi là Intervify AI Mentor.** 
      
Tôi có thể đồng hành hỗ trợ bạn học tập suốt 24/7:
- Thử sức phỏng vấn thử (Mock Interview).
- Phân tích độ phức tạp thời gian/không gian của các đoạn mã.
- Giải thích sâu các mô hình hệ thống lớn (System Design).
- Tư vấn cách xây dựng trả lời phỏng vấn hành vi (STAR).

Bạn muốn thử thách mảng kiến thức nào hôm nay?`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'Phỏng vấn thử một câu DSA', icon: Brain },
    { text: 'Giải thích thuật toán Dijkstra tối ưu', icon: Lightbulb },
    { text: 'Cách viết CV lập trình viên gây ấn tượng', icon: Briefcase },
    { text: 'Mẹo vượt qua vòng System Design', icon: Compass }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text || text.trim() === '') return;
    
    const newMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    setUserInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentContext: currentContext
        })
      });

      const resData = await response.json();
      if (response.ok) {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: resData.text }
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: `❌ **Cố vấn gặp lỗi:** Không kết nối được tới máy chủ AI. ${resData.error || ''}` }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: '❌ **Sự cố mạng:** Không kết nối đến mốc AI Mentor được.' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch h-[650px] animate-fade-in" id="coach-workspace">
      
      {/* Left Chat Window 3-cols */}
      <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-900 flex flex-col justify-between h-full overflow-hidden relative">
        <header className="bg-slate-900/40 border-b border-slate-900/80 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 tracking-tight leading-none">Intervify AI Coach</h3>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wide flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-ping"></span> ĐANG TRỰC TUYẾN
              </span>
            </div>
          </div>
          {currentContext && (
            <span className="text-[10px] font-mono text-slate-500 max-w-xs truncate hidden sm:inline-block bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Ngữ cảnh: {currentContext}
            </span>
          )}
        </header>

        {/* Chat History scroll box */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-950/40" id="chat-messages-scroll-area">
          {messages.map((msg, idx) => {
            const isAI = msg.role === 'assistant';
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3.5 max-w-[85%] ${isAI ? 'self-start' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                  ${isAI 
                    ? 'bg-purple-900/10 border-purple-500/20 text-purple-400' 
                    : 'bg-slate-900 border-slate-850 text-slate-350'}
                `}>
                  {isAI ? <Bot className="w-4.5 h-4.5 text-indigo-400" /> : <User className="w-4.5 h-4.5 text-slate-400" />}
                </div>

                {/* Bubble Container */}
                <div className={`
                  p-4 rounded-2xl text-xs md:text-sm leading-relaxed prose prose-invert
                  ${isAI 
                    ? 'bg-slate-900/50 text-slate-300 border border-slate-900 rounded-tl-none' 
                    : 'bg-indigo-600/10 text-indigo-200 border border-indigo-500/20 rounded-tr-none'}
                `}>
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isAIResponsePending() && (
            <div className="flex items-start gap-3.5 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5 text-indigo-400 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 rounded-tl-none flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area footer */}
        <footer className="p-4 border-t border-slate-900/80 bg-slate-950/80 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(userInput);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Chia sẻ giải thuật, hỏi đáp CV, hoặc nhờ phỏng vấn thử mẫu..."
              className="w-full pl-4 pr-12 py-3 bg-slate-900 text-slate-200 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500/80 transition-all leading-5 focus:ring-1 focus:ring-purple-500/20"
              id="coach-chat-input"
            />
            <button
              type="submit"
              disabled={isSending || userInput.trim() === ''}
              className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
              id="coach-send-msg-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>

      {/* Right Guidelines Side pane 1-col */}
      <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-5 space-y-6 flex flex-col justify-between" id="coach-insights-sidebar">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest pl-1 border-l-2 border-purple-500">
            Khóa kích hoạt nhanh
          </h4>
          <p className="text-[11px] text-slate-500">Bấm nhanh các chủ đề hữu ích dưới đây để bắt đầu học tập cùng cố vấn:</p>
          
          <div className="space-y-2.5">
            {quickPrompts.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <button
                  key={idx}
                  id={`quick-prompt-${idx}`}
                  onClick={() => handleSendMessage(p.text)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/40 border border-slate-900 text-[11px] text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all flex items-center space-x-2.5 cursor-pointer"
                >
                  <IconComp className="w-4 h-4 mr-0.5 shrink-0" />
                  <span className="font-medium truncate">{p.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-900/20 rounded-xl border border-slate-900 text-left space-y-2 text-[10px] text-slate-500 line-height-1.3">
          <h5 className="font-extrabold text-slate-400">📝 Phương Pháp Luyện Tập:</h5>
          <ul className="list-disc pl-3.5 space-y-1">
            <li>Nhờ AI đưa một dòng code lỗi và cố gắng gỡ rối (Debug challenge).</li>
            <li>Đưa một câu trả lời STAR và nhờ AI phản biện, phân tích lỗ hổng bối cảnh.</li>
          </ul>
        </div>
      </div>

    </div>
  );

  function isAIResponsePending() {
    return isSending;
  }
}
