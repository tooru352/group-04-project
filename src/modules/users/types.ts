export type UserRole = 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

export type AuditEvent = {
    adminId: string;
    targetUserId: string;
    oldRole: UserRole;
    newRole: UserRole;
    timestamp: string;
};
