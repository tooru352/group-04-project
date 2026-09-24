import type { Lesson } from './types.ts';

export function canCompleteLesson(lesson: Lesson): boolean {
    return !!lesson.content && !lesson.completed;
}

export function progressPercentage(completedCount: number, totalCount: number): number {
    if (totalCount <= 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
}
