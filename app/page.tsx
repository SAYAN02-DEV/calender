"use client";

import React, { useState, useMemo } from 'react';
import { getFirstDayOfMonth } from '@/lib';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const gridCells = Array.from({ length: 42 }, (_, index) => index);

const CalendarGrid: React.FC = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

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

  const [selection, setSelection] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const displayHeaderDate = selection.length === 1 
    ? selection[0] 
    : new Date();

  const handleDateClick = (date: Date) => {
    if (selection.length === 0 || selection.length === 2) {
      setSelection([date]);
    } else if (selection.length === 1) {
      if (date.getTime() === selection[0].getTime()) {
        setSelection([]);
      } else {
        const [start, end] = [selection[0], date].sort((a, b) => a.getTime() - b.getTime());
        setSelection([start, end]);
      }
    }
  };

  const isSelected = (date: Date) => {
    return selection.some((d) => d.getTime() === date.getTime());
  };

  const isInRange = (date: Date) => {
    if (selection.length === 2) {
      return date.getTime() >= selection[0].getTime() && date.getTime() <= selection[1].getTime();
    }
    if (selection.length === 1 && hoveredDate) {
      const [start, end] = [selection[0], hoveredDate].sort((a, b) => a.getTime() - b.getTime());
      return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
    }
    return false;
  };

  const calendarDays = useMemo(() => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    return gridCells.map((cellIndex) => {
      const dayNumber = cellIndex - firstDay + 1;
      const isCurrentMonthDay = dayNumber > 0 && dayNumber <= daysInMonth;

      let displayDay: number;
      let date: Date;

      if (dayNumber <= 0) {
        displayDay = daysInPrevMonth + dayNumber;
        date = new Date(year, month - 2, displayDay);
      } else if (dayNumber > daysInMonth) {
        displayDay = dayNumber - daysInMonth;
        date = new Date(year, month, displayDay);
      } else {
        displayDay = dayNumber;
        date = new Date(year, month - 1, displayDay);
      }

      return { cellIndex, isCurrentMonthDay, displayDay, date };
    });
  }, [year, month]);

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
    <div className="max-w-5xl mx-auto my-5 p-4 flex flex-col md:flex-row gap-8 font-sans">
      {/* Hero Image */}
      <div 
        className="w-full md:w-1/3 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200"
        style={{ minHeight: '300px' }}
      >
        <img 
          src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop"
          alt="Calendar Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Calendar Section */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-end mb-8 px-4">
          <div className="flex items-baseline gap-3">
            <div className="text-7xl font-serif text-[#114232] leading-none" style={{ fontFamily: 'Georgia, serif' }}>
              {String(displayHeaderDate.getDate()).padStart(2, '0')}
            </div>
            <div className="flex flex-col pb-1">
              <div className="text-[11px] font-bold tracking-widest text-[#B49B57] uppercase">
                {displayHeaderDate.toLocaleString('default', { month: 'long' })}
              </div>
              <div className="text-sm italic text-gray-500">
                {displayHeaderDate.getFullYear()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2">
            <button 
              onClick={handlePrevMonth}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-[#114232] hover:bg-gray-50 transition-colors"
              aria-label="Previous Month"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-[#114232] hover:bg-gray-50 transition-colors"
              aria-label="Next Month"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      <div 
        ref={gridRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '1px',
          width: '100%',
          backgroundColor: 'transparent',
          backgroundImage: mousePos.x !== -1000 ? `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.3) 0%, transparent 100%)` : 'none',
          padding: '1px'
        }}
      >
      {daysOfWeek.map((day) => (
        <div 
          key={day} 
          style={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            paddingBottom: '8px',
            paddingTop: '8px',
            color: '#333',
            backgroundColor: '#ffffff'
          }}
        >
          {day}
        </div>
      ))}
      {calendarDays.map(({ cellIndex, isCurrentMonthDay, displayDay, date }) => {
        const isSel = isSelected(date);
        const inRange = isInRange(date);

        return (
          <div 
            key={cellIndex} 
            onClick={() => handleDateClick(date)}
            onMouseEnter={() => setHoveredDate(date)}
            className="flex justify-center items-center min-h-[80px] p-2 cursor-pointer transition-colors"
            style={{
              backgroundColor: isSel ? '#114232' : inRange ? '#eef2f0' : '#ffffff',
              color: isSel ? '#ffffff' : !isCurrentMonthDay ? '#ccc' : '#333',
              fontWeight: isSel || inRange ? 'bold' : isCurrentMonthDay ? 'normal' : 'lighter'
            }}
          >
            {displayDay}
          </div>
        );
      })}
      </div>
    </div>
    </div>
  );
};

export default CalendarGrid;