import { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'two-sum-coding',
    title: 'Tìm Hai Số Có Tổng Bằng Target (Two Sum)',
    type: 'coding',
    topic: 'dsa',
    difficulty: 'easy',
    description: `## Đề bài (Two Sum)

Cho một mảng các số nguyên \`nums\` và một số nguyên \`target\`, hãy tìm chỉ số (index) của hai số sao cho tổng cộng của chúng bằng đúng \`target\`.

Bạn có thể giả định rằng mỗi đầu vào sẽ có **chính xác một giải pháp**, và bạn không được sử dụng cùng một phần tử hai lần.

Bạn có thể trả về câu trả lời theo bất kỳ thứ tự nào.

---

### Ví dụ 1:
*   **Đầu vào (Input)**: \`nums = [2, 7, 11, 15], target = 9\`
*   **Đầu ra (Output)**: \`[0, 1]\`
*   **Giải thích**: Vì \`nums[0] + nums[1] == 2 + 7 == 9\`, ta trả về \`[0, 1]\`.

### Ví dụ 2:
*   **Đầu vào (Input)**: \`nums = [3, 2, 4], target = 6\`
*   **Đầu ra (Output)**: \`[1, 2]\`

---

### Ràng buộc (Constraints):
*   \`2 <= nums.length <= 10^4\`
*   \`-10^9 <= nums[i] <= 10^9\`
*   \`-10^9 <= target <= 10^9\`
*   Tối ưu hóa: Bạn có thể tìm giải thuật có độ phức tạp thời gian nhỏ hơn \`O(N^2)\` không?`,
    explanation: `### Phân tích giải thuật (Two Sum)

#### Cách 1: Duyệt cạn kiệt (Brute Force) - O(N^2)
Sử dụng 2 vòng lặp lồng ghép để xét mọi cặp phần tử \`(i, j)\`. Nếu \`nums[i] + nums[j] == target\`, trả về \`[i, j]\`.
*   *Độ phức tạp*: Thời gian \`O(N^2)\`, Không gian \`O(1)\`.

#### Cách 2: Sử dụng Bảng băm (Hash Map) - O(N) - Tối ưu nhất
Chúng ta có thể xử lý việc này trong một vòng lặp bằng cách ghi nhớ các phần tử đã duyệt qua.
Với mỗi số \`x\` tại chỉ số \`i\`, giá trị còn thiếu cần tìm là \`complement = target - x\`.
1. Kiểm tra xem \`complement\` có nằm trong bảng băm (Map) của chúng ta chưa.
2. Nếu có, tức là ta đã tìm thấy cặp phần tử thỏa mãn. Trả về ngay lập tức \`[Map.get(complement), i]\`.
3. Nếu chưa, lưu trữ giá trị \`x\` hiện tại cùng chỉ số \`i\` của nó vào Map: \`Map.set(x, i)\`.

*   *Độ phức tạp*:
    *   **Thời gian**: \`O(N)\` - Chỉ duyệt qua mảng đúng 1 lần. Tra cứu băm mất thời gian \`O(1)\`.
    *   **Không gian**: \`O(N)\` - Trường hợp xấu nhất phải lưu trữ toàn bộ phần tử vào map băm bổ trợ.`,
    templateCode: {
      javascript: `function twoSum(nums, target) {
    // Viết code của bạn ở đây
    
    return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Viết code của bạn ở đây
    
    return []`
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]', description: 'Mảng cơ bản có cặp ở vị trí khởi đầu' },
      { input: '[3, 2, 4], 6', output: '[1, 2]', description: 'Cặp số ở chính giữa và cuối' },
      { input: '[3, 3], 6', output: '[0, 1]', description: 'Hai số giống hệt nhau' }
    ]
  },
  {
    id: 'reverse-linked-list',
    title: 'Đảo Ngược Danh Sách Liên Kết Đơn',
    type: 'coding',
    topic: 'dsa',
    difficulty: 'medium',
    description: `## Đề bài (Reverse Linked List)

Cho nút đầu (\`head\`) của một danh sách liên kết đơn, hãy đảo ngược thứ tự các nút trong danh sách này và trả về nút đầu mới sau khi đảo ngược.

---

### Ví dụ 1:
*   **Đầu vào (Input)**: \`head = [1, 2, 3, 4, 5]\`
*   **Đầu ra (Output)**: \`[5, 4, 3, 2, 1]\`

### Ví dụ 2:
*   **Đầu vào (Input)**: \`head = [1, 2]\`
*   **Đầu ra (Output)**: \`[2, 1]\`

---

### Ràng buộc (Constraints):
*   Số lượng nút trong danh sách nằm trong khoảng \`[0, 5000]\`.
*   \`-5000 <= Node.val <= 5000\`

---

*Gợi ý bổ trợ*: Bạn có thể thực hiện thuật toán này bằng cả hai phương pháp **Khử lặp (Iterative)** và **Đệ quy (Recursive)** không?`,
    explanation: `### Phân tích giải pháp Đảo Ngược LinkedList

#### Cách 1: Tìm cách xoay con trỏ liên kết (Khử lặp - Iterative)
Ý tưởng là duyệt qua danh sách, tại mỗi bước ta đổi hướng liên kết của nút hiện tại (\`curr\`) trỏ về nút phía trước nó (\`prev\`). Do đổi hướng trỏ, ta sẽ bị mất vị trí của nút tiếp theo, vì vậy cần lưu trữ nút tiếp theo vào biến tạm \`nextNode\` trước khi hiệu chỉnh.

Cơ chế dịch chuyển trạng thái:
1. \`nextNode = curr.next\` (Lưu giữ cầu nối phía sau)
2. \`curr.next = prev\` (Đảo ngược liên kết của nút hiện tại trỏ ngược về trước)
3. \`prev = curr\` (Cập nhật nút trước lên thành nút hiện tại)
4. \`curr = nextNode\` (Duyệt tiếp tới nút kế tiếp)

**Code mẫu mẫu ý tưởng:**
\`\`\`javascript
function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}
\`\`\`

*   **Thời gian**: \`O(N)\` - Duyệt qua danh sách dài N đúng 1 lần.
*   **Không gian**: \`O(1)\` - Sử dụng các con trỏ tạm thời, không tốn thêm bộ nhớ.`,
    templateCode: {
      javascript: `/*
 * Định nghĩa ListNode:
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseList(head) {
    // Viết code của bạn ở đây
    
    return null;
}`,
      python: `# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
def reverse_list(head):
    # Viết code của bạn ở đây
    
    return None`
    },
    testCases: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', description: 'Đảo ngược danh sách 5 phần tử' },
      { input: '[1, 2]', output: '[2, 1]', description: 'Danh sách 2 phần tử' },
      { input: '[]', output: '[]', description: 'Danh sách rỗng' }
    ]
  },
  {
    id: 'acid-properties-quiz',
    title: 'Kiến thức về Tính Chất ACID trong Hệ quản trị CSDL',
    type: 'written',
    topic: 'system-design',
    difficulty: 'medium',
    description: `## Câu hỏi tự luận phỏng vấn:

Hãy giải thích chi tiết ý nghĩa của 4 tính chất thuộc nguyên lý **ACID** trong Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS). 

Tại sao chúng lại cực kỳ quan trọng trong việc thiết kế các hệ thống giao thức tài chính (như chuyển tiền ngân hàng)? Cung cấp ví dụ thực tế minh họa.`,
    explanation: `### Đáp án chuẩn phỏng vấn về các tính chất ACID

**ACID** viết tắt của 4 từ: **Atomicity (Tính nguyên tử)**, **Consistency (Tính nhất quán)**, **Isolation (Tính cô lập)**, và **Durability (Tính bền vững)**. Đây là bộ quy chuẩn vàng đảm bảo giao dịch (transaction) xảy ra an toàn, chính xác.

---

### 1. Atomicity (Tính nguyên tử) - "Tất cả hoặc không có gì"
*   **Định nghĩa**: Một giao dịch gồm nhiều thao tác nhỏ. Hoặc là tất cả các thao tác này đều được thực hiện thành công, hoặc không có thao tác nào được thực hiện (nếu xảy ra lỗi giữa chừng, toàn bộ tiến trình phải được rollback về trạng thái ban đầu).
*   **Ví dụ**: Chuyển tiền từ tài khoản A sang B gồm 2 bước: trừ tiền A và cộng tiền B. Nếu trừ tiền A thành công nhưng mạng sập khiến không thể cộng tiền B, hệ thống phải rollback để hoàn tiền cho A.

### 2. Consistency (Tính nhất quán)
*   **Định nghĩa**: Giao dịch phải đưa cơ sở dữ liệu từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác. Tất cả các quy tắc, ràng buộc bảo mật (constraints, foreign keys, unique indexes) phải luôn được bảo toàn sau khi kết thúc giao dịch.
*   **Ví dụ**: Tiền tài khoản không được âm dưới số dư tối thiểu. Giao dịch chuyển tiền vượt quá số dư sẽ bị hệ thống tự động từ chối để giữ tính toàn vẹn.

### 3. Isolation (Tính cô lập)
*   **Định nghĩa**: Các giao dịch đồng thời (concurrent transactions) không được gây ảnh hưởng lẫn nhau. Kết quả của một giao dịch đang chạy chưa commit không được hiển thị cho các giao dịch khác thấy để tránh dữ liệu rác (dirty reads).
*   **Ví dụ**: A và B cùng chuyển tiền cho C một thời điểm. Hệ thống phải đảm bảo hai luồng ghi này thực hiện cô lập tuần tự, tránh tình trạng ghi đè đè số dư (lost updates).

### 4. Durability (Tính bền vững)
*   **Định nghĩa**: Một khi giao dịch đã được xác nhận (commit), dữ liệu sẽ được lưu trữ vĩnh viễn vào ổ cứng vật lý. Kể cả khi hệ thống bị sập nguồn hay cháy máy chủ ngay sau đó, dữ liệu giao dịch vẫn không thể bị xóa bỏ.
*   **Ví dụ**: Nhật ký giao dịch được đồng bộ trực tiếp vào (WAL - Write-Ahead Logging) trên SSD, giúp Database tự động phục hồi lại chính xác trạng thái đã commit khi khởi động lại.`
  },
  {
    id: 'js-closures-mcq',
    title: 'Hiểu sâu về Closure trong JavaScript',
    type: 'multiple-choice',
    topic: 'frontend',
    difficulty: 'medium',
    description: `### Thử thách trắc nghiệm:
Đoạn code JavaScript sau đây sẽ in ra kết quả gì vào Console?

\`\`\`javascript
function createCounter() {
  let count = 0;
  return {
    increment() {
      count++;
      return count;
    },
    count: count
  };
}

const counter = createCounter();
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.count);
\`\`\`
`,
    options: [
      '1, 2, 2',
      '1, 2, 0',
      '1, 2, undefined',
      'Thao tác gây ra lỗi ReferenceError'
    ],
    correctAnswerIndex: 1,
    explanation: `### Giải thích chi tiết đáp án:

**Đáp án đúng là: "1, 2, 0"**

#### Tại sao lại là \`1, 2, 0\`?

1. **Khởi tạo**: \`let count = 0;\`. Biên dịch đối tượng trả về chứa:
   * Phương thức \`increment\` là một **closure**. Nó giữ tham chiếu trực tiếp tới biến \`count\` nằm ở scope cha bên ngoài.
   * Thuộc tính \`count: count\`. Đây là gán giá trị theo kiểu trị (value assignment) ngay lúc khởi tạo. Do đó, trường \`counter.count\` copy giá trị ban đầu là \`0\` tại thời điểm khởi tạo và nó là một kiểu dữ liệu primitive độc lập.
   
2. **Kêu gọi \`counter.increment()\` lần 1**: 
   * Hàm \`increment\` thay đổi biến \`count\` trong scope cha lên \`1\`. Đồng thời trả về \`1\`. In ra **1**.
   
3. **Kêu gọi \`counter.increment()\` lần 2**:
   * Tăng biến \`count\` trong scope cha lên \`2\`. Trả về \`2\`. In ra **2**.
   
4. **Truy cập \`counter.count\`**:
   * Thuộc tính \`counter.count\` là giá trị kiểu số nguyên nguyên bản, không cập nhật tự động khi biến \`count\` trong closure thay đổi! Nó vẫn giữ nguyên trị giá trị \`0\` đã sao chép lúc đầu. In ra **0**.`
  },
  {
    id: 'scaling-chat-system',
    title: 'Kiến Trúc Hệ Thống Chat Thời Gian Thực (Scale Chat App)',
    type: 'written',
    topic: 'system-design',
    difficulty: 'hard',
    description: `## Câu hỏi thảo luận thiết kế hệ thống (System Design Challenge):

Hãy trình bày cách bạn thiết kế một hệ thống chat thời gian thực hỗ trợ **10 triệu người dùng hoạt động hàng ngày (DAU)**. 

Hãy trả lời chi tiết các câu hỏi dưới đây:
1. Giao thức mạng nào phù hợp nhất (WebSocket, Long Polling, SSE)? Tại sao?
2. Cách xử lý lưu trữ tin nhắn lịch sử và tin nhắn đang truyền tải.
3. Cách giữ trạng thái "Online / Offline" (Presence system) của lượng lớn người dùng cùng lúc.`,
    explanation: `### Bản phác thảo kiến trúc hệ thống Chat 10M DAU thành công

#### 1. Lựa chọn Giao thức Mạng
*   **Đề xuất**: Sử dụng hằng số liên tục thông qua **WebSockets** làm lựa chọn chính để duy trì kết nối hai chiều (bi-directional) độ trễ thấp giữa client và server.
*   **Tại sao chọn WebSockets**: Khác với HTTP liên tục tạo handshake mới đầy tốn kém, WebSocket duy trì 1 phiên TCP duy nhất, cho phép đẩy tin nhắn cực nhanh.
*   **Giải pháp dự phòng**: Sử dụng HTTP Long Polling cho các dòng trình duyệt cũ không hỗ trợ.

#### 2. Kiến trúc cụ thể từng tầng
*   **Gateway / Connection Management (Tầng kết nối)**:
    *   Hàng loạt máy chủ WebSocket (được scale ngang đại trà) quản lý duy trì các kết nối TCP với client. 
    *   Sử dụng **Consistent Hashing** trên Load Balancer để chia tải đều kết nối.
*   **Lưu trữ Tin nhắn (Message Storage)**:
    *   *Tin nhắn đang truyền (In-flight)*: Đẩy vào hàng đợi thông điệp **Kafka** để xử lý không đồng bộ.
    *   *Tin nhắn cũ (Historical messages)*: Lưu trữ bằng cơ sở dữ liệu phi quan hệ cột (NoSQL Wide-column) như **Apache Cassandra** hoặc **ScyllaDB**. Chúng có tốc độ ghi cực nhanh, hỗ trợ sắp xếp theo thời gian dễ dàng nhờ phân vùng khóa (\`partition key = chat_room_id, clustering key = message_time\`).
*   **Message Broker (Cầu nối liên lạc)**:
    *   Khi người dùng gửi tin từ máy chủ WS này tới người dùng ở máy chủ WS khác, cần một bộ định tuyến trung gian. Sử dụng **Redis Pub/Sub** để định tuyến tin nhắn giữa các máy chủ WebSocket nội bộ.

#### 3. Hệ thống Trạng thái Người dùng (Presence System)
Hệ thống Presence rất dễ làm nghẽn cổ chai nếu cập nhật trạng thái online/offline liên tục xuống DB truyền thống.
*   **Redis Key-Value Cache**: Sử dụng bộ nhớ đệm Redis để theo dõi trạng thái online. 
*   **Heartbeat cơ chế (Nhịp tim)**: Client gửi định kỳ một request "ping" cực nhẹ lên WebSocket Gateway mỗi 5-10 giây để gia hạn thời gian sống (TTL) của trạng thái online trong Redis. Nếu quá thời gian mốc (ví dụ sau 15 giây không có ping), Gateway coi như Client đã mất kết nối và tự động cập nhật trạng thái là **Offline**.`
  },
  {
    id: 'star-method-behavioral',
    title: 'Cách trả lời câu hỏi "Giải quyết mâu thuẫn kỹ thuật trong team"',
    type: 'written',
    topic: 'behavioral',
    difficulty: 'easy',
    description: `## Tình huống Phỏng vấn Hành vi:

Hãy viết câu trả lời mẫu chuẩn phương pháp **STAR** cho câu hỏi phỏng vấn hành vi kinh điển:
> *"Hãy kể về một lần bạn có mâu thuẫn hoặc bất đồng ý kiến về mặt kỹ thuật/kiến trúc với một thành viên khác trong team của mình. Bạn đã giải quyết nó ra sao?"*

Phương án trả lời cần hiển thị đầy đủ 4 phần:
1.  **Situation (Bối cảnh)**
2.  **Task (Nhiệm vụ)**
3.  **Action (Hành động cụ thể)**
4.  **Result (Kết quả thu về)**`,
    explanation: `### Khung trả lời chuẩn STAR cho mẫu câu hỏi mâu thuẫn kỹ thuật

Mục tiêu chính của người phỏng vấn khi đặt câu hỏi này là đánh giá **kỹ năng mềm**, thái độ cầu tiến, tư duy phản biện xây dựng, và khả năng giải phóng xung đột kỹ thuật dựa trên dữ liệu thay vì cái tôi cá nhân.

---

### Sử dụng sơ đồ STAR chuẩn chỉnh:

#### 1. Situation (Bối cảnh)
*   *Mẫu*: "Ở dự án trước tôi tham gia, chúng tôi cần tích hợp một module thống kê thời gian thực cho Dashboard. Một anh kỹ sư cấp cao (Senior Engineer) muốn sử dụng giải pháp tích hợp ElasticSearch vì nó tối ưu cho việc tìm kiếm và lọc sâu, trong khi tôi lại đề xuất giải pháp tận dụng tính năng In-Memory Cache của Redis kết hợp PostgreSQL hiện tại để duy trì chi phí và giảm độ phức tạp vận hành của hệ thống sắp tới."

#### 2. Task (Nhiệm vụ)
*   *Mẫu*: "Chúng tôi phải đưa ra quyết định kiến trúc thống nhất chỉ trong 3 ngày để không làm trễ hạn bàn giao giai đoạn đầu của sản phẩm, song song với việc giữ mối quan hệ đồng nghiệp chuyên nghiệp, tôn trọng nhau."

#### 3. Action (Hành động)
*   *Mẫu*: "Thay vì tranh cãi lý thuyết suông để chứng minh ai đúng ai sai, tôi đã thực hiện các bước sau:
    1.  **Lập bảng so sánh dựa trên dữ liệu thực tế**: Tôi đã tạo một tài liệu tài nguyên phân tích chi phí phần cứng vận hành ElasticSearch (khoảng $200/tháng tối thiểu) so với Redis, cũng như độ dốc học tập của team hỗ trợ vận hành.
    2.  **Làm mẫu thí nghiệm nhỏ (POC)**: Tôi dành ra 3 tiếng buổi tối dựng thử 1 POC sử dụng Redis để mô phỏng tải 5,000 requests/s và đo đạc độ trễ phản hồi.
    3.  **Thảo luận tích cực**: Tôi đặt một buổi họp ngắn 30 phút, trình bày các con số thực thi khách quan cho anh Senior xem. Tôi nhấn mạnh sự tôn trọng định hướng của anh ấy, nhưng đưa ra giải pháp trung hòa: Sử dụng Redis ở Phase 1 để release kịp thời vụ, nếu dữ liệu phình to vượt khả năng, chúng tôi sẽ lập tức di trú sang ES ở Phase 2."

#### 4. Result (Kết quả)
*   *Mẫu*: "Anh Senior hoàn toàn bị thuyết phục bởi sự chuẩn bị chu đáo và thái độ khách quan của tôi. Chúng tôi đã thống nhất giải pháp sử dụng Redis ở giai đoạn đầu. Kết quả là module hoạt động cực kỳ mượt mà, kịp tiến độ, tiết kiệm được hàng nghìn USD chi phí cloud ban đầu cho dự án. Mối quan hệ giữa tôi và anh đồng nghiệp cũng trở nên gắn kết hơn rất nhiều, hai anh em thường xuyên thảo luận kiến trúc mở trong các dự án sau đó."`
  }
];
