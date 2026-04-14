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

export interface RangeEvent {
  id: string;
  startDateStr: string;
  endDateStr: string;
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
  const [rangeEvents, setRangeEvents] = useState<RangeEvent[]>([]);
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
      setMemos([]);
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
    const storedRange = localStorage.getItem('calendar_range_events_data');
    if (storedRange) {
      try {
        setRangeEvents(JSON.parse(storedRange));
      } catch (e) {
        console.error('Failed to parse range events', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('calendar_events_data', JSON.stringify(events));
      localStorage.setItem('calendar_range_events_data', JSON.stringify(rangeEvents));
    }
  }, [events, rangeEvents, isLoaded]);

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
    <div className="w-full max-w-3xl mx-auto my-4 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 md:grid-rows-[auto_1fr] gap-4 md:gap-x-6 md:gap-y-4 font-sans bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 items-start">
      
      {/* Hero Image */}
      <div className="order-1 md:order-none md:col-span-4 md:col-start-1 md:row-start-1">
        <HeroImage month={month} />
      </div>

      {/* Calendar Section */}
      <div className="order-2 md:order-none md:col-span-8 md:col-start-5 md:row-start-1 md:row-span-2 self-start flex flex-col gap-4">
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
          rangeEvents={rangeEvents}
          setRangeEvents={setRangeEvents}
          setMemos={setMemos}
          hoveredLinkedDate={hoveredLinkedDate}
        />
      </div>

      {/* Monthly Memos */}
      <div className="order-3 md:order-none md:col-span-4 md:col-start-1 md:row-start-2 self-start flex flex-col">
        <MonthlyMemos 
          month={month} 
          year={year} 
          memos={memos}
          setMemos={setMemos}
          memosLoaded={memosLoaded}
          setHoveredLinkedDate={setHoveredLinkedDate}
        />
      </div>
    </div>
  );
};

export default CalendarGrid;