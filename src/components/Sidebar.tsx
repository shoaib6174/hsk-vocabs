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
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, filterOptions, isOpen, onClose }) => {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 p-6 h-full border-r border-gray-200 shadow-sm 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      
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
    </>
  );
};
