import type { TutorQuestion } from './types';

type AiTutorProps = {
    lessonId: string;
    onAsk?: (payload: TutorQuestion) => void;
};

export default function AiTutor({ lessonId, onAsk }: AiTutorProps) {
    return (
        <section>
            <h2>AI Tutor</h2>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const question = (form.elements.namedItem('question') as HTMLTextAreaElement)?.value ?? '';

                    onAsk?.({
                        lessonId,
                        learnerId: 'learner-1',
                        question,
                    });
                }}
            >
                <textarea name="question" placeholder="Ask about this lesson..." />
                <button type="submit">Ask AI Tutor</button>
            </form>
        </section>
    );
}
