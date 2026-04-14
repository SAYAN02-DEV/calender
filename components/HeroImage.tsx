import React from 'react';

interface HeroImageProps {
  month?: number;
}

const monthImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=800&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=800&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=800&auto=format&fit=crop",
  5: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=800&auto=format&fit=crop",
  6: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  7: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=800&auto=format&fit=crop",
  8: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?q=80&w=800&auto=format&fit=crop",
  9: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=800&auto=format&fit=crop",
  10: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=800&auto=format&fit=crop",
  11: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=800&auto=format&fit=crop",
  12: "https://images.unsplash.com/photo-1543330091-27228394c7dc?q=80&w=800&auto=format&fit=crop",
};

const HeroImage: React.FC<HeroImageProps> = ({ month = 1 }) => {
  const imageUrl = monthImages[month] || monthImages[1];
  
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gray-200 shadow-sm h-36 md:h-[260px]">
      <img 
        src={imageUrl}
        alt={`Calendar Hero for Month ${month}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default HeroImage;