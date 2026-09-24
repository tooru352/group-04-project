export type Lesson = {
    id: string;
    courseId: string;
    title: string;
    duration: string;
    content: string;
    completed: boolean;
    status: 'Published' | 'Draft' | 'Archived';
};

export type LessonProgress = {
    lessonId: string;
    learnerId: string;
    userId?: string;
    completed: boolean;
    status?: 'completed' | 'incomplete';
    completedAt?: string;
};
