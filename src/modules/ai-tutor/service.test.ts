import test from 'node:test';
import assert from 'node:assert/strict';

import { askTutor } from './service.ts';

test('askTutor returns a grounded answer and references when the learner is enrolled and context is valid', async () => {
    const result = await askTutor(
        { lessonId: 'lesson-1', learnerId: 'learner-1', question: 'How do empathy and user insight shape the journey map?' },
        'This lesson covers empathy, user needs, and journey mapping for product design.',
        { userRole: 'Learner', enrolledLessonIds: ['lesson-1'] },
    );

    assert.equal(result.status, 'success');
    assert.match(result.answer, /empathy|journey/i);
    assert.ok(Array.isArray(result.references));
    assert.ok(result.references.some((reference) => reference.lessonId === 'lesson-1' && reference.snippet.toLowerCase().includes('empathy')));
});

test('askTutor rejects empty questions before any model call', async () => {
    await assert.rejects(
        () => askTutor(
            { lessonId: 'lesson-1', learnerId: 'learner-1', question: '   ' },
            'This lesson covers empathy and user needs.',
            { userRole: 'Learner', enrolledLessonIds: ['lesson-1'] },
        ),
        /Question is required\./,
    );
});

test('askTutor denies non-enrolled learners', async () => {
    await assert.rejects(
        () => askTutor(
            { lessonId: 'lesson-1', learnerId: 'learner-99', question: 'What is the major idea?' },
            'This lesson covers empathy and user needs.',
            { userRole: 'Learner', enrolledLessonIds: [] },
        ),
        /Access denied\. Enroll in the course to ask the tutor\./,
    );
});

test('askTutor returns insufficient_context when the lesson context is unrelated to the question', async () => {
    const result = await askTutor(
        { lessonId: 'lesson-4', learnerId: 'learner-1', question: 'What is the capital of France?' },
        'This lesson covers only product design heuristics and not geography or history.',
        { userRole: 'Learner', enrolledLessonIds: ['lesson-4'] },
    );

    assert.equal(result.status, 'insufficient_context');
    assert.equal(result.answer, 'KHÔNG ĐỦ DỮ LIỆU');
    assert.deepEqual(result.references, []);
});

test('askTutor rephrases content for an explain intent using lesson context only', async () => {
    const result = await askTutor(
        { lessonId: 'lesson-1', learnerId: 'learner-1', question: 'Explain empathy in simple words.', intent: 'explain' },
        'Empathy means understanding user needs from their perspective. Journey mapping connects those needs to pain points and opportunities.',
        { userRole: 'Learner', enrolledLessonIds: ['lesson-1'] },
    );

    assert.equal(result.status, 'success');
    assert.match(result.answer, /empathy|user needs|journey/i);
    assert.ok(result.references.some((reference) => reference.lessonId === 'lesson-1'));
});

test('askTutor creates a grounded example for an example intent', async () => {
    const result = await askTutor(
        { lessonId: 'lesson-1', learnerId: 'learner-1', question: 'Give me an example of empathy in design.', intent: 'example' },
        'Empathy means understanding user needs from their perspective. Journey mapping connects those needs to pain points and opportunities.',
        { userRole: 'Learner', enrolledLessonIds: ['lesson-1'] },
    );

    assert.equal(result.status, 'success');
    assert.match(result.answer, /example|user needs|pain point|empathy/i);
    assert.ok(result.references.some((reference) => reference.lessonId === 'lesson-1'));
});
