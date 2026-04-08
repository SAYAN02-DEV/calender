"use client";

import React, { useState, useMemo } from 'react';
import { getFirstDayOfMonth } from '@/lib';
import MonthlyMemos from '@/components/MonthlyMemos';

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
    <div className="max-w-6xl mx-auto my-10 p-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 font-sans bg-white">
      
      {/* Hero Image */}
      <div 
        className="w-full rounded-3xl overflow-hidden bg-gray-200 shadow-sm md:col-span-5 md:col-start-1 md:row-start-1 h-48 md:h-[400px] xl:h-[500px]"
      >
        <img 
          src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop"
          alt="Calendar Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Calendar Section */}
      <div className="w-full bg-[#f8f9f7] p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 md:col-span-7 md:col-start-6 md:row-start-1 md:row-span-2 self-start">
        <div className="flex justify-between items-end mb-12 px-2">
          <div className="flex items-baseline gap-4">
            <div className="text-[5.5rem] font-serif text-[#114232] leading-none tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {String(displayHeaderDate.getDate()).padStart(2, '0')}
            </div>
            <div className="flex flex-col pb-2">
              <div className="text-[10px] font-extrabold tracking-[0.2em] text-[#B49B57] uppercase">
                {displayHeaderDate.toLocaleString('default', { month: 'long' })}
              </div>
              <div className="text-xs italic text-gray-500 font-serif">
                {displayHeaderDate.getFullYear()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4">
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
          backgroundImage: mousePos.x !== -1000 ? `radial-gradient(circle 90px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.1) 0%, transparent 100%)` : 'none',
          padding: '1px'
        }}
      >
      {daysOfWeek.map((day) => (
        <div 
          key={day} 
          style={{ 
            textAlign: 'center', 
            fontSize: '10px',
            fontWeight: '600', 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            paddingBottom: '16px',
            paddingTop: '8px',
            color: '#666',
            backgroundColor: '#f8f9f7'
          }}
        >
          {day.slice(0, 3)}
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
            className={`flex justify-center items-center min-h-[70px] p-2 cursor-pointer transition-colors ${isSel ? 'rounded-xl shadow-md' : 'rounded-lg'}`}
            style={{
              backgroundColor: isSel ? '#114232' : inRange ? '#ecece8' : '#f8f9f7',
              color: isSel ? '#ffffff' : !isCurrentMonthDay ? '#d1d1d1' : '#555',
              fontWeight: isSel || inRange ? '600' : isCurrentMonthDay ? '400' : '300',
              opacity: isSel || isCurrentMonthDay ? 1 : 0.6
            }}
          >
            {String(displayDay).padStart(2, '0')}
          </div>
        );
      })}
      </div>
    </div>
    
      {/* Monthly Memos Layout Block */}
      <MonthlyMemos month={month} year={year} />
    </div>
  );
};

export default CalendarGrid;