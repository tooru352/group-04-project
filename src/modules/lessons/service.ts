import type { Lesson, LessonProgress } from './types.ts';
import { canCompleteLesson } from './domain.ts';

const sampleLessons: Lesson[] = [
    {
        id: 'lesson-1',
        courseId: 'course-1',
        title: 'Empathy and User Needs',
        duration: '18 min',
        content: 'Understand user pain points and define the problem clearly.',
        completed: true,
        status: 'Published',
    },
    {
        id: 'lesson-2',
        courseId: 'course-1',
        title: 'Journey Mapping',
        duration: '25 min',
        content: 'Map user steps and identify friction points across the journey.',
        completed: false,
        status: 'Published',
    },
];

export async function getLessons(courseId: string): Promise<Lesson[]> {
    return sampleLessons.filter((lesson) => lesson.courseId === courseId);
}

export async function createLesson(
    courseId: string,
    input: { title: string; content: string; duration: string; status: 'Published' | 'Draft' | 'Archived' },
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<Lesson> {
    if (context.userRole !== 'Instructor') {
        throw new Error('Only Instructors can manage lessons.');
    }

    const managedCourseIds = context.managedCourseIds ?? [];
    if (managedCourseIds.length > 0 && !managedCourseIds.includes(courseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    const title = input.title?.trim() ?? '';
    const content = input.content?.trim() ?? '';
    if (!title || !content) {
        throw new Error('Lesson title and content must not be empty.');
    }

    const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        courseId,
        title,
        duration: input.duration,
        content,
        completed: false,
        status: input.status,
    };

    sampleLessons.push(lesson);
    return lesson;
}

export async function updateLesson(
    lessonId: string,
    input: Partial<{ title: string; content: string; duration: string; status: 'Published' | 'Draft' | 'Archived' }>,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<Lesson> {
    const lesson = sampleLessons.find((item) => item.id === lessonId);
    if (!lesson) {
        throw new Error('Lesson not found.');
    }

    if (context.userRole !== 'Instructor') {
        throw new Error('Only Instructors can update lessons.');
    }

    const managedCourseIds = context.managedCourseIds ?? [];
    if (managedCourseIds.length > 0 && !managedCourseIds.includes(lesson.courseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    const nextTitle = input.title?.trim() ?? lesson.title;
    const nextContent = input.content?.trim() ?? lesson.content;
    if (!nextTitle || !nextContent) {
        throw new Error('Lesson title and content must not be empty.');
    }

    lesson.title = nextTitle;
    lesson.content = nextContent;
    if (input.duration !== undefined) lesson.duration = input.duration;
    if (input.status !== undefined) lesson.status = input.status;

    return lesson;
}

export async function getLessonById(
    lessonId: string,
    learnerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        enrolledCourseIds?: string[];
    } = {},
): Promise<Lesson & { status: 'Published' | 'Draft' | 'Archived' }> {
    const lesson = sampleLessons.find((item) => item.id === lessonId);

    if (!lesson) {
        throw new Error('Lesson not found.');
    }

    if (context.userRole !== 'Learner') {
        throw new Error('Only Learners can view lessons.');
    }

    const enrolledCourseIds = context.enrolledCourseIds ?? [];
    const hasEnrollment = enrolledCourseIds.includes(lesson.courseId);

    if (!hasEnrollment) {
        throw new Error('Access denied. Enroll in the course to view this lesson.');
    }

    if (lesson.status !== 'Published') {
        throw new Error('Lesson is not available for learners.');
    }

    return {
        ...lesson,
        status: lesson.status,
    };
}

export async function completeLesson(
    lessonId: string,
    learnerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        enrolledCourseIds?: string[];
    } = {},
): Promise<LessonProgress & { status: 'completed' | 'incomplete'; userId: string }> {
    const lesson = sampleLessons.find((item) => item.id === lessonId);

    if (!lesson) {
        throw new Error('Lesson not found.');
    }

    if (context.userRole !== 'Learner') {
        throw new Error('Only Learners can complete lessons.');
    }

    const enrolledCourseIds = context.enrolledCourseIds ?? [];
    if (!enrolledCourseIds.includes(lesson.courseId)) {
        throw new Error('Access denied. Enroll in the course to complete this lesson.');
    }

    if (!canCompleteLesson(lesson)) {
        throw new Error('Already completed.');
    }

    lesson.completed = true;

    return {
        lessonId,
        learnerId,
        userId: learnerId,
        completed: true,
        status: 'completed',
        completedAt: new Date().toISOString(),
    };
}
