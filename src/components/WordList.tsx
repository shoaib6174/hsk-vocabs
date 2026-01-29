import React, { useState } from 'react';
import type { Word } from '../types';

export const WordList: React.FC<{ words: Word[] }> = ({ words }) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);

  if (words.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <p className="text-xl font-medium">No words found</p>
      <p>Try adjusting your filters</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-20 md:pb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Vocabulary List</h2>
        <div className="flex gap-6 w-full md:w-auto">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showPinyin} onChange={() => setShowPinyin(!showPinyin)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
            <span className="text-gray-700">Show Pinyin</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showEnglish} onChange={() => setShowEnglish(!showEnglish)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
            <span className="text-gray-700">Show English</span>
          </label>
        </div>
      </div>
      
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full bg-white divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Hanzi</th>
              {showPinyin && <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Pinyin</th>}
              {showEnglish && <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">English</th>}
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Level</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Lesson</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {words.map((word, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap py-4 px-4 text-lg font-medium text-gray-900">{word.hanzi}</td>
                {showPinyin && <td className="whitespace-nowrap py-4 px-4 text-gray-600">{word.pinyin}</td>}
                {showEnglish && <td className="whitespace-nowrap py-4 px-4 text-gray-600">{word.english}</td>}
                <td className="whitespace-nowrap py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {word.categories.map((cat, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-gray-500">{word.level}</td>
                <td className="whitespace-nowrap py-4 px-4 text-gray-500">{word.lesson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right text-sm text-gray-500">
        Showing {words.length} words
      </div>
    </div>
  );
};
