import type { AccessPolicy, UserRole } from './types.ts';

export function getAccessPolicy(role: UserRole): AccessPolicy {
    const policies: Record<UserRole, AccessPolicy> = {
        Learner: {
            role,
            canManageUsers: false,
            canManageCourses: false,
            canGradeSubmissions: false,
        },
        Instructor: {
            role,
            canManageUsers: false,
            canManageCourses: true,
            canGradeSubmissions: true,
        },
        Reviewer: {
            role,
            canManageUsers: false,
            canManageCourses: false,
            canGradeSubmissions: true,
        },
        Admin: {
            role,
            canManageUsers: true,
            canManageCourses: true,
            canGradeSubmissions: true,
        },
    };

    return policies[role];
}
