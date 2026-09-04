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

export default function App() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const loadPublicData = async () => {
    try {
      const eventsRes = await apiClient.get('/events');
      setEvents(eventsRes.data || []);
      const newsRes = await apiClient.get('/news_blocks');
      setNews(newsRes.data || []);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [currentUser]);

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
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} reloadData={loadPublicData} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}