import React from 'react';
import { SECTORS } from '../data/constants';

const Sidebar = ({ selectedCategories, setSelectedCategories }) => {
  const toggleCategory = (sector) => {
    if (selectedCategories.includes(sector)) {
      setSelectedCategories(selectedCategories.filter(c => c !== sector));
    } else {
      setSelectedCategories([...selectedCategories, sector]);
    }
  };

  return (
    <aside className="w-full md:w-[30%] lg:w-1/4 flex-shrink-0 bg-[#FBBA00] rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl p-8 min-h-[500px] shadow-xl font-['Onest',sans-serif] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-bl-full pointer-events-none"></div>
      <h3 className="text-2xl font-black text-[#2E1D67] uppercase tracking-widest mb-8 relative z-10">Сектора:</h3>
      <div className="flex flex-col gap-3 relative z-10">
        {SECTORS.map(sector => {
          const isSelected = selectedCategories.includes(sector);
          return (
            <button 
              key={sector} 
              onClick={() => toggleCategory(sector)}
              className={`text-left px-5 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all shadow-md uppercase tracking-wide whitespace-normal leading-snug break-words ${
                isSelected 
                  ? 'bg-[#2E1D67] text-white scale-105' 
                  : 'bg-white hover:bg-[#F0D8C2] text-[#2E1D67]'
              }`}
            >
              {sector}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;