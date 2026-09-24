import type { UserProfile } from './types.ts';

export function isRoleAllowed(user: UserProfile, allowedRoles: string[]): boolean {
    return allowedRoles.includes(user.role);
}
