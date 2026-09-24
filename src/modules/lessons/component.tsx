import type { Lesson } from './types';

type LessonListProps = {
    lessons: Lesson[];
    onComplete?: (lessonId: string) => void;
};

export default function LessonList({ lessons, onComplete }: LessonListProps) {
    return (
        <section>
            <h2>Lesson Detail</h2>
            <ul>
                {lessons.map((lesson) => (
                    <li key={lesson.id}>
                        <h3>{lesson.title}</h3>
                        <p>{lesson.duration}</p>
                        <p>{lesson.content}</p>
                        <button type="button" onClick={() => onComplete?.(lesson.id)} disabled={lesson.completed}>
                            {lesson.completed ? 'Completed' : 'Mark as complete'}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
