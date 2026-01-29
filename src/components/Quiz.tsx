import React, { useState, useEffect } from 'react';
import type { Word } from '../types';

export const Quiz: React.FC<{ words: Word[] }> = ({ words }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Word[]>([]);
  const [quizId, setQuizId] = useState(0); // To trigger re-gen

  // Generate questions
  useEffect(() => {
    if (words.length < 4) return; // need at least 4 for multiple choice
    
    // Shuffle words and pick max 20
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(20, shuffled.length));

    const qs = selected.map(word => {
      // Determine question type: 0: Hanzi->Eng, 1: Eng->Hanzi, 2: Pinyin->Hanzi
      const typeNum = Math.floor(Math.random() * 3);
      const type = typeNum === 0 ? 'hanzi-to-english' : (typeNum === 1 ? 'english-to-hanzi' : 'pinyin-to-hanzi');
      
      let questionText = '';
      let correctAnswer = '';
      
      if (type === 'hanzi-to-english') {
          questionText = word.hanzi;
          correctAnswer = word.english;
      } else if (type === 'english-to-hanzi') {
          questionText = word.english;
          correctAnswer = word.hanzi;
      } else {
          questionText = word.pinyin;
          correctAnswer = word.hanzi;
      }

      // Generate distractors
      const distractors = words
        .filter(w => w !== word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => {
            if (type === 'hanzi-to-english') return w.english;
            if (type === 'english-to-hanzi') return w.hanzi;
            return w.hanzi; // if pinyin->hanzi, options are hanzi
        });

      const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

      return {
        word,
        type,
        questionText,
        correctAnswer,
        options
      };
    });

    setQuestions(qs);
    setCurrentQIndex(0);
    setScore(0);
    setShowResults(false);
    setWrongAnswers([]);
  }, [words, quizId]);

  const handleAnswer = (answer: string) => {
    const currentQ = questions[currentQIndex];
    if (answer === currentQ.correctAnswer) {
      setScore(s => s + 1);
    } else {
      setWrongAnswers(prev => [...prev, currentQ.word]);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
      setQuizId(prev => prev + 1);
  };

  if (words.length < 4) return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <p className="text-xl">Not enough vocabulary to generate a quiz.</p>
        <p className="mt-2">Please adjust your filters to include at least 4 words.</p>
      </div>
  );
  
  if (questions.length === 0) return <div className="text-center mt-20">Loading Quiz...</div>;

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Quiz Complete!</h2>
            <div className={`text-6xl font-black mb-4 ${percentage >= 80 ? 'text-green-500' : (percentage >= 60 ? 'text-yellow-500' : 'text-red-500')}`}>
                {percentage}%
            </div>
            <p className="text-gray-500 text-lg mb-6">You scored {score} out of {questions.length}</p>
            
            <button onClick={restartQuiz} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-transform active:scale-95">Start New Quiz</button>
        </div>
        
        {wrongAnswers.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-gray-700 mb-4 text-xl">Words to Review</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {wrongAnswers.map((w, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50">
                  <div className="flex flex-col">
                      <span className="text-2xl font-bold text-gray-800">{w.hanzi}</span>
                      <span className="text-sm text-gray-500">{w.pinyin}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{w.english}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 mt-4 md:mt-10">
      <div className="mb-2 flex justify-between text-sm font-medium text-gray-400 uppercase tracking-wider">
          <span>Question {currentQIndex + 1} / {questions.length}</span>
          <span>Score: {score}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}></div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-gray-900 mb-2">{currentQ.questionText}</h2>
        <p className="text-gray-500 text-sm">Select the correct translation</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {currentQ.options.map((opt: string, idx: number) => (
          <button 
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="p-5 text-lg bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all font-medium text-left text-gray-700 flex items-center"
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0">
                {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
