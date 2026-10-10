import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import apiClient from '../api/client';

const EventsPage = ({ eventsList, currentUser }) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredEvents = eventsList.filter(event => {
    if (event.status !== 'Published') return false;
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(event.event_category);
  });

  const handleRegisterEvent = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      await apiClient.post('/event_registrations', {
        user_id: currentUser.id,
        event_id: selectedEvent.id
      });
      alert('Вы успешно зарегистрированы на мероприятие!');
      setSelectedEvent(null);
    } catch (e) {
      alert('Ошибка регистрации на мероприятие');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px] font-['Onest',sans-serif]">
      <div className="bg-[#2E1D67] rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl p-10 pb-16 shadow-2xl relative overflow-hidden border-t-8 border-[#00A552]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB5893] rounded-bl-full opacity-20"></div>
        <h2 className="text-3xl md:text-4xl text-white font-black bg-[#6856BC]/50 rounded-full py-4 px-12 mx-auto w-fit mb-10 shadow-sm uppercase tracking-widest backdrop-blur-sm border border-[#6856BC] block relative z-10 text-center">
          Мероприятия
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <Sidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
          
          <div className="md:w-3/4 flex flex-col gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer transition-transform hover:-translate-y-1">
                  <EventCard title={event.event_name} date={new Date(event.event_date_and_time).toLocaleString()} description={event.description} event_picture={event.event_picture} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] bg-white/10 backdrop-blur-sm rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl border-2 border-dashed border-[#F0D8C2]/30">
                <p className="text-center text-[#F0D8C2] text-xl font-bold uppercase tracking-widest">Мероприятий пока нет.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-4xl flex flex-col md:flex-row gap-8 relative shadow-2xl font-['Onest',sans-serif] items-center my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <div className="flex-1 flex flex-col justify-between mt-4 md:mt-0 w-full min-w-0 pr-0 md:pr-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-6 pr-8 leading-tight break-words [overflow-wrap:anywhere]">{selectedEvent.event_name}</h3>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-8 whitespace-pre-line break-words [overflow-wrap:anywhere]">{selectedEvent.description}</p>
              </div>
              <div>
                <p className="text-[#6856BC] font-black text-xl mb-6"> {new Date(selectedEvent.event_date_and_time).toLocaleString()}</p>
                <button onClick={handleRegisterEvent} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-4 px-10 rounded-full transition-colors shadow-xl text-lg uppercase tracking-widest">
                  Зарегистрироваться
                </button>
              </div>
            </div>
            <div className="w-full md:w-[320px] aspect-square bg-[#F0D8C2] rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl shadow-inner flex items-center justify-center text-[#2E1D67] font-black uppercase tracking-widest text-xl flex-shrink-0 border-4 border-white overflow-hidden relative">
              {selectedEvent.event_picture ? (
                <img src={selectedEvent.event_picture} alt={selectedEvent.event_name} className="w-full h-full object-cover" />
              ) : (
                <span>Афиша</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;