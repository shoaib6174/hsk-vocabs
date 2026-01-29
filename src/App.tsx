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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        filterOptions={filterOptions} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation / View Switcher */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm z-10 gap-4 md:gap-0">
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">HSK</div>
             <h1 className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">Vocab Master</h1>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
            {(['list', 'flashcard', 'quiz'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
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
