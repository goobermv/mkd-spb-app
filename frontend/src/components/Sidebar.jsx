import React from 'react';
import { SECTORS } from '../data/constants';

const Sidebar = () => (
  <aside className="md:w-1/4 bg-[#FCEB9C] rounded-[30px] p-6 min-h-[500px]">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Сектора:</h3>
    <div className="flex flex-col gap-3">
      {SECTORS.map(sector => (
        <button 
          key={sector} 
          className="text-left bg-white/60 hover:bg-white text-gray-800 px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          {sector}
        </button>
      ))}
    </div>
  </aside>
);

export default Sidebar;