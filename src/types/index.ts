export interface Word {
  hanzi: string;
  pinyin: string;
  english: string;
  categories: string[];
  level: number;
  lesson: number;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz';

export interface FilterState {
  levels: number[];
  lessons: number[];
  topics: string[];
}
