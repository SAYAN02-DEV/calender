"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { getFirstDayOfMonth } from '@/lib';
import { CalendarEvent } from '@/app/page';

interface CalendarProps {
  year: number;
  month: number;
  selection: Date[];
  setSelection: React.Dispatch<React.SetStateAction<Date[]>>;
  hoveredDate: Date | null;
  setHoveredDate: React.Dispatch<React.SetStateAction<Date | null>>;
  mousePos: { x: number, y: number };
  gridRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const gridCells = Array.from({ length: 42 }, (_, index) => index);

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  selection,
  setSelection,
  hoveredDate,
  setHoveredDate,
  mousePos,
  gridRef,
  onMouseMove,
  onMouseLeave,
  events,
  setEvents
}) => {
  const displayHeaderDate = selection.length === 1 ? selection[0] : new Date();

  // Selected date helpers for event form
  const selectedDate = selection.length === 1 ? selection[0] : null;
  const selectedDateStr = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null;
  const existingEvent = selectedDateStr ? events.find(e => e.dateStr === selectedDateStr) : undefined;

  const [eventTitle, setEventTitle] = useState('');
  const [eventColor, setEventColor] = useState('#3b82f6');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  useEffect(() => {
    if (existingEvent) {
      setEventTitle(existingEvent.title);
      setEventColor(existingEvent.color);
    } else {
      setEventTitle('');
      setEventColor('#3b82f6');
    }
  }, [existingEvent, selectedDateStr]);
  
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr || !eventTitle.trim()) return;

    if (existingEvent) {
      // Update
      setEvents(events.map(ev => ev.id === existingEvent.id ? { ...ev, title: eventTitle, color: eventColor } : ev));
    } else {
      // Create
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        dateStr: selectedDateStr,
        title: eventTitle.trim(),
        color: eventColor
      };
      setEvents([...events, newEvent]);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (existingEvent) {
      setEvents(events.filter(ev => ev.id !== existingEvent.id));
      setEventTitle('');
      setEventColor('#3b82f6');
    }
    setIsEventModalOpen(false);
  };

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
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
      <style global jsx>{`
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
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
          
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const dayEvent = events.find(e => e.dateStr === dateStr);

          // Priority for background: Event color -> Selection -> Range -> Default
          const cellBackground = dayEvent ? dayEvent.color : isSel ? '#114232' : inRange ? '#ecece8' : '#f8f9f7';
          const cellColor = (dayEvent || isSel) ? '#ffffff' : !isCurrentMonthDay ? '#d1d1d1' : '#555';

          return (
            <div 
              key={cellIndex} 
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              className={`group flex flex-col justify-center items-center min-h-[70px] p-2 cursor-pointer transition-all duration-300 relative ${isSel ? 'ring-2 ring-offset-2 ring-[#B49B57] z-10 rounded-xl shadow-md' : 'rounded-lg'} ${dayEvent ? 'hover:scale-[1.3] hover:z-50 hover:shadow-2xl' : ''}`}
              style={{
                backgroundColor: cellBackground,
                color: cellColor,
                fontWeight: isSel || inRange || dayEvent ? '700' : isCurrentMonthDay ? '400' : '300',
                opacity: isSel || isCurrentMonthDay ? 1 : 0.6,
                transform: !dayEvent && isSel ? 'scale(1.05)' : undefined
              }}
            >
              <span className={dayEvent ? "group-hover:-translate-y-2 transition-transform duration-300" : ""}>
                {String(displayDay).padStart(2, '0')}
              </span>
              
              {dayEvent && (
                <>
                  <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-white opacity-70 group-hover:opacity-0 transition-opacity duration-300" />
                  
                  <div className="absolute inset-x-1 bottom-1.5 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none fade-edges">
                    <div className="text-[8px] font-bold tracking-wider text-white whitespace-nowrap px-1">
                      {dayEvent.title.length > 8 ? (
                        <div className="animate-marquee inline-block">
                          {dayEvent.title} <span className="px-3">•</span> {dayEvent.title}
                        </div>
                      ) : (
                        <div className="truncate text-center w-full">{dayEvent.title}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Plust Button for Event Modal shown on hover or when date is selected */}
              <button
                className={`absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-[#114232] flex items-center justify-center shadow-sm hover:scale-110 z-20 transition-all duration-200 ${isSel && selection.length === 1 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!(isSel && selection.length === 1)) {
                    setSelection([date]); // explicitly select this hovered date
                  }
                  setIsEventModalOpen(true); 
                }}
                title="Add or Edit Event"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-[10px] h-[10px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Event Modal (Z-Index Top) */}
      {isEventModalOpen && selectedDateStr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex justify-between items-center mb-6">
              {existingEvent ? 'Edit Event' : 'Add Event'}
              <span className="text-[#396253] text-[10px]">
                {selectedDate!.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </h3>
            
            <form onSubmit={handleSaveEvent} className="flex flex-col gap-5">
              <div className="flex items-center gap-3 bg-[#f8f9f7] p-2 rounded-xl border border-gray-100">
                <input 
                  type="text" 
                  placeholder="Event Title..." 
                  className="flex-1 text-sm font-semibold text-gray-800 border-none px-3 bg-transparent placeholder-gray-400 focus:outline-none"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  autoFocus
                  required
                />
                <input
                  type="color"
                  value={eventColor}
                  onChange={e => setEventColor(e.target.value)}
                  className="w-8 h-8 border-0 p-0 cursor-pointer rounded-full overflow-hidden mr-1"
                  style={{ backgroundColor: 'transparent' }}
                  title="Choose event color"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                {existingEvent ? (
                  <>
                    <button 
                      type="button" 
                      onClick={handleDeleteEvent} 
                      className="text-xs text-red-500 hover:text-red-700 px-4 py-2 font-semibold transition-colors bg-red-50 hover:bg-red-100 rounded-lg mr-auto"
                    >
                      Delete
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEventModalOpen(false)} 
                      className="text-xs text-gray-600 hover:text-gray-800 px-4 py-2 font-semibold transition-colors hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setIsEventModalOpen(false)} 
                    className="text-xs text-gray-600 hover:text-gray-800 px-4 py-2 font-semibold transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg mr-auto"
                  >
                    Cancel
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="text-xs text-white bg-[#114232] hover:bg-[#0a291f] font-semibold px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  {existingEvent ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calendar;