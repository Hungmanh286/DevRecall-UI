/**
 * Thuật toán lặp lại ngắt quãng SuperMemo-2 (SM-2)
 *
 * @param quality Đánh giá mức độ tự nhớ từ 0 đến 5:
 *   5 - Hoàn hảo: Phản xạ nhanh không chút do dự.
 *   4 - Đúng sau khi ngẫm lại một chút.
 *   3 - Đúng nhưng cực kỳ vất vả để nhớ ra.
 *   2 - Trả lời sai; sau khi xem đáp án cảm thấy rất dễ và quen thuộc.
 *   1 - Trả lời sai; cảm giác lờ mờ nhớ mang máng.
 *   0 - Quên sạch hoàn toàn không có ấn tượng gì.
 * 
 * @param repetitions Số lần lặp lại thành công liên tiếp hiện tại.
 * @param previousInterval Khoảng cách ngày ôn tập trước đó.
 * @param easeFactor Hệ số dễ nhớ hiện tại (mức chuẩn ban đầu là 2.5).
 */
export function calculateSM2(
  quality: number,
  repetitions: number,
  previousInterval: number,
  easeFactor: number
): {
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
} {
  let rep = repetitions;
  let interval = previousInterval;
  let ef = easeFactor;

  if (quality >= 3) {
    if (rep === 0) {
      interval = 1; // ngày đầu tiên
    } else if (rep === 1) {
      interval = 6; // lặp lại lần 2 sau 6 ngày
    } else {
      interval = Math.round(previousInterval * ef);
    }
    rep += 1;
  } else {
    rep = 0;
    interval = 1; // phải ôn lại ngay vào ngày mai
  }

  // Hiệu chỉnh hệ số dễ nhớ (Ease Factor) công thức SM-2
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  if (ef < 1.3) {
    ef = 1.3; // Hệ số dễ nhớ không bao giờ tụt dưới ngưỡng 1.3
  }

  // Tính ngày kế tiếp
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    repetitions: rep,
    interval: interval,
    easeFactor: parseFloat(ef.toFixed(2)),
    nextReviewDate: nextDate.toISOString()
  };
}
