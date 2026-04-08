"use client";

import React, { useMemo } from 'react';
import { getFirstDayOfMonth } from '@/lib';

interface CalendarProps {
  year: number;
  month: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  selection: Date[];
  setSelection: React.Dispatch<React.SetStateAction<Date[]>>;
  hoveredDate: Date | null;
  setHoveredDate: React.Dispatch<React.SetStateAction<Date | null>>;
  mousePos: { x: number, y: number };
  gridRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const gridCells = Array.from({ length: 42 }, (_, index) => index);

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  onNextMonth,
  onPrevMonth,
  selection,
  setSelection,
  hoveredDate,
  setHoveredDate,
  mousePos,
  gridRef,
  onMouseMove,
  onMouseLeave
}) => {
  const displayHeaderDate = selection.length === 1 ? selection[0] : new Date();

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

  return (
    <div className="w-full bg-[#f8f9f7] p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 md:col-span-7 md:col-start-6 md:row-start-1 md:row-span-2 self-start">
      <div className="flex justify-between items-end mb-6 px-2">
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
            onClick={onPrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#114232] hover:bg-gray-100 transition-colors bg-white shadow-sm"
            aria-label="Previous Month"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={onNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-[#114232] hover:bg-gray-100 transition-colors bg-white shadow-sm"
            aria-label="Next Month"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[14px] h-[14px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-2 mb-4 text-center pb-2">
        <span className="text-sm font-bold tracking-widest text-[#396253] uppercase bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
        </span>
      </div>

      <div 
        ref={gridRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', 
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
  );
};

export default Calendar;