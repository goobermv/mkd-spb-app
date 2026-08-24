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
    <aside className="md:w-1/4 bg-[#FCEB9C] rounded-[30px] p-6 min-h-[500px]">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Сектора:</h3>
      <div className="flex flex-col gap-3">
        {SECTORS.map(sector => {
          const isSelected = selectedCategories.includes(sector);
          return (
            <button 
              key={sector} 
              onClick={() => toggleCategory(sector)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                isSelected 
                  ? 'bg-[#0FA958] text-white' 
                  : 'bg-white/60 hover:bg-white text-gray-800'
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