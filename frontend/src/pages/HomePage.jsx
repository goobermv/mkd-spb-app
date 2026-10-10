import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import NewsCard from '../components/NewsCard';

const HomePage = ({ newsList, currentUser }) => {
  const navigate = useNavigate();
  
  // Слайдер теперь использует только фото 1 и фото 3
  const heroSlides = [
    { src: '/МКД_СПб_1.jpg', alt: 'Слайд 1' },
    { src: '/МКД_СПб_3.jpg', alt: 'Слайд 3' }
  ];
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => setHeroSlide((prev) => (prev + 1) % heroSlides.length), 4000);
    return () => clearInterval(interval);
  }, [isHeroPaused, heroSlides.length]);

  const nextHeroSlide = () => setHeroSlide((prev) => (prev + 1) % heroSlides.length);
  const prevHeroSlide = () => setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const approvedNews = newsList.filter(news => news.publication_status === 'Published');
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

  const canApply = !currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Activist');

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

  const submitApplication = async () => {
    if (motivation.trim().length < 10) {
      alert("Пожалуйста, опишите вашу мотивацию подробнее.");
      return;
    }
    try {
      await apiClient.post('/applications', {
        user_id: currentUser?.id,
        user_motivation_description: motivation
      });
      alert("Ваша заявка успешно отправлена на рассмотрение!");
      setIsApplicationModalOpen(false);
      setMotivation(""); 
    } catch(err) {
      alert("Ошибка при отправке заявки");
    }
  };

  return (
    <div className="flex flex-col font-['Onest',sans-serif]">
      <section className="bg-[#2E1D67] w-full h-[500px] md:h-[600px] relative overflow-hidden flex items-center justify-between px-6 md:px-12" onMouseEnter={() => setIsHeroPaused(true)} onMouseLeave={() => setIsHeroPaused(false)}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB5893] rounded-bl-full opacity-20 z-0"></div>
        
        {/* Слайдер с фото */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <img 
            src={heroSlides[heroSlide].src} 
            alt={heroSlides[heroSlide].alt} 
            className="w-full h-full object-cover transition-opacity duration-700" 
          />
        </div>

        <button onClick={prevHeroSlide} className="bg-white/90 hover:bg-[#EB5893] hover:text-white text-[#2E1D67] p-4 rounded-full transition-all z-10 shadow-2xl backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button onClick={nextHeroSlide} className="bg-white/90 hover:bg-[#EB5893] hover:text-white text-[#2E1D67] p-4 rounded-full transition-all z-10 shadow-2xl backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-[1400px]">
        <div className="bg-[#F0D8C2] rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl p-8 pb-12 shadow-xl border-t-8 border-[#FBBA00]">
          <h2 className="text-3xl md:text-4xl text-[#2E1D67] font-black text-center mb-10 bg-white rounded-full py-3 w-fit px-12 mx-auto shadow-sm uppercase tracking-widest border-2 border-dashed border-[#EB5893]">Новости</h2>
          <div className="bg-white/40 backdrop-blur-sm rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl p-8 flex items-center gap-4 relative min-h-[300px]" onMouseEnter={() => setIsNewsPaused(true)} onMouseLeave={() => setIsNewsPaused(false)}>
            {top5News.length > 0 ? (
              <>
                <button onClick={prevNews} className="bg-white p-3 rounded-full shadow-md z-10 flex-shrink-0 text-[#2E1D67] hover:bg-[#2E1D67] hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {visibleNews.map(item => (
                    <div key={item.id} onClick={() => setSelectedNews(item)} className="cursor-pointer transition-transform hover:-translate-y-2 h-full min-w-0">
                      <NewsCard title={item.title} date={new Date(item.publication_date).toLocaleDateString()} description={item.description} news_block_picture={item.news_block_picture} />
                    </div>
                  ))}
                </div>
                <button onClick={nextNews} className="bg-white p-3 rounded-full shadow-md z-10 flex-shrink-0 text-[#2E1D67] hover:bg-[#2E1D67] hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
              </>
            ) : (
              <p className="text-center text-[#2E1D67] font-bold uppercase tracking-widest w-full py-10">Новостей пока нет.</p>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="container mx-auto px-4 py-16 scroll-mt-24 max-w-[1400px]">
        <div className="bg-[#2E1D67] rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl p-10 md:p-16 shadow-2xl relative overflow-hidden border-t-8 border-[#00A552]">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FBBA00] rounded-tr-full opacity-20"></div>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white uppercase tracking-widest relative z-10">О нас</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10 relative z-10">
            <div className="md:w-1/2">
              <h3 className="text-3xl font-black mb-4 text-[#FBBA00] uppercase tracking-wider">Наша история</h3>
              <p className="text-xl font-bold mb-4 text-[#F0D8C2]">Открыт - 3 ноября 2024 г.</p>
              <p className="text-white/90 leading-relaxed text-justify text-lg font-medium">Молодёжный Консультационный Дом Санкт-Петербурга был создан как единая площадка для поддержки молодёжных инициатив, объединения городских сообществ и взаимодействия с органами власти.</p>
            </div>
            <div className="md:w-1/3 h-[300px] w-full bg-[#F0D8C2] rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl flex justify-center items-center text-[#2E1D67] shadow-inner font-black uppercase tracking-widest border-4 border-white overflow-hidden">
              <img src="/МКД_СПб_Миссия.jpg" alt="Наша история" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            {/* Теперь здесь установлено фото 2 */}
            <div className="md:w-1/3 h-[300px] w-full bg-[#F0D8C2] rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl flex justify-center items-center text-[#2E1D67] shadow-inner font-black uppercase tracking-widest border-4 border-white order-2 md:order-1 overflow-hidden">
              <img src="/МКД_СПб_2.jpg" alt="Наша миссия" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h3 className="text-3xl font-black mb-4 text-[#FBBA00] uppercase tracking-wider">Наша миссия</h3>
              <p className="text-xl text-[#F0D8C2] font-bold mb-4">Формирование глобального сообщества лидеров.</p>
              <p className="text-white/90 leading-relaxed text-justify text-lg font-medium">Развитие потенциала молодых людей, создание возможностей для профессионального роста, гражданской активности и реализации социокультурных проектов.</p>
            </div>
          </div>
        </div>
      </section>

      {canApply && (
        <section className="container mx-auto px-4 py-16 mb-12 max-w-[1400px]">
          <div className="text-center bg-[#FBBA00] rounded-tl-[60px] rounded-br-[60px] rounded-tr-xl rounded-bl-xl p-12 shadow-xl border-t-8 border-[#EB5893] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-30"></div>
            <h3 className="text-4xl font-black mb-6 text-[#2E1D67] uppercase tracking-widest relative z-10">Как стать активистом?</h3>
            <p className="text-xl mb-8 text-[#2E1D67] font-bold relative z-10">Мы ищем активных людей, готовых развивать город вместе с нами!</p>
            <button onClick={handleApplyClick} className="bg-[#2E1D67] hover:bg-[#EB5893] text-white font-black py-4 px-12 rounded-full transition-colors text-lg shadow-xl uppercase tracking-widest relative z-10">
              Подать заявку
            </button>
          </div>
        </section>
      )}

      {selectedNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl p-8 md:p-12 w-full max-w-4xl flex flex-col md:flex-row gap-8 relative shadow-2xl font-['Onest',sans-serif] items-center my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <div className="flex-1 flex flex-col justify-between mt-4 md:mt-0 w-full min-w-0 pr-0 md:pr-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-6 pr-8 leading-tight break-words [overflow-wrap:anywhere]">{selectedNews.title}</h3>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-6 whitespace-pre-line break-words [overflow-wrap:anywhere]">{selectedNews.description}</p>
              </div>
              <div>
                <p className="text-[#6856BC] font-black text-xl mb-6"> Дата: {new Date(selectedNews.publication_date).toLocaleDateString()}</p>
                <button onClick={() => navigate('/news')} className="bg-[#FBBA00] hover:bg-[#e0a600] text-[#2E1D67] font-black py-4 px-8 rounded-full transition-colors shadow-xl text-lg uppercase tracking-widest">Все новости</button>
              </div>
            </div>
            <div className="w-full md:w-[320px] aspect-square bg-[#F0D8C2] rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl shadow-inner flex items-center justify-center text-[#2E1D67] font-black uppercase tracking-widest text-xl flex-shrink-0 border-4 border-white overflow-hidden relative">
              {selectedNews.news_block_picture ? (
                <img src={selectedNews.news_block_picture} alt={selectedNews.title} className="w-full h-full object-cover" />
              ) : (
                <span>Афиша</span>
              )}
            </div>
          </div>
        </div>
      )}

      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsApplicationModalOpen(false)}>
           <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsApplicationModalOpen(false)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-2 pr-8 break-words">Заявка в актив</h3>
            <p className="text-gray-500 mb-8 font-medium">Расскажите нам о себе и почему вы хотите присоединиться.</p>
            <div className="mb-8">
              <label className="block text-[#2E1D67] text-lg font-black uppercase tracking-wider mb-3">Ваша мотивация (почему мы?):</label>
              <textarea 
                className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-2xl p-4 text-gray-800 shadow-inner focus:outline-none focus:border-[#EB5893] resize-none h-40 transition-all text-lg font-medium"
                placeholder="Я хочу стать активистом, потому что..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-auto">
              <button onClick={() => setIsApplicationModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-full transition-colors text-lg uppercase tracking-widest">Отмена</button>
              <button onClick={submitApplication} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-4 px-8 rounded-full transition-colors shadow-xl text-lg uppercase tracking-widest">Отправить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;