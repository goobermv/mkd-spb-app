import React from 'react';

const EventCard = ({ title, date, description, event_picture }) => (
  <div className="bg-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-6 flex flex-col md:flex-row justify-between mb-6 shadow-lg border-2 border-transparent hover:border-[#00A552] transition-colors font-['Onest',sans-serif] group gap-6 min-w-0 overflow-hidden">
    <div className="flex flex-col justify-between w-full md:w-1/2 pr-0 md:pr-4 min-w-0">
      <div>
        <h3 className="text-xl font-black mb-2 text-[#2E1D67] uppercase leading-tight break-words [overflow-wrap:anywhere]">{title}</h3>
        <p className="text-gray-700 font-medium break-words [overflow-wrap:anywhere] line-clamp-3">{description || "Текст с информацией..."}</p>
      </div>
      <div className="mt-8">
        <p className="mb-4 font-bold text-[#6856BC]">{date}</p>
        <button className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-3 px-8 rounded-full transition-colors uppercase tracking-widest text-sm shadow-md group-hover:scale-105">
          Зарегистрироваться
        </button>
      </div>
    </div>
    <div className="w-full md:w-[260px] aspect-square bg-white rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg flex justify-center items-center text-[#2E1D67] font-black uppercase tracking-widest border-2 border-dashed border-[#FBBA00] shadow-inner overflow-hidden relative flex-shrink-0 self-center">
      {event_picture ? (
        <img src={event_picture} alt={title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[#2E1D67] font-black uppercase tracking-widest text-center px-2">Афиша</span>
      )}
    </div>
  </div>
);

export default EventCard;