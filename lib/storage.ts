"use client";

import { LearningStore, QuizQuestion } from "@/lib/types";

const STORAGE_KEY = "economic-quiz-learning-store-v1";

const defaultStore: LearningStore = {
  attempts: [],
  wrongNotes: {},
  bookmarks: {},
  streak: { current: 0, lastSolvedDate: null }
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getLearningStore(): LearningStore {
  if (!isBrowser()) return defaultStore;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore;
  try {
    return { ...defaultStore, ...JSON.parse(raw) } as LearningStore;
  } catch {
    return defaultStore;
  }
}

export function saveLearningStore(store: LearningStore) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function isSameDay(a: string | null, b: string) {
  return !!a && new Date(a).toDateString() === new Date(b).toDateString();
}

function isYesterday(previous: string | null, current: string) {
  if (!previous) return false;
  const prev = new Date(previous);
  const curr = new Date(current);
  const diff = curr.setHours(0, 0, 0, 0) - prev.setHours(0, 0, 0, 0);
  return diff === 1000 * 60 * 60 * 24;
}

export function recordAttempt(question: QuizQuestion, correct: boolean): LearningStore {
  const store = getLearningStore();
  const now = new Date().toISOString();
  const attempts = [
    {
      questionId: question.id,
      correct,
      submittedAt: now,
      type: question.type,
      difficulty: question.difficulty
    },
    ...store.attempts
  ].slice(0, 500);

  const wrongNotes = { ...store.wrongNotes };
  const current = wrongNotes[question.id];

  if (correct) {
    if (current) {
      wrongNotes[question.id] = { ...current, retryCount: current.retryCount + 1, cleared: true };
    }
  } else {
    wrongNotes[question.id] = current
      ? {
          ...current,
          wrongCount: current.wrongCount + 1,
          retryCount: current.retryCount + 1,
          lastWrongAt: now,
          cleared: false
        }
      : {
          questionId: question.id,
          wrongCount: 1,
          retryCount: 1,
          lastWrongAt: now,
          cleared: false
        };
  }

  let streak = { ...store.streak };
  if (!isSameDay(store.streak.lastSolvedDate, now)) {
    streak = {
      current: isYesterday(store.streak.lastSolvedDate, now) ? store.streak.current + 1 : 1,
      lastSolvedDate: now
    };
  }

  const next = { ...store, attempts, wrongNotes, streak };
  saveLearningStore(next);
  return next;
}

export function toggleBookmark(questionId: string) {
  const store = getLearningStore();
  const bookmarks = { ...store.bookmarks, [questionId]: !store.bookmarks[questionId] };
  saveLearningStore({ ...store, bookmarks });
  return bookmarks;
}

export function getBookmarkedQuestionIds() {
  const store = getLearningStore();
  return Object.entries(store.bookmarks)
    .filter(([, active]) => !!active)
    .map(([questionId]) => questionId);
}

export function areBookmarksActive(questionIds: string[]) {
  const store = getLearningStore();
  if (!questionIds.length) return false;
  return questionIds.every((questionId) => !!store.bookmarks[questionId]);
}

export function toggleBookmarksForQuestions(questionIds: string[]) {
  const store = getLearningStore();
  const shouldBookmark = !questionIds.every((questionId) => !!store.bookmarks[questionId]);
  const bookmarks = { ...store.bookmarks };

  for (const questionId of questionIds) {
    bookmarks[questionId] = shouldBookmark;
  }

  saveLearningStore({ ...store, bookmarks });
  return bookmarks;
}

export function removeWrongNote(questionId: string) {
  const store = getLearningStore();
  const wrongNotes = { ...store.wrongNotes };
  delete wrongNotes[questionId];
  const next = { ...store, wrongNotes };
  saveLearningStore(next);
  return next;
}
