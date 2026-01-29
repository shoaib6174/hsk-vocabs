import { useState, useMemo } from 'react';
import type { Word, FilterState } from '../types';
import { sampleData } from '../data/sampleData';

export const useVocab = () => {
  const [words, setWords] = useState<Word[]>(sampleData);
  const [filters, setFilters] = useState<FilterState>({
    levels: [],
    lessons: [],
    topics: [],
  });

  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const matchLevel = filters.levels.length === 0 || filters.levels.includes(word.level);
      const matchLesson = filters.lessons.length === 0 || filters.lessons.includes(word.lesson);
      const matchTopic = filters.topics.length === 0 || word.categories.some(cat => filters.topics.includes(cat));
      
      return matchLevel && matchLesson && matchTopic;
    });
  }, [words, filters]);

  const uniqueLevels = useMemo(() => Array.from(new Set(words.map(w => w.level))).sort((a,b) => a-b), [words]);
  const uniqueLessons = useMemo(() => Array.from(new Set(words.map(w => w.lesson))).sort((a,b) => a-b), [words]);
  const uniqueTopics = useMemo(() => {
    const allTopics = new Set<string>();
    words.forEach(w => w.categories.forEach(c => allTopics.add(c)));
    return Array.from(allTopics).sort();
  }, [words]);

  return {
    words,
    setWords,
    filteredWords,
    filters,
    setFilters,
    filterOptions: {
      levels: uniqueLevels,
      lessons: uniqueLessons,
      topics: uniqueTopics
    }
  };
};
