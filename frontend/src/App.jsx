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
  const [isLoading, setIsLoading] = useState(true);

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
    const initApp = async () => {
      await fetchData();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiClient.get('/users/me');
          setCurrentUser(res.data);
        } catch (e) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5F8] font-['Onest',sans-serif]">
        <div className="text-[#2E1D67] font-black uppercase tracking-widest text-xl animate-pulse">Загрузка...</div>
      </div>
    );
  }

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