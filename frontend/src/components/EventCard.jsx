import React from 'react';

const EventCard = ({ title, date, description }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-6 flex flex-col md:flex-row justify-between mb-6 shadow-sm">
    <div className="flex flex-col justify-between w-full md:w-1/2 pr-4">
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description || "Текст с информацией..."}</p>
      </div>
      <div className="mt-8">
        <p className="mb-4 font-semibold text-gray-600">Дата: {date}</p>
        <button className="bg-[#0FA958] hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Зарегистрироваться
        </button>
      </div>
    </div>
    <div className="w-full md:w-1/2 mt-4 md:mt-0 flex justify-center items-center bg-white rounded-xl min-h-[250px] border border-gray-100 shadow-inner">
      <span className="text-gray-400">Афиша</span>
    </div>
  </div>
);

export default EventCard;