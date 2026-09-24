import type { AuditEvent, CourseRecord, CourseStatus, UserRole } from './types.ts';
import { getAccessPolicy } from './domain.ts';

const sampleCourses: CourseRecord[] = [
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
    {
        id: 'course-4',
        title: 'Internal Ops Playbook',
        category: 'Operations',
        description: 'Internal policy and process operations.',
        status: 'Draft',
        enrolled: false,
    },
];

const auditEvents: AuditEvent[] = [];

function normalizeAuditFilterDate(value?: string): string | undefined {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : value;
}

const activeEnrollments: { courseId: string; status: string }[] = [
    { courseId: 'course-1', status: 'Active' },
    { courseId: 'course-2', status: 'Active' },
];

export async function getRoleAccess(role: UserRole) {
    return getAccessPolicy(role);
}

export async function getAdminCourses(): Promise<CourseRecord[]> {
    return sampleCourses.map((course) => ({ ...course }));
}

export async function updateCourse(
    courseId: string,
    patch: Partial<{ title: string; category: string; status: CourseStatus }>,
    context: { actorId: string; actorRole: UserRole },
): Promise<CourseRecord> {
    if (context.actorRole !== 'Admin') {
        throw new Error('Only Admin users can manage courses.');
    }

    const course = sampleCourses.find((entry) => entry.id === courseId);
    if (!course) {
        throw new Error('Course not found.');
    }

    const nextStatus = patch.status ?? course.status;
    if (!['Draft', 'Published', 'Archived'].includes(nextStatus)) {
        throw new Error('Invalid course status.');
    }

    if (nextStatus === 'Archived' && activeEnrollments.some((enrollment) => enrollment.courseId === courseId && enrollment.status === 'Active')) {
        throw new Error('Cannot archive a course with active enrollments.');
    }

    if (patch.title !== undefined) {
        const trimmedTitle = patch.title.trim();
        if (!trimmedTitle) {
            throw new Error('Course title cannot be empty.');
        }
        course.title = trimmedTitle;
    }

    if (patch.category !== undefined) {
        const trimmedCategory = patch.category.trim();
        if (!trimmedCategory) {
            throw new Error('Course category cannot be empty.');
        }
        course.category = trimmedCategory;
    }

    if (patch.status !== undefined) {
        course.status = patch.status;
    }

    auditEvents.push({
        adminId: context.actorId,
        courseId,
        action: 'update',
        timestamp: new Date().toISOString(),
    });

    return { ...course };
}

export function getAuditEvents(): AuditEvent[] {
    return [...auditEvents];
}

export function getAuditTrail(
    filters: {
        actorId?: string;
        action?: string;
        from?: string;
        to?: string;
    } = {},
    context: { actorRole: UserRole } = { actorRole: 'Admin' },
): Array<{
    id: string;
    actorId: string;
    action: string;
    target: string;
    metadata: Record<string, string | number | boolean | null>;
    createdAt: string;
}> {
    if (context.actorRole !== 'Admin') {
        throw new Error('Only Admin users can query the audit trail.');
    }

    const from = normalizeAuditFilterDate(filters.from);
    const to = normalizeAuditFilterDate(filters.to);

    return auditEvents
        .filter((event) => {
            const actorMatches = !filters.actorId || event.adminId === filters.actorId;
            const actionMatches = !filters.action || event.action === filters.action;
            const fromMatches = !from || new Date(event.timestamp).getTime() >= new Date(from).getTime();
            const toMatches = !to || new Date(event.timestamp).getTime() <= new Date(to).getTime();
            return actorMatches && actionMatches && fromMatches && toMatches;
        })
        .map((event, index) => ({
            id: `audit-${index + 1}`,
            actorId: event.adminId,
            action: event.action,
            target: event.courseId,
            metadata: {
                courseId: event.courseId,
                timestamp: event.timestamp,
            },
            createdAt: event.timestamp,
        }));
}
