import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';

const EventsPage = ({ eventsList }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredEvents = eventsList.filter(event => {
    if (!event.approved) return false;
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(event.sector) || selectedCategories.includes(event.category);
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">Мероприятия</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
          
          <div className="md:w-3/4 flex flex-col gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                  <EventCard title={event.title} date={event.date} description={event.description} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl">Мероприятий пока нет.</p>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-[#F6EFE6] rounded-[30px] p-8 md:p-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pr-6">{selectedEvent.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">{selectedEvent.description}</p>
              </div>
              <div>
                <p className="text-gray-900 text-lg mb-6">Дата: {selectedEvent.date}</p>
                <button className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md text-lg">Зарегистрироваться</button>
              </div>
            </div>
            <div className="md:w-[350px] md:h-[450px] h-[300px] bg-white rounded-3xl shadow-inner flex items-center justify-center text-gray-800 font-medium flex-shrink-0">Афиша</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;