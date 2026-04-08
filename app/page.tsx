"use client";

import React, { useState, useMemo } from 'react';
import { getFirstDayOfMonth } from '@/lib';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const gridCells = Array.from({ length: 42 }, (_, index) => index);

const CalendarGrid: React.FC = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

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
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '8px',
          width: '100%'
        }}
      >
      {daysOfWeek.map((day) => (
        <div 
          key={day} 
          style={{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            paddingBottom: '8px',
            color: '#333'
          }}
        >
          {day}
        </div>
      ))}
      {calendarDays.map(({ cellIndex, isCurrentMonthDay, displayDay }) => (
        <div 
          key={cellIndex} 
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            minHeight: '80px',
            padding: '8px',
            backgroundColor: isCurrentMonthDay ? '#fff' : '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: isCurrentMonthDay ? '#333' : '#ccc',
            fontWeight: isCurrentMonthDay ? 'normal' : 'lighter'
          }}
        >
          {displayDay}
        </div>
      ))}
    </div>
    </div>
  );
};

export default CalendarGrid;