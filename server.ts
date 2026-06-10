import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI SDK:', err);
  }
} else {
  console.warn('GEMINI_API_KEY variable is missing in environment. Running with simulated fallback feedback.');
}

// 1. API: Đánh giá Code hoặc Câu trả lời từ người dùng
app.post('/api/evaluate', async (req, res) => {
  const { questionId, questionTitle, questionType, description, userAnswer, codeLanguage } = req.body;

  if (!userAnswer || userAnswer.trim() === '') {
    return res.status(400).json({ error: 'Nội dung câu trả lời không được rỗng!' });
  }

  // Fallback if no Gemini Client
  if (!ai) {
    return res.json({
      correct: true,
      score: 85,
      timeComplexity: questionType === 'coding' ? 'O(N)' : undefined,
      spaceComplexity: questionType === 'coding' ? 'O(N)' : undefined,
      feedback: '⚠️ [CHẾ ĐỘ MÔ PHỎNG - CHƯA CONFIG API KEY]\nBài làm của bạn có cấu trúc và ý đồ thuật toán tốt. Để bật đánh giá chấm điểm tự động thông minh từ AI thực, xin hãy cấu hình "GEMINI_API_KEY" trong phần Secrets tủ cài đặt của AI Studio.',
      issuesFound: ['Chưa thiết lập khóa API Gemini thực tế trên hệ thống.'],
      suggestedSolution: '// Code mẫu tham khảo:\n' + (codeLanguage === 'javascript' ? 'function sol() { return true; }' : 'def sol(): return True')
    });
  }

  try {
    let systemInstruction = 'Bạn là một chuyên gia phỏng vấn lập trình cấp cao tại Google và Meta, chuyên chấm điểm bài thi của các ứng viên. Bạn phải chấm bài thật kỹ, chi tiết, khách quan và đưa ra nhận xét bằng tiếng Việt. Hãy xuất kết quả bằng định dạng JSON thuần túy có chứa cấu trúc khớp với yêu cầu.';
    let prompt = '';

    if (questionType === 'coding') {
      prompt = `Câu hỏi lập trình: "${questionTitle}"
Đề bài chi tiết: ${description}
Ngôn ngữ sử dụng: ${codeLanguage}
Bài giải của ứng viên:
\`\`\`${codeLanguage}
${userAnswer}
\`\`\`

Yêu cầu chấm điểm:
1. Đánh giá tính chính xác logic của ứng viên dựa trên đề bài.
2. Xác định độ phức tạp Thời gian (Time Complexity e.g. O(1), O(N), O(N log N)) và Không gian (Space Complexity e.g. O(1), O(N)) rõ ràng.
3. Chấm thang điểm từ 0 tới 100.
4. Đưa ra các lỗi biên hoặc lỗi tiềm ẩn nếu có (Issues Found).
5. Đưa ra gợi ý code tối ưu hóa hoặc giải pháp đúng đắn hoàn chỉnh nhất.
Hãy phản hồi dưới dạng đối tượng JSON thuần túy, tuyệt đối không bọc ngoài bằng chữ hay giải thích gì khác ngoài khối JSON. JSON có các thuộc tính:
- "correct": boolean
- "score": number (0-100)
- "timeComplexity": string (e.g., "O(N)")
- "spaceComplexity": string (e.g., "O(1)")
- "feedback": string (Nhận xét chuyên môn tiếng Việt)
- "issuesFound": danh sách chuỗi các lỗi hay điểm cần sửa
- "suggestedSolution": code hoàn chỉnh tối ưu bằng ngôn ngữ đã chọn`;
    } else {
      prompt = `Câu hỏi lý thuyết/hành vi: "${questionTitle}"
Đề bài hoặc tình huống: ${description}
Bài viết trả lời của ứng viên:
"${userAnswer}"

Yêu cầu chấm điểm:
1. Đọc kỹ câu trả lời xem đã đầy đủ ý, chính xác học thuật hay đúng chuỗi STAR chưa.
2. Chấm thang điểm 0 tới 100.
3. Chỉ ra lỗi kiến thức sai lệch hoặc điểm thiếu sót (Issues Found).
4. Phản hồi dưới dạng JSON thuần có các thuộc tính:
- "correct": boolean
- "score": number (0-100)
- "feedback": string (Nhận xét chi tiết gợi ý bổ sung đầy đủ, cấu trúc STAR bằng tiếng Việt)
- "issuesFound": mảng các điểm yếu cần khắc phục`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correct: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER },
            timeComplexity: { type: Type.STRING },
            spaceComplexity: { type: Type.STRING },
            feedback: { type: Type.STRING },
            issuesFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedSolution: { type: Type.STRING }
          },
          required: ['correct', 'score', 'feedback']
        }
      }
    });

    const textOutput = response.text || '{}';
    const feedbackData = JSON.parse(textOutput.trim());
    return res.json(feedbackData);

  } catch (error: any) {
    console.error('Gemini Evaluation Error:', error);
    return res.status(500).json({
      error: 'Rất tiếc, AI Evaluator gặp sự cố khi xử lý bài nộp.',
      details: error?.message || String(error)
    });
  }
});

// 2. API: Trò chuyện trợ lý AI Mentor Phỏng vấn
app.post('/api/ai-chat', async (req, res) => {
  const { messages, currentContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Tin nhắn không hợp lệ!' });
  }

  // Fallback if no Gemini Client
  if (!ai) {
    return res.json({
      text: '🤖 [CHẾ ĐỘ MÔ PHỎNG]\nChào bạn! Tôi rất vui được giúp bạn ôn luyện phỏng vấn. Để trò chuyện với tôi theo thời gian thực sử dụng trí tuệ AI thông minh từ Google Gemini, xin hãy cài đặt mã "GEMINI_API_KEY" trong tab Secrets của ứng dụng tại AI Studio.'
    });
  }

  try {
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Thêm mục tiêu hướng dẫn làm system instruction
    const systemInstruction = `Bạn là "Intervify AI Coach" - một cố vấn ôn thi phỏng vấn phần mềm chuyên nghiệp. 
Nhiệm vụ của bạn là:
1. Giải đáp các thắc mắc về lập trình, giải thuật (DSA), thiết kế hệ thống (System Design), và câu hỏi hành vi (STAR).
2. Viết câu hỏi trắc nghiệm hoặc bài code nhỏ thử thách người dùng khi họ yêu cầu luyện tập.
3. Giải thích tường tận, kiên nhẫn, kèm theo ví dụ sinh động bằng tiếng Việt giàu tính chuyên môn.
Hướng dẫn bổ sung: ${currentContext ? `Người dùng hiện đang học bài: "${currentContext}"` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return res.json({ text: response.text });

  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: 'Lỗi hệ thống khi kết nối với máy chủ AI.',
      details: error?.message || String(error)
    });
  }
});

// 3. Khởi tạo Front End & Middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Using Vite Dev Middleware in Development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving Built Static assets in Production.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server PrepInterview running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
