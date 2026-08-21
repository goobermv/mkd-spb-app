import React from 'react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';

const EventsPage = ({ eventsList }) => {
  const approvedEvents = eventsList.filter(event => event.approved);
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">Мероприятия</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <div className="md:w-3/4 flex flex-col">
            {approvedEvents.length > 0 ? (
              approvedEvents.map(event => <EventCard key={event.id} title={event.title} date={event.date} description={event.description} />)
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl">Мероприятий пока нет.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;