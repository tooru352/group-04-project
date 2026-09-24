import type { Course } from './types.ts';

export function canEnrollCourse(course: Course): boolean {
    return course.status === 'Published' && !course.enrolled;
}

export function getCourseProgress(course: Course): number {
    return course.status === 'Published' ? 0 : 100;
}
