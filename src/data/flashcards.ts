import { SRSCard } from '../types';

export const INITIAL_FLASHCARDS: SRSCard[] = [
  {
    id: 'srs-recursion-space',
    title: 'Độ phức tạp không gian (Space Complexity) của Hàm Đệ quy',
    front: 'Độ phức tạp không gian (Space Complexity) của một hàm đệ quy sâu N mức không dùng cấu trúc dữ liệu phụ trợ là bao nhiêu? Tại sao?',
    back: 'Đáp án: O(N)\n\nGiải thích: Mỗi lần gọi đệ quy, trình biên dịch/phiên dịch phải thêm một "Stack Frame" chứa các tham số, biến cục bộ và địa chỉ trả về vào Call Stack (bộ nhớ ngăn xếp). Độ sâu tối đa của cây đệ quy là N sẽ tương ứng với tối đa N stack frames đồng thời trong bộ nhớ Call Stack, do đó tiêu tốn O(N) không gian bộ nhớ.',
    hint: 'Hãy nghĩ về stack frame trong bộ nhớ.',
    topic: 'dsa',
    difficulty: 'easy',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'srs-index-b-tree',
    title: 'B-Tree Index vs Hash Index trong Database',
    front: 'Mô tả sự khác biệt chính giữa B-Tree Index và Hash Index trong cơ sở dữ liệu. Khi nào nên dùng loại nào?',
    back: 'B-Tree Index:\n- Cấu trúc cây tự cân bằng. Hỗ trợ tìm kiếm chính xác (=), tìm kiếm khoảng (BETWEEN, >, <), và sắp xếp (ORDER BY).\n- Nên dùng mặc định cho hầu hết trường hợp.\n\nHash Index:\n- Dựa trên bảng băm (Key-Value map). Chỉ hỗ trợ so sánh tuyệt đối (= hoặc IN), KHÔNG hỗ trợ tìm kiếm theo khoảng hay sắp xếp độ cao thấp.\n- Độ phức tạp tìm kiếm trung bình O(1) so với O(log N) của B-Tree.\n- Nên dùng khi chỉ cần tra cứu chính xác tuyệt đối các mã định danh.',
    hint: 'Hãy chú ý đến so sánh khoảng (range queries) và sắp xếp.',
    topic: 'system-design',
    difficulty: 'medium',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'srs-react-virtual-dom',
    title: 'Virtual DOM của React hoạt động thế nào?',
    front: 'React Virtual DOM hoạt động ra sao để tăng hiệu năng cập nhật UI? Trình bày 3 bước chính.',
    back: 'Virtual DOM hoạt động dựa trên thuật toán so khớp (Reconciliation) gồm 3 bước chuyên nghiệp:\n1. Tạo mới: Khi state hoặc props thay đổi, React sẽ render toàn bộ các component và tạo ra một cây Virtual DOM (đối tượng JS nhẹ) đại diện mới.\n2. Diffing (So sánh): React đem so sánh cây Virtual DOM mới này với cây Virtual DOM cũ (đại diện cho UI hiện tại) dưới dạng thuật toán O(N).\n3. Reconciliation / Patching (Đồng bộ): Tìm ra chính xác các nút/thuộc tính khác biệt, React gom cụm cập nhật và viết trực tiếp xuống Real DOM một lượt duy nhất (batching), tránh việc vẽ lại giao diện liên tục.',
    hint: 'Khởi tạo mới -> So sánh (Diffing) -> Đồng bộ hóa.',
    topic: 'frontend',
    difficulty: 'easy',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'srs-http-status-codes',
    title: 'Mã trạng thái HTTP 401 Unauthorized vs 403 Forbidden',
    front: 'Bản chất sự khác nhau giữa HTTP Status Code 401 và 403 là gì?',
    back: '401 Unauthorized:\n- Người dùng chưa được xác thực danh tính (Authentication). Trình duyệt hoặc ứng dụng chưa có Token/Cookie hoặc sai thông tin đăng nhập.\n- Client cần thực hiện đăng nhập để truy cập.\n\n403 Forbidden:\n- Người dùng ĐÃ xác thực danh tính thành công, nhưng KHÔNG CÓ QUYỀN (Authorization) để truy cập tài nguyên bị yêu cầu (ví dụ: User thường đòi xem trang Admin).\n- Đăng nhập lại không thể giải quyết vấn đề, cần được admin cấp thêm quyền.',
    hint: 'Xác thực (Authentication) vs Phân quyền (Authorization).',
    topic: 'language-basics',
    difficulty: 'easy',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'srs-star-behavioral',
    title: 'Ý nghĩa của các chữ cái trong công thức STAR',
    front: 'STAR là gì trong phỏng vấn hành vi (Behavioral Interview)? Viết tắt của những từ nào và ý nghĩa tóm lược.',
    back: 'STAR là công thức chuẩn mực để cấu trúc câu trả lời phỏng vấn hành vi chuyên nghiệp:\n- S (Situation - Bối cảnh): Mô tả vấn đề, tính chất nghiêm trọng của tình huống bạn đối mặt.\n- T (Task - Nhiệm vụ): Chỉ rõ nhiệm vụ, mục tiêu chính thức bạn cần đạt được.\n- A (Action - Hành động): Giải thích cặn kẽ bạn đã thực hiện các hành động cụ thể nào để giải quyết vấn đề dưới góc nhìn chủ động.\n- R (Result - Kết quả): Đưa ra các con số thực đo, thành tích đạt được, bài học rút ra sau sự việc.',
    hint: 'Tập trung vào hoàn cảnh, nhiệm vụ, cách làm và thành tích.',
    topic: 'behavioral',
    difficulty: 'easy',
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString()
  }
];
