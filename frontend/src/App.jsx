import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

const SECTORS = [
  "Государственное управление",
  "Медиа",
  "Наука и образование",
  "Предпринимательство",
  "Цифровизация и IT",
  "Креативные индустрии, культура и творчество",
  "Гражданская активность",
  "Спорт и здоровье"
];

const DB_NEWS = [
  { id: 1, title: "Инфоповод 1", date: "01.08.2026", approved: true },
  { id: 2, title: "Инфоповод 2", date: "05.08.2026", approved: true },
  { id: 3, title: "Инфоповод 3", date: "10.08.2026", approved: true },
  { id: 4, title: "Инфоповод 4", date: "12.08.2026", approved: true },
  { id: 5, title: "Инфоповод 5", date: "15.08.2026", approved: true },
  { id: 6, title: "Скрытая новость", date: "16.08.2026", approved: false },
];

const DB_EVENTS = [
  { id: 1, title: "Мероприятие 1", date: "20.08.2026", approved: true },
  { id: 2, title: "Мероприятие 2", date: "22.08.2026", approved: true },
  { id: 3, title: "Скрытое мероприятие", date: "25.08.2026", approved: false },
];

const ScrollManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const Sidebar = () => (
  <aside className="md:w-1/4 bg-[#FCEB9C] rounded-[30px] p-6 min-h-[500px]">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Сектора:</h3>
    <div className="flex flex-col gap-3">
      {SECTORS.map(sector => (
        <button 
          key={sector} 
          className="text-left bg-white/60 hover:bg-white text-gray-800 px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
        >
          {sector}
        </button>
      ))}
    </div>
  </aside>
);

const EventCard = ({ title, date }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-6 flex flex-col md:flex-row justify-between mb-6 shadow-sm">
    <div className="flex flex-col justify-between w-full md:w-1/2 pr-4">
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">Текст с информацией...</p>
      </div>
      <div className="mt-8">
        <p className="mb-4 font-semibold text-gray-600">Дата: {date}</p>
        <button className="bg-[#0FA958] hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Зарегистрироваться
        </button>
      </div>
    </div>
    <div className="w-full md:w-1/2 mt-4 md:mt-0 flex justify-center items-center bg-white rounded-xl min-h-[250px] border border-gray-100 shadow-inner">
      <span className="text-gray-400">Афиша</span>
    </div>
  </div>
);

const NewsCard = ({ title, date }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-6 flex flex-col shadow-sm h-full">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-700 mb-6 flex-grow">Текст с информацией...</p>
    <p className="mb-4 font-semibold text-gray-600">Дата: {date}</p>
    <div className="w-full flex justify-center items-center bg-white rounded-xl h-[200px] border border-gray-100 shadow-inner">
      <span className="text-gray-400">Афиша</span>
    </div>
  </div>
);

const HomePage = () => {
  const [heroSlide, setHeroSlide] = useState(0);
  const heroSlidesCount = 3;
  const nextHeroSlide = () => setHeroSlide((prev) => (prev + 1) % heroSlidesCount);
  const prevHeroSlide = () => setHeroSlide((prev) => (prev - 1 + heroSlidesCount) % heroSlidesCount);

  const [newsStartIndex, setNewsStartIndex] = useState(0);
  const approvedNews = DB_NEWS.filter(news => news.approved);
  const visibleNews = approvedNews.slice(newsStartIndex, newsStartIndex + 3);
  
  const nextNews = () => setNewsStartIndex((prev) => Math.min(prev + 1, approvedNews.length - 3));
  const prevNews = () => setNewsStartIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col">
      <section className="bg-gray-200 w-full h-[400px] relative overflow-hidden flex items-center justify-between px-10">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">
          Место для фото {heroSlide + 1}
        </div>
        <button onClick={prevHeroSlide} className="bg-white/80 p-3 rounded-full hover:bg-white transition-colors z-10 shadow-lg">⬅️</button>
        <button onClick={nextHeroSlide} className="bg-white/80 p-3 rounded-full hover:bg-white transition-colors z-10 shadow-lg">➡️</button>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12">
          <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 mx-auto shadow-sm">
            Новости
          </h2>
          <div className="bg-[#EEE6C4] rounded-[30px] p-8 flex items-center gap-4 relative">
            <button 
              onClick={prevNews} 
              disabled={newsStartIndex === 0} 
              className="bg-white p-3 rounded-full shadow-md disabled:opacity-30 transition-opacity z-10"
            >⬅️</button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {visibleNews.map(item => (
                <div key={item.id} className="bg-[#F5EFE6] rounded-2xl p-4 flex flex-col h-full shadow-sm">
                  <div className="bg-white flex items-center justify-center text-gray-400 h-[150px] rounded-xl mb-4 border border-gray-100">
                    Фото новости
                  </div>
                  <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">Краткая информация...</p>
                  <p className="text-sm font-bold text-gray-800">{item.date}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={nextNews} 
              disabled={newsStartIndex >= approvedNews.length - 3} 
              className="bg-white p-3 rounded-full shadow-md disabled:opacity-30 transition-opacity z-10"
            >➡️</button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">О нас</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша история</h3>
            <p className="text-lg font-medium mb-4">Открыт - 3 ноября 2024 г.</p>
            <p className="text-gray-700 leading-relaxed text-justify">Здесь будет располагаться подробный текст об истории создания МКД Санкт-Петербурга. Мы дополним этот текст позже, когда будет готова полная информация.</p>
          </div>
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner">
             Место для фото "История"
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner order-2 md:order-1">
             Место для фото "Миссия"
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша миссия</h3>
            <p className="text-lg text-gray-800 font-medium mb-4">
              Формирование глобального сообщества лидеров на принципах равенства, 
              укрепление долгосрочных связей СПб/РФ с миром.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">Здесь будет размещена расширенная информация о миссии организации, ее целях и задачах на будущее.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center bg-[#FCEB9C] rounded-[40px] mb-12 shadow-sm max-w-4xl">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">Как стать активистом?</h3>
        <p className="text-lg mb-4 text-gray-700">Мы ищем активных людей, готовых развивать город вместе с нами!</p>
        <p className="text-lg mb-8 text-gray-700">Здесь появится подробная инструкция по вступлению в волонтерское движение.</p>
        <button className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-colors text-lg shadow-md hover:shadow-lg">
          Подать заявку
        </button>
      </section>
    </div>
  );
};

const EventsPage = () => {
  const approvedEvents = DB_EVENTS.filter(event => event.approved);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">
          Мероприятия
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          
          <div className="md:w-3/4 flex flex-col">
            {approvedEvents.length > 0 ? (
              approvedEvents.map(event => (
                <EventCard key={event.id} title={event.title} date={event.date} />
              ))
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl">Мероприятий пока нет.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage = () => {
  const approvedNews = DB_NEWS.filter(news => news.approved);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">
          Новости
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          
          <div className="md:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedNews.length > 0 ? (
              approvedNews.map(news => (
                <NewsCard key={news.id} title={news.title} date={news.date} />
              ))
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl col-span-full">Новостей пока нет.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CityPage = () => (
  <div className="min-h-[70vh] bg-white flex items-center justify-center">
    <p className="text-gray-400 text-2xl font-bold">Страница города (в разработке)</p>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();

  const linkClass = (path) => 
    `font-bold text-lg hover:text-[#0FA958] transition-colors ${
      location.pathname === path ? 'text-[#0FA958]' : 'text-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      
      <header className="bg-white py-4 px-8 flex items-center shadow-md sticky top-0 z-50">
        
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center">
            <img src="/МКД_логотип.jpg" alt="МКД Логотип" className="h-16 w-16 object-contain" />
          </Link>
        </div>

        <nav className="hidden md:flex gap-8 items-center justify-center">
          <Link to="/" className={linkClass('/')}>О нас</Link>
          <Link to="/city" className={linkClass('/city')}>О нашем городе</Link>
          <Link to="/news" className={linkClass('/news')}>Новости</Link>
          <Link to="/events" className={linkClass('/events')}>Мероприятия</Link>
        </nav>

        <div className="flex-1 flex gap-4 items-center justify-end">
          <button className="border-2 border-[#0FA958] text-[#0FA958] bg-white font-bold rounded-full px-4 py-1 hover:bg-[#0FA958] hover:text-white transition-colors">
            RU
          </button>
          <button className="bg-[#0FA958] text-white font-bold rounded-full px-6 py-2 hover:bg-green-600 transition-colors shadow-sm">
            Войти
          </button>
          <button className="bg-[#C5E1A5] text-green-900 font-bold rounded-full px-6 py-2 hover:bg-[#aed884] transition-colors shadow-sm">
            Регистрация
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-[#E4D596] py-10 px-8 mt-auto border-t-[12px] border-[#D3C380]">
        <div className="container mx-auto max-w-[1200px]">
          <h4 className="font-bold text-xl mb-4 text-gray-800">Доп инфа. (Контакты и т.д.)</h4>
          <ul className="list-disc pl-5 font-medium space-y-2 text-gray-800">
            <li>Почта</li>
            <li>Ссылки на соц. сети</li>
          </ul>
        </div>
      </footer>
      
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/city" element={<CityPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}