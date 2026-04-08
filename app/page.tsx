"use client";

import React, { useState, useEffect } from 'react';
import MonthlyMemos from '@/components/MonthlyMemos';
import Calendar from '@/components/Calendar';
import HeroImage from '@/components/HeroImage';

export interface CalendarEvent {
  id: string;
  dateStr: string;
  title: string;
  color: string;
}

const CalendarGrid: React.FC = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selection, setSelection] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('calendar_events_data');
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse events', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('calendar_events_data', JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-10 p-6 font-sans">
      
      {/* Global Month Navigation */}
      <div className="flex justify-end items-center mb-8 px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#114232] hover:bg-gray-100 transition-colors bg-white shadow-sm"
            aria-label="Previous Month"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#114232] hover:bg-gray-100 transition-colors bg-white shadow-sm"
            aria-label="Next Month"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 bg-white">
        {/* Left Column: Hero & Memos */}
        <div className="flex flex-col gap-8 md:col-span-5 md:col-start-1 md:row-start-1">
          <HeroImage />
          <MonthlyMemos month={month} year={year} />
        </div>

        {/* Calendar Section */}
        <div className="md:col-span-7 md:col-start-6 md:row-start-1 md:row-span-2 self-start flex flex-col gap-6">
          <Calendar 
            year={year}
            month={month}
            selection={selection}
            setSelection={setSelection}
            hoveredDate={hoveredDate}
            setHoveredDate={setHoveredDate}
            mousePos={mousePos}
            gridRef={gridRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            events={events}
            setEvents={setEvents}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;