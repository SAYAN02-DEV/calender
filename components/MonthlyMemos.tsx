"use client";

import React, { useState } from 'react';

interface MonthlyMemosProps {
  month: number;
  year: number;
  memos: Memo[];
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>;
  memosLoaded: boolean;
  setHoveredLinkedDate: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface Memo {
  id: string;
  month: number;
  year: number;
  title: string;
  description: string;
  linkedDateStr?: string;
}

const MonthlyMemos: React.FC<MonthlyMemosProps> = ({ month, year, memos, setMemos, memosLoaded, setHoveredLinkedDate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

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

  if (!memosLoaded) return <div className="px-2 min-h-[120px]" />;

  const currentMemos = memos.filter(m => m.month === month && m.year === year);

  return (
    <div className="px-1 w-full">
      <h2 className="text-lg font-serif italic text-[#396253] mb-3 border-b border-gray-200 pb-2 flex justify-between items-baseline">
        Monthly Memos
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-widest text-[#B49B57] uppercase not-italic">
            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center w-5 h-5 rounded-full bg-[#114232] text-white hover:bg-[#0a291f] hover:scale-105 transition-all shadow-sm"
            aria-label={isAdding ? "Cancel Adding" : "Add Memo"}
          >
            {isAdding ? (
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[10px] h-[10px]">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            ) : (
               <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[10px] h-[10px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        </div>
      </h2>

      {isAdding && (
        <form onSubmit={handleAddMemo} className="mb-4 p-3 bg-[#f8f9f7] rounded-xl border border-gray-200 flex flex-col gap-2 shadow-inner">
          <input 
            type="text" 
            placeholder="Memo Title" 
            className="w-full text-xs font-bold text-gray-800 border-b border-gray-300 uppercase focus:outline-none focus:border-[#396253] py-1 bg-transparent placeholder-gray-400"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea 
            placeholder="Description..." 
            className="w-full text-xs text-gray-600 leading-relaxed resize-none focus:outline-none bg-transparent placeholder-gray-400 mt-1"
            rows={2}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 font-semibold transition-colors">Cancel</button>
            <button type="submit" className="text-xs text-white bg-[#114232] hover:bg-[#0a291f] font-semibold px-3 py-1 rounded-lg transition-colors shadow-sm">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '220px' }}>
        {currentMemos.length > 0 ? (
          currentMemos.map((memo) => (
            <div 
              key={memo.id} 
              className="group relative"
              onMouseEnter={() => { if (memo.linkedDateStr) setHoveredLinkedDate(memo.linkedDateStr); }}
              onMouseLeave={() => { if (memo.linkedDateStr) setHoveredLinkedDate(null); }}
            >
              <h3 className="text-xs font-bold text-gray-800 mb-0.5 uppercase pr-5">{memo.title}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">{memo.description}</p>
              <button 
                onClick={() => handleDelete(memo.id)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-0.5 transition-all"
                title="Delete Memo"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-[11px] text-gray-500 italic py-2">No memos for this month. Click + to add one.</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyMemos;