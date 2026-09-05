import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import apiClient from './api/client';

import ScrollManager from './components/ScrollManager';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import CityPage from './pages/CityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsDropdown from './components/NotificationsDropdown';

export default function App() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = async () => {
    try {
      const newsRes = await apiClient.get('/news_blocks');
      setNews(newsRes.data || []);
    } catch (e) {
      console.error("Ошибка загрузки новостей", e);
    }
    
    try {
      const evRes = await apiClient.get('/events');
      setEvents(evRes.data || []);
    } catch (e) {
      console.error("Ошибка загрузки мероприятий", e);
    }
  };

  useEffect(() => {
    fetchData();
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.get('/users/me')
        .then(res => setCurrentUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setCurrentUser(null);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout currentUser={currentUser}>
        <Routes>
          <Route path="/" element={<HomePage newsList={news} currentUser={currentUser} />} />
          <Route path="/events" element={<EventsPage eventsList={events} currentUser={currentUser} />} />
          <Route path="/news" element={<NewsPage newsList={news} />} />
          <Route path="/city" element={<CityPage />} />
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage setCurrentUser={setCurrentUser} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} eventsList={events} newsList={news} refreshData={fetchData} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}