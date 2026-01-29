import React, { useState, useEffect, useCallback } from 'react';
import type { Word } from '../types';

export const Flashcard: React.FC<{ words: Word[] }> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontSide, setFrontSide] = useState<'hanzi' | 'pinyin' | 'english'>('hanzi');
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayWords, setDisplayWords] = useState<Word[]>(words);

  // Handle words update and shuffling
  useEffect(() => {
    let newWords = [...words];
    if (isShuffled) {
      // Fisher-Yates shuffle
      for (let i = newWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
      }
    }
    setDisplayWords(newWords);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words, isShuffled]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % displayWords.length);
    }, 150); // slight delay for visual smoothness
  }, [displayWords.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex(prev => (prev - 1 + displayWords.length) % displayWords.length);
    }, 150);
  }, [displayWords.length]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return; // ignore if focusing inputs
      
      if (e.key === ' ' || e.key === 'Enter') {
        setIsFlipped(prev => !prev);
        e.preventDefault(); // prevent page scroll
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (displayWords.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-xl">No words match filtering criteria</p>
    </div>
  );

  const currentWord = displayWords[currentIndex];
  // Determine front and back content
  let frontContent: React.ReactNode = '';
  let backContent: React.ReactNode = '';

  if (frontSide === 'hanzi') {
    frontContent = currentWord.hanzi;
    backContent = (
      <div className="text-center">
        <div className="text-xl md:text-2xl mb-2 md:mb-4 text-blue-600 font-medium">{currentWord.pinyin}</div>
        <div className="text-2xl md:text-3xl text-gray-900 font-bold break-words">{currentWord.english}</div>
      </div>
    );
  } else if (frontSide === 'english') {
    frontContent = currentWord.english;
    backContent = (
      <div className="text-center">
        <div className="text-4xl md:text-5xl mb-2 md:mb-4 font-bold text-gray-900">{currentWord.hanzi}</div>
        <div className="text-xl md:text-2xl text-blue-600 font-medium">{currentWord.pinyin}</div>
      </div>
    );
  } else {
    // pinyin
    frontContent = currentWord.pinyin;
    backContent = (
      <div className="text-center">
        <div className="text-4xl md:text-5xl mb-2 md:mb-4 font-bold text-gray-900">{currentWord.hanzi}</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 break-words">{currentWord.english}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 h-full bg-gray-50">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
             <span className="text-sm font-medium text-gray-700 mr-2">Show first:</span>
             <div className="flex space-x-1">
                {(['hanzi', 'pinyin', 'english'] as const).map(side => (
                    <button
                      key={side}
                      onClick={() => { setFrontSide(side); setIsFlipped(false); }}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                         frontSide === side 
                         ? 'bg-blue-600 text-white' 
                         : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {side}
                    </button>
                ))}
             </div>
          </div>
          
          <label className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors hover:bg-gray-50 select-none">
            <input 
              type="checkbox" 
              checked={isShuffled} 
              onChange={() => setIsShuffled(!isShuffled)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm font-medium text-gray-700">Shuffle</span>
          </label>
        </div>
        <span className="text-gray-400 text-sm">{currentIndex + 1} of {displayWords.length}</span>
      </div>

      <div 
        className="group relative w-full max-w-sm md:max-w-2xl h-64 md:h-96 perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
           {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white shadow-xl rounded-xl flex flex-col items-center justify-center border border-gray-100 hover:shadow-2xl transition-shadow p-6">
             <div className="text-4xl md:text-6xl font-bold text-gray-800 text-center break-words w-full">{frontContent}</div>
             <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                {currentWord.categories.map((cat, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold uppercase tracking-wide">
                    {cat}
                  </span>
                ))}
            </div>
             <div className="absolute bottom-4 text-xs md:text-sm text-gray-400 font-medium tracking-wide">Click card or Space to flip</div>
          </div>
          
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white shadow-xl rounded-xl flex flex-col items-center justify-center border-2 border-blue-500 p-6">
             <div className="w-full">{backContent}</div>
             <div className="absolute bottom-4 text-xs md:text-sm text-gray-400 font-medium tracking-wide">Press Arrows for Next/Prev</div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex gap-4 md:gap-6 w-full justify-center max-w-sm md:max-w-none">
        <button onClick={handlePrev} className="flex-1 md:flex-none px-4 py-3 md:px-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm text-gray-700 font-medium active:scale-95 transition-transform">Previous</button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="flex-1 md:flex-none px-4 py-3 md:px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium active:scale-95 transition-transform whitespace-nowrap">Flip</button>
        <button onClick={handleNext} className="flex-1 md:flex-none px-4 py-3 md:px-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm text-gray-700 font-medium active:scale-95 transition-transform">Next</button>
      </div>
    </div>
  );
};
