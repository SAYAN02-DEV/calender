import React from 'react';

const CalendarGrid: React.FC = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const gridCells = Array.from({ length: 42 }, (_, index) => index);

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '8px',
        width: '100%',
        maxWidth: '800px',
        margin: '20px auto',
        fontFamily: 'sans-serif'
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
      {gridCells.map((cellIndex) => (
        <div 
          key={cellIndex} 
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            minHeight: '80px',
            padding: '8px',
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#888'
          }}
        >
          {cellIndex + 1}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;