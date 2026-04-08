"use client";

import React, { useState, useEffect } from 'react';

interface MonthlyMemosProps {
  month: number;
  year: number;
}

interface Memo {
  id: string;
  month: number;
  year: number;
  title: string;
  description: string;
}

const MonthlyMemos: React.FC<MonthlyMemosProps> = ({ month, year }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('monthly_memos_data');
    if (stored) {
      try {
        setMemos(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse memos', e);
      }
    } else {
      // Seed with initial defaults for the current month if local storage is empty
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const defaultMemos: Memo[] = [
        { id: '1', month: currentMonth, year: currentYear, title: 'PRUNING RITUAL', description: 'Begin the light pruning of indoor ferns to encourage spring vitality. Use sterilized tools only.' },
        { id: '2', month: currentMonth, year: currentYear, title: 'BOTANICAL WORKSHOP', description: 'Seasonal arrangement masterclass focusing on dried winter flora and brass accents.' },
        { id: '3', month: currentMonth, year: currentYear, title: 'SOIL ANALYSIS', description: 'Check pH levels for the terrace garden. Prepare mineral infusions for the dormant saplings.' },
      ];
      setMemos(defaultMemos);
      localStorage.setItem('monthly_memos_data', JSON.stringify(defaultMemos));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('monthly_memos_data', JSON.stringify(memos));
    }
  }, [memos, isLoaded]);

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;
    
    const newMemo: Memo = {
      id: Date.now().toString(),
      month,
      year,
      title: newTitle.trim(),
      description: newDescription.trim()
    };
    
    setMemos([...memos, newMemo]);
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setMemos(memos.filter(m => m.id !== id));
  };

  if (!isLoaded) return <div className="px-2 md:col-span-5 md:col-start-1 md:row-start-2 min-h-[200px]" />;

  const currentMemos = memos.filter(m => m.month === month && m.year === year);

  return (
    <div className="px-2 md:col-span-5 md:col-start-1 md:row-start-2">
      <h2 className="text-2xl font-serif italic text-[#396253] mb-6 border-b border-gray-200 pb-2 flex justify-between items-baseline">
        Monthly Memos
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-widest text-[#B49B57] uppercase not-italic">
            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#114232] text-white hover:bg-[#0a291f] hover:scale-105 transition-all shadow-sm"
            aria-label={isAdding ? "Cancel Adding" : "Add Memo"}
            title="Add Memo"
          >
            {isAdding ? (
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            ) : (
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        </div>
      </h2>

      {isAdding && (
        <form onSubmit={handleAddMemo} className="mb-6 p-4 bg-[#f8f9f7] rounded-xl border border-gray-200 flex flex-col gap-3 shadow-inner">
          <input 
            type="text" 
            placeholder="Memo Title (e.g. PRUNING RITUAL)" 
            className="w-full text-sm font-bold text-gray-800 border-b border-gray-300 uppercase focus:outline-none focus:border-[#396253] py-1 bg-transparent placeholder-gray-400"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea 
            placeholder="Description..." 
            className="w-full text-xs text-gray-600 leading-relaxed resize-none focus:outline-none bg-transparent placeholder-gray-400 mt-2"
            rows={3}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 font-semibold transition-colors">Cancel</button>
            <button type="submit" className="text-xs text-white bg-[#114232] hover:bg-[#0a291f] font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-sm">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {currentMemos.length > 0 ? (
          currentMemos.map((memo) => (
            <div key={memo.id} className="group relative">
              <h3 className="text-sm font-bold text-gray-800 mb-1 uppercase pr-6">{memo.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{memo.description}</p>
              <button 
                onClick={() => handleDelete(memo.id)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1 transition-all"
                title="Delete Memo"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[14px] h-[14px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 italic py-4">No memos recorded for this month. Click the + button to add one.</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyMemos;
