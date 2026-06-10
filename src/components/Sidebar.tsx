import React from 'react';
import { 
  Home, 
  BookOpen, 
  Layers, 
  Terminal, 
  Sparkles, 
  Flame, 
  Award, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  totalSolved: number;
  totalCardsReviewed: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  streak,
  totalSolved,
  totalCardsReviewed 
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { id: 'lessons', name: 'Giáo Trình', icon: BookOpen, color: 'text-indigo-500' },
    { id: 'flashcards', name: 'Thẻ Ghi Nhớ (SRS)', icon: Layers, color: 'text-emerald-500' },
    { id: 'questions', name: 'Kho Câu Hỏi', icon: Terminal, color: 'text-amber-500' },
    { id: 'coach', name: 'Trợ Lý Phỏng Vấn', icon: Sparkles, color: 'text-purple-500' },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">PrepInterview</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-900/80 flex flex-col justify-between 
        transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          {/* Brand header */}
          <div className="flex items-center space-x-3 mb-8 hidden md:flex">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-100 tracking-tight leading-none">PrepInterview</h1>
              <span className="text-xs text-slate-500 font-medium tracking-wide">STUDIO PRO v1.1</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200
                    ${isActive 
                      ? 'bg-slate-900 text-sky-400 shadow-inner' 
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}
                  `}
                >
                  <IconComp className={`w-5 h-5 mr-3.5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Stats Card / Profile Footer */}
        <div className="p-4 border-t border-slate-900/80 bg-slate-950/60">
          <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Học hằng ngày</span>
              </div>
              <span className="text-sm font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{streak} ngày</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900/60">
                <div className="flex justify-center mb-1">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-md font-bold text-slate-200">{totalSolved}</div>
                <div className="text-[10px] text-slate-500">Đã Giải</div>
              </div>
              <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900/60">
                <div className="flex justify-center mb-1">
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-md font-bold text-slate-200">{totalCardsReviewed}</div>
                <div className="text-[10px] text-slate-500">Thẻ Lặp</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center">
            <span className="text-[11px] text-slate-600 font-medium">Hệ thống Ôn luyện thông minh</span>
          </div>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
