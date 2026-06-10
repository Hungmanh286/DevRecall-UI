export type Topic = 'dsa' | 'system-design' | 'behavioral' | 'frontend' | 'language-basics';

export interface TopicMeta {
  id: Topic;
  name: string;
  vietnameseName: string;
  icon: string;
  color: string;
  description: string;
}

export interface SRSCard {
  id: string;
  title: string;
  front: string;
  back: string;
  hint?: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  // SuperMemo-2 Spaced Repetition parameters
  repetitions: number;         // Số lần lặp lại thành công liên tiếp
  interval: number;            // Khoảng cách ngày lặp lại kế tiếp
  easeFactor: number;          // Hệ số dễ nhớ (mặc định 2.5)
  nextReviewDate: string;      // Ngày ôn tập tiếp theo (ISO string)
  lastReviewedDate?: string;   // Ngày ôn tập gần nhất (ISO string)
}

export interface Lesson {
  id: string;
  title: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  summary: string;
  content: string; // Nội dung bài học (Markdown)
  duration: string; // Thời gian đọc ước tính, ví dụ: "10 mins"
}

export interface Question {
  id: string;
  title: string;
  type: 'multiple-choice' | 'written' | 'coding';
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string; // Đề bài hoặc câu hỏi (Markdown)
  options?: string[]; // Cho câu hỏi trắc nghiệm
  correctAnswerIndex?: number; // Index câu trả lời đúng (trắc nghiệm)
  explanation: string; // Giải thích chi tiết cho câu trả lời chuẩn chỉnh
  templateCode?: { [language: string]: string }; // Code mẫu ban đầu theo ngôn ngữ
  testCases?: { input: string; output: string; description?: string }[]; // Test cases mẫu
}

export interface UserProgress {
  completedLessons: string[]; // Danh sách IDs bài học hoàn thành
  solvedQuestions: {
    [questionId: string]: {
      isCorrect: boolean;
      userAnswer: string;
      language?: string;
      solvedAt: string;
      aiFeedback?: AIFeedback;
    };
  };
  srsCards: {
    [cardId: string]: {
      repetitions: number;
      interval: number;
      easeFactor: number;
      nextReviewDate: string;
    };
  };
  streak: number;
  lastActiveDate?: string; // Định dạng YYYY-MM-DD
}

export interface AIFeedback {
  correct: boolean;
  score: number; // Thang điểm 0 - 100
  timeComplexity?: string; // Đánh giá độ phức tạp thời gian (e.g. O(N))
  spaceComplexity?: string; // Đánh giá độ phức tạp không gian (e.g. O(1))
  feedback: string; // Nhận xét bằng tiếng Việt về logic, lỗi, cải tiến
  issuesFound?: string[]; // Các điểm cần sửa hoặc lỗi biên
  suggestedSolution?: string; // Code được tối ưu hóa hoặc đoạn phân tích hoàn chỉnh
}
