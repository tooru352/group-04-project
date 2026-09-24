export type UserRole = 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';

export type CourseStatus = 'Draft' | 'Published' | 'Archived';

export type CourseRecord = {
    id: string;
    title: string;
    category: string;
    description: string;
    status: CourseStatus;
    enrolled: boolean;
};

export type AuditEvent = {
    id?: string;
    adminId: string;
    courseId: string;
    action: 'update';
    timestamp: string;
    target?: string;
    metadata?: Record<string, string | number | boolean | null>;
};

export type AccessPolicy = {
    role: UserRole;
    canManageUsers: boolean;
    canManageCourses: boolean;
    canGradeSubmissions: boolean;
};
