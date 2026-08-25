import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout currentUser={currentUser}>
        <Routes>
          <Route path="/" element={<HomePage newsList={news} currentUser={currentUser} />} />
          <Route path="/events" element={<EventsPage eventsList={events} />} />
          <Route path="/news" element={<NewsPage newsList={news} />} />
          <Route path="/city" element={<CityPage />} />
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage setCurrentUser={setCurrentUser} />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}