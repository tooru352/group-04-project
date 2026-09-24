import type { AuditEvent, UserProfile, UserRole } from './types.ts';

const VALID_ROLES: UserRole[] = ['Learner', 'Instructor', 'Reviewer', 'Admin'];

const sampleUsers: UserProfile[] = [
    { id: 'learner-1', name: 'Alice Learner', email: 'alice@lms.test', role: 'Learner' },
    { id: 'instructor-1', name: 'Bob Instructor', email: 'bob@lms.test', role: 'Instructor' },
    { id: 'reviewer-1', name: 'Carol Reviewer', email: 'carol@lms.test', role: 'Reviewer' },
    { id: 'admin-1', name: 'Diana Admin', email: 'diana@lms.test', role: 'Admin' },
];

const auditEvents: AuditEvent[] = [];

function normalizeRole(value: string): UserRole | null {
    const normalized = value.trim().toUpperCase();
    const mapping: Record<string, UserRole> = {
        LEARNER: 'Learner',
        INSTRUCTOR: 'Instructor',
        REVIEWER: 'Reviewer',
        ADMIN: 'Admin',
    };

    return mapping[normalized] ?? null;
}

export function getAuditEvents(): AuditEvent[] {
    return [...auditEvents];
}

export async function getUsers(): Promise<UserProfile[]> {
    return sampleUsers.map((user) => ({ ...user }));
}

export async function updateUserRole(
    targetUserId: string,
    nextRole: string,
    context: { actorId: string; actorRole: UserRole },
): Promise<UserProfile> {
    if (context.actorRole !== 'Admin') {
        throw new Error('Only Admin users can update roles.');
    }

    const user = sampleUsers.find((candidate) => candidate.id === targetUserId);
    if (!user) {
        throw new Error('User not found.');
    }

    const parsedRole = normalizeRole(nextRole);
    if (!parsedRole || !VALID_ROLES.includes(parsedRole)) {
        throw new Error('Invalid role value.');
    }

    const isSelfDemotion = context.actorId === targetUserId && user.role === 'Admin' && parsedRole !== 'Admin';
    const adminCount = sampleUsers.filter((candidate) => candidate.role === 'Admin').length;

    if (isSelfDemotion && adminCount <= 1) {
        throw new Error('Cannot remove the last admin.');
    }

    const previousRole = user.role;
    user.role = parsedRole;

    auditEvents.push({
        adminId: context.actorId,
        targetUserId,
        oldRole: previousRole,
        newRole: parsedRole,
        timestamp: new Date().toISOString(),
    });

    return { ...user };
}
