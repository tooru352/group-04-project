import type { TutorAnswer, TutorQuestion } from './types.ts';

export function evaluateTutorContext(question: TutorQuestion, lessonContext: string): TutorAnswer {
    const normalized = `${lessonContext} ${question.question}`.toLowerCase();
    
    // Check for off-topic keywords (sports, weather, politics)
    const offTopicKeywords = ['weather', 'thời tiết', 'football', 'bóng đá', 'politics', 'chính trị', 'stock market', 'cổ phiếu', 'crypto', 'bitcoin'];
    const isOffTopic = offTopicKeywords.some((kw) => normalized.includes(kw));

    if (isOffTopic) {
        return {
            lessonId: question.lessonId,
            answer: 'KHÔNG ĐỦ DỮ LIỆU',
            references: [],
            status: 'insufficient_context',
        };
    }

    const snippet = lessonContext.length > 180 ? lessonContext.slice(0, 180) : lessonContext;
    const qLower = question.question.toLowerCase();

    let answerText = 'Based on this lesson, prioritize user empathy and insight before proposing a solution or journey map update.';
    if (qLower.includes('tóm tắt') || qLower.includes('summary') || qLower.includes('tóm lại')) {
        answerText = `📋 **Tóm tắt bài học:**\n- Tập trung vào nhu cầu và trải nghiệm người dùng.\n- Phân tích pain points và cơ hội cải tiến.\n- Thử nghiệm mẫu (prototype) để nhận phản hồi sớm.`;
    } else if (qLower.includes('ví dụ') || qLower.includes('example') || qLower.includes('minh họa')) {
        answerText = `🔍 **Ví dụ thực tế:**\n- Xây dựng Empathy Map cho người dùng đặt xe trực tuyến.\n- Thử nghiệm wireframe vẽ tay để cải tiến luồng thanh toán.`;
    } else if (qLower.includes('giải thích') || qLower.includes('explain') || qLower.includes('là gì')) {
        answerText = `📚 **Giải thích bài học:**\nNội dung bài học tập trung vào phương pháp thiết kế lấy người dùng làm trung tâm (Human-Centered Design), lắng nghe thấu cảm và thử nghiệm ý tưởng nhanh.`;
    }

    return {
        lessonId: question.lessonId,
        answer: answerText,
        references: [{ lessonId: question.lessonId, snippet }],
        status: 'success',
    };
}
