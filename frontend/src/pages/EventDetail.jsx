import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { AuthContext } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    apiClient.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  const handleRegister = async () => {
    try {
      await apiClient.post('/event_registrations', { event_id: id });
      setRegistered(true);
    } catch (err) {
      alert('Ошибка при записи на мероприятие');
    }
  };

  if (!event) return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white border rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{event.title || event.name}</h1>
      <p className="text-sm text-gray-500 mb-4">Дата: {event.date || 'Не указана'}</p>
      <p className="text-gray-700 mb-6">{event.description}</p>

      {user ? (
        <button 
          onClick={handleRegister} 
          disabled={registered}
          className={`px-4 py-2 rounded text-white ${registered ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {registered ? 'Вы записаны' : 'Записаться на мероприятие'}
        </button>
      ) : (
        <p className="text-sm text-gray-500">Авторизуйтесь, чтобы записаться на мероприятие.</p>
      )}
    </div>
  );
};

export default EventDetail;