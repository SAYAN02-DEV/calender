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

  const calendarDays = useMemo(() => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    return gridCells.map((cellIndex) => {
      const dayNumber = cellIndex - firstDay + 1;
      const isCurrentMonthDay = dayNumber > 0 && dayNumber <= daysInMonth;

      let displayDay: number;
      if (dayNumber <= 0) {
        displayDay = daysInPrevMonth + dayNumber;
      } else if (dayNumber > daysInMonth) {
        displayDay = dayNumber - daysInMonth;
      } else {
        displayDay = dayNumber;
      }

      return { cellIndex, isCurrentMonthDay, displayDay };
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={handlePrevMonth}
          style={{ padding: '8px 12px', fontSize: '16px', cursor: 'pointer' }}
        >
          &lt;
        </button>
        <select 
          value={month} 
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input 
          type="number" 
          value={year} 
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ padding: '8px', fontSize: '16px', width: '100px' }}
        />
        <button 
          onClick={handleNextMonth}
          style={{ padding: '8px 12px', fontSize: '16px', cursor: 'pointer' }}
        >
          &gt;
        </button>
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
      {calendarDays.map(({ cellIndex, isCurrentMonthDay, displayDay }) => (
        <div 
          key={cellIndex} 
          className="flex justify-center items-center min-h-[80px] p-2 cursor-default"
          style={{
            backgroundColor: '#ffffff',
            color: isCurrentMonthDay ? '#333' : '#ccc',
            fontWeight: isCurrentMonthDay ? 'normal' : 'lighter'
          }}
        >
          {displayDay}
        </div>
      ))}
      </div>
    </div>
    </div>
  );
};

export default CalendarGrid;