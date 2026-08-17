import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiClient.get('/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Список мероприятий</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-bold">{event.title || event.name}</h3>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <Link to={`/events/${event.id}`} className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
              Подробнее →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;