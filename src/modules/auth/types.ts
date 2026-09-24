export type UserRole = 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';

export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthSession = {
    userId: string;
    role: UserRole;
    token: string;
    expiresAt: string;
};

export type AuthUserRecord = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
};
