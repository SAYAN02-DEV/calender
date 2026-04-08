import React from 'react';

const CalendarGrid: React.FC = () => {
  // Create an array of 42 dummy items to represent our grid slots (7 columns x 6 rows)
  const gridCells = Array.from({ length: 42 }, (_, index) => index);

  return (
    <div 
      style={{
        // This is the magic that creates the 7 columns
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '8px', // Space between the boxes
        width: '100%',
        maxWidth: '800px',
        margin: '20px auto',
        fontFamily: 'sans-serif'
      }}
    >
      {gridCells.map((cellIndex) => (
        <div 
          key={cellIndex} 
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            minHeight: '80px', // Gives the boxes some calendar-like height
            padding: '8px',
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#888'
          }}
        >
          {/* We will replace this with actual dates later */}
          {cellIndex + 1}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;