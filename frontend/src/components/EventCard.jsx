import React from 'react';

const EventCard = ({ title, date, description }) => (
  <div className="bg-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-6 flex flex-col md:flex-row justify-between mb-6 shadow-lg border-2 border-transparent hover:border-[#00A552] transition-colors font-['Onest',sans-serif] group">
    <div className="flex flex-col justify-between w-full md:w-1/2 pr-4">
      <div>
        <h3 className="text-xl font-black mb-2 text-[#2E1D67] uppercase leading-tight">{title}</h3>
        <p className="text-gray-700 font-medium">{description || "Текст с информацией..."}</p>
      </div>
      <div className="mt-8">
        <p className="mb-4 font-bold text-[#6856BC]"> {date}</p>
        <button className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-3 px-8 rounded-full transition-colors uppercase tracking-widest text-sm shadow-md group-hover:scale-105">
          Зарегистрироваться
        </button>
      </div>
    </div>
    <div className="w-full md:w-1/2 mt-4 md:mt-0 flex justify-center items-center bg-white rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg min-h-[250px] border-2 border-dashed border-[#FBBA00] shadow-inner overflow-hidden">
      <span className="text-[#2E1D67] font-black uppercase tracking-widest">Афиша</span>
    </div>
  </div>
);

export default EventCard;