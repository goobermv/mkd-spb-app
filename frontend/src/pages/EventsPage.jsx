import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import apiClient from '../api/client';

const EventsPage = ({ eventsList, currentUser }) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      if (!currentUser) {
        setUserRegistrations([]);
        return;
      }
      try {
        const res = await apiClient.get(`/event_registrations/user/${currentUser.id}`);
        setUserRegistrations(res.data || []);
      } catch (e) {
        setUserRegistrations([]);
      }
    };
    fetchUserRegistrations();
  }, [currentUser, selectedEvent]);

  const filteredEvents = eventsList.filter(event => {
    if (event.status !== 'Published') return false;
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(event.event_category);
  });

  const handleRegisterEvent = async (eventId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      sessionStorage.setItem('redirectAfterLogin', 'events');
      navigate('/login');
      return;
    }
    try {
      await apiClient.post('/event_registrations', {
        user_id: currentUser.id,
        event_id: eventId
      });
      alert('Вы успешно зарегистрированы на мероприятие!');
      
      const res = await apiClient.get(`/event_registrations/user/${currentUser.id}`);
      setUserRegistrations(res.data || []);
    } catch (e) {
      alert('Ошибка регистрации на мероприятие');
    }
  };

  const handleCancelRegistration = async (eventId, e) => {
    if (e) e.stopPropagation();
    const currentReg = userRegistrations.find(reg => reg.event_id === eventId);
    if (!currentReg) return;
    
    if (!window.confirm('Вы уверены, что хотите отменить участие в мероприятии?')) return;
    try {
      await apiClient.delete(`/event_registrations/${currentReg.id}`);
      alert('Вы успешно отменили регистрацию на мероприятие.');
      
      const res = await apiClient.get(`/event_registrations/user/${currentUser.id}`);
      setUserRegistrations(res.data || []);
    } catch (e) {
      alert('Ошибка при отмене регистрации');
    }
  };

  const currentRegistration = selectedEvent && currentUser 
    ? userRegistrations.find(reg => reg.event_id === selectedEvent.id) 
    : null;

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
              filteredEvents.map(event => {
                const isReg = currentUser && userRegistrations.some(reg => reg.event_id === event.id);
                return (
                  <div key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer transition-transform hover:-translate-y-1">
                    <EventCard 
                      title={event.event_name} 
                      date={new Date(event.event_date_and_time).toLocaleString()} 
                      description={event.description} 
                      event_picture={event.event_picture} 
                      isRegistered={isReg}
                      onRegister={(e) => handleRegisterEvent(event.id, e)}
                      onCancel={(e) => handleCancelRegistration(event.id, e)}
                    />
                  </div>
                );
              })
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
                <p className="text-[#6856BC] font-black text-xl mb-6">{new Date(selectedEvent.event_date_and_time).toLocaleString()}</p>
                {currentRegistration ? (
                  <button onClick={(e) => handleCancelRegistration(selectedEvent.id, e)} className="bg-[#EB5893] hover:bg-[#d44880] text-white font-black py-4 px-10 rounded-full transition-colors shadow-xl text-lg uppercase tracking-widest">
                    Отменить участие
                  </button>
                ) : (
                  <button onClick={(e) => handleRegisterEvent(selectedEvent.id, e)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-4 px-10 rounded-full transition-colors shadow-xl text-lg uppercase tracking-widest">
                    Зарегистрироваться
                  </button>
                )}
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