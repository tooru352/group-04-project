import type { UserRole } from './types.ts';

const ROLE_MAP: Record<string, UserRole> = {
    learner: 'Learner',
    instructor: 'Instructor',
    reviewer: 'Reviewer',
    admin: 'Admin',
};

export function isValidRole(role: string): role is UserRole {
    return Object.values(ROLE_MAP).includes(role as UserRole);
}

export function resolveRoleFromSession(
    sessionOrRole?: string | { role?: string } | null,
): UserRole | null {
    const rawValue =
        typeof sessionOrRole === 'string'
            ? sessionOrRole
            : sessionOrRole && typeof sessionOrRole === 'object'
                ? sessionOrRole.role
                : undefined;

    if (!rawValue || typeof rawValue !== 'string') {
        return null;
    }

    const normalized = rawValue.trim();
    if (!normalized) {
        return null;
    }

    const mappedRole = ROLE_MAP[normalized.toLowerCase()];
    return mappedRole ?? null;
}

export function canAccessRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const rolePriority: Record<UserRole, number> = {
        Learner: 1,
        Instructor: 2,
        Reviewer: 2,
        Admin: 3,
    };

    return rolePriority[userRole] >= rolePriority[requiredRole];
}

export function authorizeRouteAccess(
    userRole: UserRole | string | { role?: string } | null | undefined,
    requiredRole: UserRole | string,
): boolean {
    const resolvedUserRole = resolveRoleFromSession(userRole);
    const resolvedRequiredRole = resolveRoleFromSession(requiredRole);

    if (!resolvedUserRole || !resolvedRequiredRole) {
        return false;
    }

    return canAccessRole(resolvedUserRole, resolvedRequiredRole);
}

export function authorizeRequestAccess(params: {
    authHeader?: string;
    userRole?: UserRole | string | { role?: string } | null;
    currentUserId?: string;
    resourceOwnerId?: string;
    requiredRole?: UserRole | string;
}): {
    allowed: boolean;
    status: number;
    error: 'UNAUTHORIZED' | 'FORBIDDEN' | null;
    message: string;
} {
    const tokenPresent = typeof params.authHeader === 'string' && params.authHeader.startsWith('Bearer ');

    if (!tokenPresent) {
        return {
            allowed: false,
            status: 401,
            error: 'UNAUTHORIZED',
            message: 'Authentication required',
        };
    }

    const resolvedUserRole = resolveRoleFromSession(params.userRole);
    const resolvedRequiredRole = resolveRoleFromSession(params.requiredRole ?? 'Learner');

    if (!resolvedUserRole || !resolvedRequiredRole) {
        return {
            allowed: false,
            status: 403,
            error: 'FORBIDDEN',
            message: 'Access denied',
        };
    }

    const roleAllowed = canAccessRole(resolvedUserRole, resolvedRequiredRole);
    const sameOwner = !!params.currentUserId && !!params.resourceOwnerId && params.currentUserId === params.resourceOwnerId;
    const ownershipMismatch = !!params.currentUserId && !!params.resourceOwnerId && params.currentUserId !== params.resourceOwnerId;

    const isUserScopedLearnerRequest =
        resolvedUserRole === 'Learner' &&
        resolvedRequiredRole === 'Learner' &&
        ownershipMismatch;

    if ((!roleAllowed && !sameOwner) || isUserScopedLearnerRequest) {
        return {
            allowed: false,
            status: 403,
            error: 'FORBIDDEN',
            message: 'Access denied',
        };
    }

    return {
        allowed: true,
        status: 200,
        error: null,
        message: 'Authorized',
    };
}
