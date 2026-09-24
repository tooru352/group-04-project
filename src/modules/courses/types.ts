export type Course = {
    id: string;
    title: string;
    category: string;
    description: string;
    status: 'Draft' | 'Published' | 'Archived';
    enrolled: boolean;
};

export type LessonStatus = {
    lessonId: string;
    status: 'completed' | 'incomplete';
};

export type CourseProgress = {
    courseId: string;
    totalItems: number;
    completedItems: number;
    percentage: number;
    isCompleted?: boolean;
    lessonStatuses: LessonStatus[];
};

export type CourseEnrollment = {
    id: string;
    courseId: string;
    userId: string;
    status: 'Active' | 'Cancelled';
    createdAt: string;
};
