import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';

const HomePage = ({ newsList, currentUser }) => {
  const navigate = useNavigate();
  
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
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    if (isNewsPaused || top5News.length === 0 || selectedNews) return;
    const interval = setInterval(() => setNewsIndex((prev) => (prev + 1) % top5News.length), 4500);
    return () => clearInterval(interval);
  }, [isNewsPaused, top5News.length, selectedNews]);

  const nextNews = () => setNewsIndex((prev) => (prev + 1) % top5News.length);
  const prevNews = () => setNewsIndex((prev) => (prev - 1 + top5News.length) % top5News.length);
  const visibleNews = top5News.length > 0 ? Array.from({length: Math.min(3, top5News.length)}, (_, i) => top5News[(newsIndex + i) % top5News.length]) : [];

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [motivation, setMotivation] = useState("");

  const canApply = !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'activist');

  useEffect(() => {
    if (currentUser && sessionStorage.getItem('pendingApplication') === 'true') {
      setIsApplicationModalOpen(true);
      sessionStorage.removeItem('pendingApplication');
    }
  }, [currentUser]);

  const handleApplyClick = () => {
    if (!currentUser) {
      sessionStorage.setItem('pendingApplication', 'true');
      navigate('/login');
    } else {
      setIsApplicationModalOpen(true);
    }
  };

  const submitApplication = () => {
    if (motivation.trim().length < 10) {
      alert("Пожалуйста, опишите вашу мотивацию подробнее.");
      return;
    }

    const requestData = {
      user_id: currentUser?.id, 
      user_motivation_description: motivation
    };
    
    console.log("Отправка на бэкенд:", requestData);
    alert("Ваша заявка успешно отправлена на рассмотрение!");
    setIsApplicationModalOpen(false);
    setMotivation(""); 
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gray-200 w-full h-[400px] relative overflow-hidden flex items-center justify-between px-10" onMouseEnter={() => setIsHeroPaused(true)} onMouseLeave={() => setIsHeroPaused(false)}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">{heroSlides[heroSlide]}</div>
        <button onClick={prevHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all z-10 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
        <button onClick={nextHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all z-10 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12">
          <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 mx-auto shadow-sm">Новости</h2>
          <div className="bg-[#EEE6C4] rounded-[30px] p-8 flex items-center gap-4 relative min-h-[300px]" onMouseEnter={() => setIsNewsPaused(true)} onMouseLeave={() => setIsNewsPaused(false)}>
            {top5News.length > 0 ? (
              <>
                <button onClick={prevNews} className="bg-white p-3 rounded-full shadow-md z-10 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {visibleNews.map(item => (
                    <div key={item.id} onClick={() => setSelectedNews(item)} className="cursor-pointer transition-transform hover:scale-[1.02] h-full">
                      <NewsCard title={item.title} date={item.date} description={item.description} />
                    </div>
                  ))}
                </div>
                <button onClick={nextNews} className="bg-white p-3 rounded-full shadow-md z-10 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
              </>
            ) : (
              <p className="text-center text-gray-700 text-lg w-full py-10">Новостей пока нет.</p>
            )}
          </div>
        </div>
      </section>

      {selectedNews && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedNews(null)}>
          <div className="bg-[#F6EFE6] rounded-[30px] p-8 md:p-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNews(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pr-6">{selectedNews.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">{selectedNews.description}</p>
              </div>
              <div>
                <p className="text-gray-900 text-lg mb-6">Дата: {selectedNews.date}</p>
                <button onClick={() => navigate('/news')} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md text-lg">Перейти ко всем новостям</button>
              </div>
            </div>
            <div className="md:w-[350px] md:h-[450px] h-[300px] bg-white rounded-3xl shadow-inner flex items-center justify-center text-gray-800 font-medium flex-shrink-0">Афиша</div>
          </div>
        </div>
      )}

      <section id="about" className="container mx-auto px-4 py-16 scroll-mt-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">О нас</h2>
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша история</h3>
            <p className="text-lg font-medium mb-4">Открыт - 3 ноября 2024 г.</p>
            <p className="text-gray-700 leading-relaxed text-justify">Молодёжный Консультационный Дом Санкт-Петербурга был создан как единая площадка для поддержки молодёжных инициатив, объединения городских сообществ и взаимодействия с органами власти.</p>
          </div>
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner">Место для фото "История"</div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner order-2 md:order-1">Место для фото "Миссия"</div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша миссия</h3>
            <p className="text-lg text-gray-800 font-medium mb-4">Формирование глобального сообщества лидеров.</p>
            <p className="text-gray-700 leading-relaxed text-justify">Развитие потенциала молодых людей, создание возможностей для профессионального роста, гражданской активности и реализации социокультурных проектов.</p>
          </div>
        </div>
      </section>

      {canApply && (
        <section className="container mx-auto px-4 py-16 text-center bg-[#FCEB9C] rounded-[40px] mb-12 shadow-sm max-w-4xl">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">Как стать активистом?</h3>
          <p className="text-lg mb-4 text-gray-700">Мы ищем активных людей, готовых развивать город вместе с нами!</p>
          <button 
            onClick={handleApplyClick}
            className="bg-[#0FA958] mt-4 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            Подать заявку
          </button>
        </section>
      )}

      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsApplicationModalOpen(false)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 md:p-10 w-full max-w-2xl relative shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsApplicationModalOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Заявка в актив</h3>
            <p className="text-gray-600 mb-6 font-medium">Расскажите нам о себе и почему вы хотите присоединиться.</p>
            
            <div className="mb-8">
              <label className="block text-gray-800 text-lg font-bold mb-3">
                Ваша мотивация (почему мы?):
              </label>
              <textarea 
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-800 shadow-sm focus:outline-none focus:border-[#0FA958] focus:ring-1 focus:ring-[#0FA958] resize-none h-40 transition-all text-lg"
                placeholder="Я хочу стать активистом, потому что..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-auto">
              <button 
                onClick={() => setIsApplicationModalOpen(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3.5 px-8 rounded-full transition-colors text-lg"
              >
                Отмена
              </button>
              <button 
                onClick={submitApplication} 
                className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md text-lg"
              >
                Отправить заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;