import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WordList } from './components/WordList';
import { Flashcard } from './components/Flashcard';
import { Quiz } from './components/Quiz';
import { useVocab } from './hooks/useVocab';
import type { ViewMode } from './types';

function App() {
  const { filteredWords, filters, setFilters, filterOptions } = useVocab();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      <Sidebar filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation / View Switcher */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">HSK</div>
             <h1 className="text-xl font-bold text-gray-800 tracking-tight">Vocabulary Master</h1>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {(['list', 'flashcard', 'quiz'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  viewMode === mode 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            {viewMode === 'list' && <WordList words={filteredWords} />}
            {viewMode === 'flashcard' && <Flashcard words={filteredWords} />}
            {viewMode === 'quiz' && <Quiz words={filteredWords} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
