import { TopicMeta } from '../types';

export const TOPICS: TopicMeta[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    vietnameseName: 'Cấu trúc Dữ liệu & Giải thuật',
    icon: 'Binary',
    color: 'emerald',
    description: 'Bao gồm Array, Linked List, Recursion, Trees, Binary Search, và Quy hoạch động.'
  },
  {
    id: 'system-design',
    name: 'System Design',
    vietnameseName: 'Thiết kế Hệ thống',
    icon: 'Server',
    color: 'blue',
    description: 'Học về Load Balancers, Caching, Databases, Scaling, và kiến trúc Microservices.'
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    vietnameseName: 'Công nghệ Frontend',
    icon: 'Layout',
    color: 'indigo',
    description: 'Kiến thức cốt lõi về DOM, Event Loop, React Internals, Performance và CSS/Vite.'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interviews',
    vietnameseName: 'Phỏng vấn Hành vi',
    icon: 'Users',
    color: 'purple',
    description: 'Cách trả lời câu hỏi tình huống bằng phương pháp STAR (Situation, Task, Action, Result).'
  },
  {
    id: 'language-basics',
    name: 'Language Basics',
    vietnameseName: 'Cơ bản về Ngôn ngữ',
    icon: 'FileCode',
    color: 'amber',
    description: 'Tìm hiểu sâu về cơ chế Pointer, Concurrency, Memory Management của JS, Python, Go, C++.'
  }
];
