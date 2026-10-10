import React from 'react';

const NewsCard = ({ title, date, description, news_block_picture }) => (
  <div className="bg-white rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl p-6 flex flex-col shadow-lg h-full border-2 border-transparent hover:border-[#EB5893] transition-all font-['Onest',sans-serif] group min-w-0 overflow-hidden">
    <div className="bg-[#F0D8C2] flex items-center justify-center text-[#2E1D67] font-black uppercase tracking-widest aspect-square w-full rounded-tl-[30px] rounded-br-[30px] rounded-tr-lg rounded-bl-lg mb-6 border-2 border-dashed border-[#EB5893] overflow-hidden relative flex-shrink-0">
      {news_block_picture ? (
        <img src={news_block_picture} alt={title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-center px-2">Фото новости</span>
      )}
    </div>
    <h4 className="font-black mb-3 text-xl text-[#2E1D67] uppercase leading-tight break-words [overflow-wrap:anywhere]">{title}</h4>
    <p className="text-base font-medium text-gray-700 mb-6 flex-grow break-words [overflow-wrap:anywhere] line-clamp-4">{description || "Краткая информация..."}</p>
    <p className="text-sm font-bold text-[#6856BC] mt-auto">{date}</p>
  </div>
);

export default NewsCard;