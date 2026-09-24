import crypto from 'node:crypto';

import type { AuthSession, AuthUserRecord, LoginRequest } from './types.ts';
import { isValidRole } from './domain.ts';

const seedUsers: AuthUserRecord[] = [
    {
        id: 'learner-1',
        name: 'Alice Learner',
        email: 'alice@lms.test',
        role: 'Learner',
        passwordHash: hashPassword('learner123'),
    },
    {
        id: 'instructor-1',
        name: 'Bob Instructor',
        email: 'bob@lms.test',
        role: 'Instructor',
        passwordHash: hashPassword('instructor123'),
    },
    {
        id: 'reviewer-1',
        name: 'Carol Reviewer',
        email: 'carol@lms.test',
        role: 'Reviewer',
        passwordHash: hashPassword('reviewer123'),
    },
    {
        id: 'admin-1',
        name: 'Diana Admin',
        email: 'diana@lms.test',
        role: 'Admin',
        passwordHash: hashPassword('admin123'),
    },
];

function hashPassword(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function verifyPassword(candidate: string, storedHash: string): boolean {
    return hashPassword(candidate) === storedHash;
}

function getUserByEmail(email: string): AuthUserRecord | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    return seedUsers.find((user) => user.email.toLowerCase() === normalizedEmail);
}

export async function loginUser(request: LoginRequest): Promise<AuthSession> {
    const normalizedEmail = request.email?.trim() ?? '';
    const password = request.password ?? '';

    if (!normalizedEmail || !password) {
        throw new Error('Email and password are required.');
    }

    const user = getUserByEmail(normalizedEmail);

    if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new Error('Invalid credentials.');
    }

    if (!isValidRole(user.role)) {
        throw new Error('User role is invalid.');
    }

    return {
        userId: user.id,
        role: user.role,
        token: `lms-token-${crypto.randomUUID()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
}
