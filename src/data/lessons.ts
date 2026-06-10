import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'two-pointers-dsa',
    title: 'Kỹ thuật Con trỏ kép (Two Pointers Technique)',
    topic: 'dsa',
    difficulty: 'easy',
    summary: 'Giải quyết các bài toán mảng, chuỗi tối ưu từ O(N^2) xuống O(N) thông qua hai con chỉ số di chuyển ngược chiều hoặc cùng chiều.',
    duration: '12 phút',
    content: `## 1. Bản chất của Kỹ thuật Con trỏ kép

Kỹ thuật con trỏ kép là một phương pháp cực kỳ phổ biến trong giải toán cấu trúc dữ liệu và giải thuật (DSA). Thay vì sử dụng một con trỏ chạy lặp lồng nhau (\`O(N^2)\`), ta tối ưu bằng cách duy trì **hai con trỏ** di chuyển song song hoặc ngược hướng trên cấu trúc mảng hoặc danh sách liên kết.

Phương pháp này hiệu quả nhất với các mảng đã **được sắp xếp sẵn** hoặc cần tìm cặp phần tử thỏa mãn điều kiện nhất định.

---

## 2. Các dạng con trỏ kép thường gặp

### Dạng 1: Hai con trỏ di chuyển ngược chiều (Hai đầu hướng vào nhau)
*   **Vị trí xuất phát**: Một con trỏ xuất phát từ vị trí đầu mảng (\`left = 0\`), một con trỏ xuất phát từ cuối mảng (\`right = n - 1\`).
*   **Cách thức di chuyển**: Dựa vào tổng/tích hoặc điều kiện so sánh giữa hai phần tử tại \`left\` và \`right\`, ta di chuyển \`left\` sang phải (\`left++\`) hoặc \`right\` sang trái (\`right--\`).
*   **Ứng dụng**: Bài toán **Two SumII** (với mảng đã sắp xếp), đảo ngược chuỗi (Reverse String), tìm cặp có tổng gần nhất với đích.

### Dạng 2: Con trỏ nhanh và con trỏ chậm (Fast & Slow Pointers / Hare & Tortoise)
*   **Vị trí xuất phát**: Cả hain con trỏ thường bắt đầu từ đầu (\`index = 0\` hoặc \`head\` của LinkedList).
*   **Cách thức di chuyển**: Con trỏ nhanh (\`fast\`) nhảy nhiều bước hơn (ví dụ: 2 bước ở mỗi chu kỳ), trong khi con trỏ chậm (\`slow\`) chỉ nhảy 1 bước.
*   **Ứng dụng**: Tìm trung điểm ListNode, phát hiện chu kỳ trong danh sách liên kết (Floyd's Cycle Detection), tìm số hạnh phúc (Happy Number).

---

## 3. Ví dụ kinh điển: Two Sum II (Input mảng đã sorted)

**Yêu cầu**: Cho một mảng số nguyên đã sắp xếp theo thứ tự tăng dần, hãy tìm hai số sao cho tổng của chúng đúng bằng \`target\`.

### Cách 1: Duyệt lặp lồng (O(N^2))
Duyệt qua tất cả cặp số \`(i, j)\`, kiểm tra xem \`arr[i] + arr[j] == target\` không.
*   **Độ phức tạp**: Thời gian \`O(N^2)\`, không gian \`O(1)\`.

### Cách 2: Sử dụng Con Trỏ Kép (O(N))
Vì mảng đã sắp xếp, nếu tổng hiện tại bé hơn \`target\`, ta tăng giá trị bằng cách dịch con trỏ trái sang phải. Nếu tổng lớn hơn \`target\`, ta giảm tổng bằng cách dịch con trỏ phải sang trái.

\`\`\`typescript
function twoSumSorted(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            return [left + 1, right + 1]; // Trả về dạng 1-based index như LeetCode 167
        } else if (sum < target) {
            left++; // Cần tăng tổng lên
        } else {
            right--; // Cần giảm tổng xuống
        }
    }
    return [];
}
\`\`\`

*   **Thời gian**: \`O(N)\` - Do mỗi phần tử chỉ được duyệt tối đa một lần qua một vòng lặp tuyến tính duy nhất.
*   **Không gian**: \`O(1)\` - Không cần thêm cấu trúc dữ liệu bổ trợ Hash Map.`
  },
  {
    id: 'caching-strategies',
    title: 'Chiến lược Caching trong Thiết kế Hệ thống',
    topic: 'system-design',
    difficulty: 'medium',
    summary: 'Tìm hiểu sâu về Cache Write Policy, cơ chế eviction (LRU, LFU) và các kỹ thuật xử lý Cache Stampede, Cache Penetration.',
    duration: '15 phút',
    content: `## 1. Tại sao cần Caching?

Trong các hệ thống phân tán quy mô lớn, **Caching** (Bộ nhớ đệm) đóng vai trò nòng cốt giúp giảm tải cho cơ sở dữ liệu (Database), tăng hiệu năng và giảm độ trễ phản hồi (Latency) xuống hàng mili-giây. Cache lưu trữ dữ liệu tính toán đắt đỏ hoặc dữ liệu thường xuyên được truy cập trên bộ nhớ tốc độ cao (In-Memory RAM như Redis hoặc Memcached).

---

## 2. Các chiến lược viết/đọc Cache (Cache Read/Write Policies)

Khi thiết kế hệ thống, việc đồng bộ giữa Cache và Database là bài toán quan trọng bậc nhất. Hệ thống của bạn sẽ sử dụng cơ chế nào dưới đây?

### a) Cache-Aside (Lazy Loading) - Phổ biến nhất
*   **Đọc**: Ứng dụng kiểm tra xem dữ liệu có trong Cache không. Nếu có (**Cache Hit**), trả về luôn. Nếu không (**Cache Miss**), đọc từ Database, ghi vào Cache rồi trả về.
*   **Ghi**: Viết trực tiếp vào DB, sau đó thực hiện xóa hoặc invalidate key tương ứng trong Cache.
*   **Ưu điểm**: Chỉ lưu trữ dữ liệu thực sự được đọc, tránh lãng phí RAM. Không làm nghẽn quá trình ghi nếu mạng có sự cố.

### b) Write-Through
*   **Ghi**: Dữ liệu được ghi đồng thời vào cả Cache và Database trước khi xác nhận ghi thành công với client.
*   **Ưu điểm**: Không bao giờ xảy ra tình trạng lệch pha dữ liệu (Stale data) giữa Cache và DB đối với các luồng đọc mới.

### c) Write-Back (Write-Behind)
*   **Ghi**: Ứng dụng chỉ ghi trực tiếp vào Cache một cách cực kỳ nhanh chóng. Một luồng background bất đồng bộ sẽ gom tải (batch) và ghi xuống DB sau đó.
*   **Ưu điểm**: Tối ưu hóa tối đa hiệu năng ghi (nhập liệu tốc độ cực cao, game online, IoT).
*   **Nhược điểm**: Rủi ro mất mát dữ liệu cao nếu Cache crash trước khi kịp sync dữ liệu xuống DB.

---

## 3. Thuật toán giải phóng bộ nhớ đệm (Cache Eviction Policies)

Do bộ nhớ đệm có giới hạn, khi Cache đầy, hệ thống cần vứt bỏ bớt dữ liệu cũ. Các thuật toán chính:
1.  **LRU (Least Recently Used)**: Vứt bỏ phần tử lâu rồi chưa từng được truy cập. (Ứng dụng nhiều nhất).
2.  **LFU (Least Frequently Used)**: Vứt bỏ phần tử có tần suất truy cập thấp nhất.
3.  **FIFO (First In First Out)**: Phần tử nào được ghi vào trước thì bị xóa trước.

---

## 4. Ba Thảm Họa Cache và giải pháp khắc phục khi phỏng vấn

| Vấn đề | Mô tả | Giải pháp |
| :--- | :--- | :--- |
| **Cache Penentration** (Thủng Cache) | Lượng lớn request truy cập vào phần tử không tồn tại ở cả Cache lẫn DB (Bị phá hoại). | 1. Sử dụng **Bloom Filter** để lọc sớm.<br>2. Lưu cả giá trị trống (null/empty) với TTL cực ngắn. |
| **Cache Breakdown** (Sập Cache chủ chốt) | Một key cực kỳ hot vừa hết hạn (TTL expired) kéo theo hàng vạn request sầm sập truy cập trực tiếp hạ gục DB. | Sử dụng cơ chế khóa phân tán **Mutex Lock** khi có Cache Miss để chỉ cho 1 request đại diện đi truy vấn DB nạp lại cache. |
| **Cache Avalanche** (Tuyết lở bộ đệm) | Loạt lớn key đồng loạt hết hạn đúng cùng một thời điểm khiến DB đột ngột quá tải. | Cài đặt **Randomized TTL** (cộng thêm vài phút ngẫu nhiên cho từng Key khi cấu hình lưu trữ bộ đệm). |`
  },
  {
    id: 'javascript-event-loop',
    title: 'Event Loop & Cơ Chế Bất Đồng Bộ Trong JS',
    topic: 'frontend',
    difficulty: 'hard',
    summary: 'Chinh phục câu hỏi cực khó về Call Stack, Web APIs, Microtask queue (Promise) vs Macrotask queue (setTimeout) trong Javascript.',
    duration: '10 phút',
    content: `## 1. Single Threaded Javascript

Trái ngược với suy nghĩ của nhiều người, công cụ JavaScript (V8, SpiderMonkey) là **đơn luồng (Single Threaded)**. Nghĩa là tại một thời điểm, nó chỉ có một Call Stack để thực thi chính xác một dòng code duy nhất.

Vậy làm thế nào mà JavaScript xử lý được các cuộc gọi mạng rườm rà, lắng nghe tương tác chuột ríu rít mà không làm treo đơ trình duyệt (Non-blocking)? Đúng vậy, vị cứu tinh chính là **Event Loop** nằm trong Runtime Environment (Trình duyệt hoặc Node.js).

---

## 2. Kiến trúc runtime của JavaScript

Hệ sinh thái chạy JS bao gồm:
*   **Call Stack**: Thực thi đồng bộ các dòng code.
*   **Web APIs / Node Background Threads**: Xử lý chạy ngầm như \`setTimeout\`, \`fetch()\` request, Event Listeners.
*   **Callback Queues**: Hộp chứa các tác vụ chờ xử lý gồm hai loại có độ ưu tiên khác nhau:
    *   **Microtask Queue (Ưu tiên cực cao)**: Chứa \`Promise.then()\`, \`MutationObserver\`, \`queueMicrotask\`.
    *   **Macrotask Queue / Callback Queue**: Chứa \`setTimeout()\`, \`setInterval()\`, \`setImmediate()\` (Node.js), I/O events.

---

## 3. Quy trình làm việc của Event Loop

Event Loop hoạt động như một vòng lặp rà soát vô tận với thuật toán 4 bước nghiêm ngặt sau:

1.  **Thực thi đồng bộ**: Chạy hết mọi dòng code trên **Call Stack** cho đến khi Rỗng.
2.  **Quét Microtask Queue**: Nếu có Task trong Microtask Queue, thực thi LẦN LƯỢT toàn bộ các tác vụ trong hàng đợi này cho tới khi **hoàn toàn sạch sẽ**. *(Kể cả các Microtask mới phát sinh trong quá trình chạy).*
3.  **Render Trình duyệt (nếu có)**: Trình duyệt thực hiện vẽ lại giao diện (Repaint/Reflow) định kỳ.
4.  **Lấy 1 Macrotask**: Nhặt duy nhất **MỘT** tác vụ ở đầu Macrotask Queue đẩy lên Call Stack để thực thi. Quay trở lại bước 1.

> **Quy tắc vàng phỏng vấn**: Microtask Queue LUÔN LUÔN được dọn sạch hoàn toàn trước khi Event Loop chuyển sang làm việc với Macrotask kế tiếp!

---

## 4. Thử thách đọc Log phỏng vấn (Tracing Challenge)

Hãy phân tích kết quả in ra console của đoạn code sau:

\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

console.log('6');
\`\`\`

### Phân tích:
1.  \`console.log('1')\` chạy lập tức trên Call Stack -> In ra **1**.
2.  \`setTimeout\` đăng ký Web API với độ trễ 0ms. Khi xong nó ném callback \`C1\` vào Macrotask Queue.
3.  \`Promise.then\` đăng ký callback \`M1\` vào Microtask Queue.
4.  \`console.log('6')\` chạy lập tức -> In ra **6**. (Call Stack rỗng!).
5.  Event Loop phát hiện Microtask Queue có \`M1\`. Thực thi \`M1\`:
    *   In ra **4**.
    *   \`setTimeout\` trong đó đăng ký Web API ném callback \`C2\` vào Macrotask Queue.
6.  Microtask Queue giờ rỗng. Event Loop duyệt lấy Macrotask đầu tiên \`C1\` lên chạy:
    *   In ra **2**.
    *   Ném Promise mới vào Microtask Queue (\`M2\`).
7.  Trước khi chạy Macrotask tiếp theo (\`C2\`), Event Loop bắt buộc dọn dẹp tiếp \`M2\` vừa sinh ở bước trước:
    *   In ra **3**.
8.  Microtask Queue lại rỗng. Đưa Macrotask cuối cùng \`C2\` lên thực thi:
    *   In ra **5**.

**Kết quả cuối cùng**: \`1, 6, 4, 2, 3, 5\``
  }
];
