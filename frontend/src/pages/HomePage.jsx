import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';

const HomePage = ({ newsList }) => {
  const heroSlides = ["Место для фото 1", "Место для фото 2", "Место для фото 3", "Место для фото 4"];
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => setHeroSlide((prev) => (prev + 1) % heroSlides.length), 4000);
    return () => clearInterval(interval);
  }, [isHeroPaused, heroSlides.length]);

  const nextHeroSlide = () => setHeroSlide((prev) => (prev + 1) % heroSlides.length);
  const prevHeroSlide = () => setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const approvedNews = newsList.filter(news => news.approved);
  const top5News = approvedNews.slice(0, 5);
  const [newsIndex, setNewsIndex] = useState(0);
  const [isNewsPaused, setIsNewsPaused] = useState(false);

  useEffect(() => {
    if (isNewsPaused || top5News.length === 0) return;
    const interval = setInterval(() => setNewsIndex((prev) => (prev + 1) % top5News.length), 4500);
    return () => clearInterval(interval);
  }, [isNewsPaused, top5News.length]);

  const nextNews = () => setNewsIndex((prev) => (prev + 1) % top5News.length);
  const prevNews = () => setNewsIndex((prev) => (prev - 1 + top5News.length) % top5News.length);

  const visibleNews = top5News.length > 0 ? Array.from({length: Math.min(3, top5News.length)}, (_, i) => top5News[(newsIndex + i) % top5News.length]) : [];

  return (
    <div className="flex flex-col">
      <section 
        className="bg-gray-200 w-full h-[400px] relative overflow-hidden flex items-center justify-between px-10"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">
          {heroSlides[heroSlide]}
        </div>
        <button onClick={prevHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all z-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button onClick={nextHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all z-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12">
          <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 mx-auto shadow-sm">
            Новости
          </h2>
          <div 
            className="bg-[#EEE6C4] rounded-[30px] p-8 flex items-center gap-4 relative min-h-[300px]"
            onMouseEnter={() => setIsNewsPaused(true)}
            onMouseLeave={() => setIsNewsPaused(false)}
          >
            {top5News.length > 0 ? (
              <>
                <button onClick={prevNews} className="bg-white p-3 rounded-full shadow-md z-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {visibleNews.map(item => <NewsCard key={item.id} title={item.title} date={item.date} description={item.description} />)}
                </div>
                <button onClick={nextNews} className="bg-white p-3 rounded-full shadow-md z-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
              </>
            ) : (
              <p className="text-center text-gray-700 text-lg w-full py-10">Новостей пока нет.</p>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="container mx-auto px-4 py-16 scroll-mt-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">О нас</h2>
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша история</h3>
            <p className="text-lg font-medium mb-4">Открыт - 3 ноября 2024 г.</p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Молодёжный Консультационный Дом Санкт-Петербурга был создан как единая площадка для поддержки молодёжных инициатив, объединения городских сообществ и взаимодействия с органами власти.
            </p>
          </div>
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner">Место для фото "История"</div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner order-2 md:order-1">Место для фото "Миссия"</div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша миссия</h3>
            <p className="text-lg text-gray-800 font-medium mb-4">Формирование глобального сообщества лидеров.</p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Развитие потенциала молодых людей, создание возможностей для профессионального роста, гражданской активности и реализации социокультурных проектов.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center bg-[#FCEB9C] rounded-[40px] mb-12 shadow-sm max-w-4xl">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">Как стать активистом?</h3>
        <p className="text-lg mb-4 text-gray-700">Мы ищем активных людей, готовых развивать город вместе с нами!</p>
        <button className="bg-[#0FA958] mt-4 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-colors text-lg shadow-md hover:shadow-lg">
          Подать заявку
        </button>
      </section>
    </div>
  );
};

export default HomePage;