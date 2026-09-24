import type { Course } from './types';

type CourseListProps = {
    courses: Course[];
    onEnroll?: (courseId: string) => void;
};

export default function CourseList({ courses, onEnroll }: CourseListProps) {
    return (
        <section>
            <h2>Course List</h2>
            <ul>
                {courses.map((course) => (
                    <li key={course.id}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <small>{course.category}</small>
                        <div>
                            <span>{course.status}</span>
                            <button type="button" onClick={() => onEnroll?.(course.id)} disabled={course.enrolled}>
                                {course.enrolled ? 'Enrolled' : 'Enroll'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
