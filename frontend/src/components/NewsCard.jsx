import React from 'react';

const NewsCard = ({ title, date, description }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-4 flex flex-col shadow-sm h-full">
    <div className="bg-white flex items-center justify-center text-gray-400 h-[150px] rounded-xl mb-4 border border-gray-100">
      Фото новости
    </div>
    <h4 className="font-bold mb-2 text-lg">{title}</h4>
    <p className="text-sm text-gray-600 mb-4 flex-grow">{description || "Краткая информация..."}</p>
    <p className="text-sm font-bold text-gray-800">{date}</p>
  </div>
);

export default NewsCard;