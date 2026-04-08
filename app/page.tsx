"use client";

import React, { useState } from 'react';
import MonthlyMemos from '@/components/MonthlyMemos';
import Calendar from '@/components/Calendar';
import HeroImage from '@/components/HeroImage';

const CalendarGrid: React.FC = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selection, setSelection] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

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
        <MonthlyMemos month={month} year={year} />
      </div>

      {/* Calendar Section */}
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
      />
    </div>
  );
};

export default CalendarGrid;