import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div 
      className="w-full rounded-3xl overflow-hidden bg-gray-200 shadow-sm h-48 md:h-[400px] xl:h-[500px]"
    >
      <img 
        src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop"
        alt="Calendar Hero"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default HeroImage;