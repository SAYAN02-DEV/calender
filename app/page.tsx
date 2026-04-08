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

export interface Memo {
  id: string;
  month: number;
  year: number;
  title: string;
  description: string;
  linkedDateStr?: string;
}

const CalendarGrid: React.FC = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selection, setSelection] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [memos, setMemos] = useState<Memo[]>([]);
  const [memosLoaded, setMemosLoaded] = useState(false);
  const [hoveredLinkedDate, setHoveredLinkedDate] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('monthly_memos_data');
    if (stored) {
      try {
        setMemos(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse memos', e);
      }
    } else {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const defaultMemos: Memo[] = [
        { id: '1', month: currentMonth, year: currentYear, title: 'PRUNING RITUAL', description: 'Begin the light pruning of indoor ferns to encourage spring vitality. Use sterilized tools only.' },
        { id: '2', month: currentMonth, year: currentYear, title: 'BOTANICAL WORKSHOP', description: 'Seasonal arrangement masterclass focusing on dried winter flora and brass accents.' },
        { id: '3', month: currentMonth, year: currentYear, title: 'SOIL ANALYSIS', description: 'Check pH levels for the terrace garden. Prepare mineral infusions for the dormant saplings.' },
      ];
      setMemos(defaultMemos);
    }
    setMemosLoaded(true);
  }, []);

  useEffect(() => {
    if (memosLoaded) {
      localStorage.setItem('monthly_memos_data', JSON.stringify(memos));
    }
  }, [memos, memosLoaded]);

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
    <div className="w-full max-w-6xl mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 font-sans bg-white">
      
      {/* Left Column: Hero & Memos */}
      <div className="flex flex-col gap-8 md:col-span-5 md:col-start-1 md:row-start-1">
        <HeroImage />
        <MonthlyMemos 
          month={month} 
          year={year} 
          memos={memos}
          setMemos={setMemos}
          memosLoaded={memosLoaded}
          setHoveredLinkedDate={setHoveredLinkedDate}
        />
      </div>

      {/* Calendar Section */}
      <div className="md:col-span-7 md:col-start-6 md:row-start-1 md:row-span-2 self-start flex flex-col gap-6">
        <Calendar 
          year={year}
          month={month}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
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
          setMemos={setMemos}
          hoveredLinkedDate={hoveredLinkedDate}
        />
      </div>
    </div>
  );
};

export default CalendarGrid;