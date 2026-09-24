import type { Course, CourseEnrollment, CourseProgress } from './types.ts';
import { canEnrollCourse } from './domain.ts';

const sampleCourses: Course[] = [
    {
        id: 'course-1',
        title: 'Human-Centered Product Design',
        category: 'Design',
        description: 'Design thinking, empathy, user research and prototyping.',
        status: 'Published',
        enrolled: true,
    },
    {
        id: 'course-2',
        title: 'Data Literacy for Decisions',
        category: 'Data',
        description: 'Interpret charts, metrics, analysis and evidence-based decisions.',
        status: 'Published',
        enrolled: false,
    },
    {
        id: 'course-3',
        title: 'Systems Thinking 101',
        category: 'Systems',
        description: 'Model complex systems and understand root causes.',
        status: 'Published',
        enrolled: false,
    },
];

const requiredLessonCatalog: Record<string, string[]> = {
    'course-1': ['lesson-1', 'lesson-2'],
    'course-2': ['lesson-3', 'lesson-4'],
    'course-3': ['lesson-5', 'lesson-6'],
};

const requiredAssignmentCatalog: Record<string, string[]> = {
    'course-1': ['assignment-1'],
    'course-2': ['assignment-2'],
    'course-3': ['assignment-3'],
};

const activeEnrollments: CourseEnrollment[] = [
    {
        id: 'enrollment-course-1-learner-1',
        courseId: 'course-1',
        userId: 'learner-1',
        status: 'Active',
        createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    },
];

export async function getCourses(filters: { category?: string; q?: string } = {}): Promise<Course[]> {
    const category = filters.category?.trim().toLowerCase() ?? '';
    const query = filters.q?.trim().toLowerCase() ?? '';

    return sampleCourses.filter((course) => {
        if (course.status !== 'Published') {
            return false;
        }

        if (category && course.category.toLowerCase() !== category) {
            return false;
        }

        if (!query) {
            return true;
        }

        const haystack = `${course.title} ${course.category} ${course.description}`.toLowerCase();
        return haystack.includes(query);
    });
}

export async function getCourseProgress(
    courseId: string,
    learnerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        enrolledCourseIds?: string[];
        completedLessonIds?: string[];
    } = {},
): Promise<CourseProgress> {
    const requestedRole = context.userRole ?? 'Learner';
    if (requestedRole !== 'Learner') {
        throw new Error('Only Learners can view progress.');
    }

    const enrolledCourseIds = context.enrolledCourseIds ?? [];
    if (!enrolledCourseIds.includes(courseId)) {
        throw new Error('Access denied. Enroll in the course to view progress.');
    }

    const course = sampleCourses.find((item) => item.id === courseId);
    if (!course) {
        throw new Error('Course not found.');
    }

    const lessonIds = requiredLessonCatalog[courseId] ?? [];
    const completedSet = new Set(context.completedLessonIds ?? []);

    const lessonStatuses: import('./types.ts').LessonStatus[] = lessonIds.map((lessonId) => ({
        lessonId,
        status: completedSet.has(lessonId) ? 'completed' : 'incomplete',
    }));

    const completedItems = lessonStatuses.filter((entry) => entry.status === 'completed').length;
    const totalItems = lessonStatuses.length;
    const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    return {
        courseId,
        totalItems,
        completedItems,
        percentage,
        isCompleted: totalItems > 0 && completedItems === totalItems,
        lessonStatuses,
    };
}

export async function evaluateCourseCompletion(
    courseId: string,
    learnerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        enrolledCourseIds?: string[];
        completedLessonIds?: string[];
        submittedAssignmentIds?: string[];
    } = {},
): Promise<CourseProgress & { isCompleted: boolean }> {
    const requestedRole = context.userRole ?? 'Learner';
    if (requestedRole !== 'Learner') {
        throw new Error('Only Learners can evaluate course completion.');
    }

    const enrolledCourseIds = context.enrolledCourseIds ?? [];
    if (!enrolledCourseIds.includes(courseId)) {
        throw new Error('Access denied. Enroll in the course to evaluate completion.');
    }

    const lessons = requiredLessonCatalog[courseId] ?? [];
    const assignments = requiredAssignmentCatalog[courseId] ?? [];
    const completedLessons = new Set(context.completedLessonIds ?? []);
    const submittedAssignments = new Set(context.submittedAssignmentIds ?? []);

    const lessonStatuses: import('./types.ts').LessonStatus[] = lessons.map((lessonId) => ({
        lessonId,
        status: completedLessons.has(lessonId) ? 'completed' : 'incomplete',
    }));

    const completedLessonCount = lessonStatuses.filter((item) => item.status === 'completed').length;
    const completedAssignmentCount = assignments.filter((assignmentId) => submittedAssignments.has(assignmentId)).length;
    const totalItems = lessons.length + assignments.length;
    const completedItems = completedLessonCount + completedAssignmentCount;
    const isCompleted = totalItems > 0 && completedItems === totalItems;
    const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    return {
        courseId,
        totalItems,
        completedItems,
        percentage,
        isCompleted,
        lessonStatuses,
    };
}

export async function enrollCourse(
    courseId: string,
    learnerId: string,
    options: { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin' } = {},
): Promise<CourseEnrollment> {
    const requestedRole = options.userRole ?? 'Learner';

    if (requestedRole !== 'Learner') {
        throw new Error('Only learners can enroll.');
    }

    const course = sampleCourses.find((item) => item.id === courseId);

    if (!course) {
        throw new Error('Course not found.');
    }

    const alreadyEnrolled = activeEnrollments.some(
        (enrollment) => enrollment.courseId === courseId && enrollment.userId === learnerId && enrollment.status === 'Active',
    );

    if (alreadyEnrolled) {
        throw new Error('Already enrolled.');
    }

    if (!canEnrollCourse(course)) {
        throw new Error('Course is not available for enrollment.');
    }

    course.enrolled = true;

    const enrollment: CourseEnrollment = {
        id: `enrollment-${courseId}-${learnerId}-${Date.now()}`,
        courseId,
        userId: learnerId,
        status: 'Active',
        createdAt: new Date().toISOString(),
    };

    activeEnrollments.push(enrollment);

    return enrollment;
}
