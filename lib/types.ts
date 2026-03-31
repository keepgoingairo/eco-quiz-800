export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple_choice" | "short_answer";

export type RelatedNewsItem = {
  title: string;
  summary: string;
  source: string;
  url: string;
};

export type QuizQuestion = {
  id: string;
  term: string;
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  choices?: string[];
  answer: string;
  acceptableAnswers?: string[];
  hint: string;
  explanation: {
    summary: string;
    why: string;
    example: string;
    newsPoint: string;
  };
  wrongChoiceExplanations?: Record<string, string>;
  relatedSearchTerms?: string[];
  relatedNews: RelatedNewsItem[];
};

export type StudyMode =
  | "all"
  | "multiple_only"
  | "short_only"
  | "mistakes"
  | "bookmarks"
  | "today10";

export type AttemptLog = {
  questionId: string;
  correct: boolean;
  submittedAt: string;
  type: QuestionType;
  difficulty: Difficulty;
};

export type WrongNoteEntry = {
  questionId: string;
  wrongCount: number;
  retryCount: number;
  lastWrongAt: string;
  cleared: boolean;
};

export type LearningStore = {
  attempts: AttemptLog[];
  wrongNotes: Record<string, WrongNoteEntry>;
  bookmarks: Record<string, boolean>;
  streak: {
    current: number;
    lastSolvedDate: string | null;
  };
};

export type QuizFilter = {
  mode?: StudyMode;
  type?: QuestionType | "all";
  difficulty?: Difficulty | "all";
  category?: string | "all";
  term?: string;
  wrongOnly?: boolean;
};

export type GlossaryEntry = {
  term: string;
  category: string;
  oneLine: string;
  easyDescription: string;
  relatedKeywords?: string[];
  relatedNews: RelatedNewsItem[];
  quizCount: number;
  difficulties: Difficulty[];
};
