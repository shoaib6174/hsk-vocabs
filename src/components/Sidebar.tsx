import React from 'react';
import type { FilterState } from '../types';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filterOptions: {
    levels: number[];
    lessons: number[];
    topics: string[];
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, filterOptions }) => {
  const toggleFilter = <K extends keyof FilterState>(
    key: K, 
    value: FilterState[K][number]
  ) => {
    setFilters(prev => {
      const current = prev[key] as any[];
      const isSelected = current.includes(value);
      const updated = isSelected 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="w-64 bg-gray-50 p-6 h-screen sticky top-0 border-r border-gray-200 shadow-sm flex-shrink-0 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">HSK Level</label>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
          {filterOptions.levels.map(l => (
            <label key={l} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.levels.includes(l)}
                onChange={() => toggleFilter('levels', l)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Level {l}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson</label>
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
          {filterOptions.lessons.map(l => (
            <label key={l} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.lessons.includes(l)}
                onChange={() => toggleFilter('lessons', l)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Lesson {l}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
          {filterOptions.topics.map(t => (
             <label key={t} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.topics.includes(t)}
                onChange={() => toggleFilter('topics', t)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
         <button 
            onClick={() => setFilters({ levels: [], lessons: [], topics: [] })}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700 transition"
         >
           Clear All Filters
         </button>
         <div className="mt-4 text-xs text-gray-500">
            {filters.levels.length > 0 ? `${filters.levels.length} levels` : 'All Levels'} •
            {filters.lessons.length > 0 ? ` ${filters.lessons.length} lessons` : ' All Lessons'} •
            {filters.topics.length > 0 ? ` ${filters.topics.length} topics` : ' All Topics'}
         </div>
      </div>
    </div>
  );
};
