import React, { useState } from 'react';

const MOCK_EVENTS = [
  { id: 1, title: 'Международный молодежный форум', category: 'Образование', date: '2025-10-15T10:00', description: 'Обсуждение глобальных молодежных инициатив и обмен опытом между странами-участницами.', image: 'https://placehold.co/600x400/2E1D67/FFF?text=МКД+Форум' },
  { id: 2, title: 'Городской Эко-марафон', category: 'Экология', date: '2025-05-20T12:00', description: 'Масштабная акция по благоустройству парковых зон Санкт-Петербурга.', image: 'https://placehold.co/600x400/00A552/FFF?text=Экология' },
  { id: 3, title: 'Спортивный турнир дружбы', category: 'Спорт', date: '2025-06-10T14:00', description: 'Соревнования по волейболу среди молодежных клубов города.', image: 'https://placehold.co/600x400/FBBA00/2E1D67?text=Турнир' },
];

const MOCK_NEWS = [
  { id: 1, title: 'Открытие нового сезона проектов МКД СПб', category: 'Официально', date: '2025-04-01', description: 'Мы рады объявить о старте нового сезона. В этом году вас ждет еще больше возможностей для реализации своих идей!', image: 'https://placehold.co/600x400/EB5893/FFF?text=Новость+1' },
  { id: 2, title: 'Итоги благотворительной ярмарки', category: 'Общество', date: '2025-03-15', description: 'Благодаря вашей активности мы смогли собрать средства на поддержку приютов.', image: 'https://placehold.co/600x400/6856BC/FFF?text=Итоги' },
];

const HomePage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F8] font-['Onest',sans-serif]">
      
      <section className="bg-[#2E1D67] text-white py-20 px-8 rounded-br-[120px] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EB5893] rounded-bl-full opacity-20 translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-[#FBBA00] rounded-tr-full opacity-20 translate-y-10"></div>
        
        <div className="container mx-auto max-w-[1200px] relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-6 leading-tight">
            Международный <br className="hidden md:block"/> <span className="text-[#FBBA00]">Клуб Дружбы</span> <br className="hidden md:block"/> Санкт-Петербурга
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#F0D8C2] max-w-3xl mx-auto">
            Санкт-Петербургская площадка для реализации молодёжных инициатив, обмена опытом и создания международных проектов.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-4 py-12">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { id: 'about', label: 'О клубе' },
            { id: 'events', label: 'Мероприятия' },
            { id: 'news', label: 'Новости' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className="px-8 py-4 rounded-full text-sm md:text-base font-black transition-all uppercase tracking-widest border-2 bg-white text-[#2E1D67] border-[#F0D8C2] hover:border-[#EB5893] hover:text-[#EB5893] shadow-md"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Секция О нас возвращена к последовательной верстке, чтобы якоря работали */}
        <div id="about" className="scroll-mt-24 mb-20 bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl p-10 md:p-16 shadow-xl border-t-8 border-[#00A552]">
          <h2 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-6">О нашем движении (МКД СПб)</h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6">
            Мы объединяем активную молодежь для создания проектов, направленных на развитие международного сотрудничества, экологии, спорта и культуры. Наша цель — дать каждому возможность проявить себя и найти единомышленников в Международном клубе дружбы Санкт-Петербурга.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
             <div className="bg-[#F0D8C2]/40 p-8 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg border border-[#F0D8C2] text-center hover:bg-[#F0D8C2]/80 transition-colors">
               <span className="text-5xl block mb-4">🌍</span>
               <h4 className="font-black text-[#2E1D67] uppercase tracking-wider">Международные связи</h4>
             </div>
             <div className="bg-[#F0D8C2]/40 p-8 rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg border border-[#F0D8C2] text-center hover:bg-[#F0D8C2]/80 transition-colors">
               <span className="text-5xl block mb-4">🚀</span>
               <h4 className="font-black text-[#2E1D67] uppercase tracking-wider">Поддержка инициатив</h4>
             </div>
             <div className="bg-[#F0D8C2]/40 p-8 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg border border-[#F0D8C2] text-center hover:bg-[#F0D8C2]/80 transition-colors">
               <span className="text-5xl block mb-4">🤝</span>
               <h4 className="font-black text-[#2E1D67] uppercase tracking-wider">Новые друзья</h4>
             </div>
          </div>
        </div>

        <div id="events" className="scroll-mt-24 mb-20">
          <h2 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-10 text-center">Ближайшие мероприятия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-[#00A552] flex flex-col overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#00A552] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {event.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-[#6856BC] text-sm font-bold mb-2 uppercase tracking-wide">📅 {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                  <h3 className="text-xl font-black text-[#2E1D67] mb-3 leading-tight uppercase">{event.title}</h3>
                  <p className="text-gray-600 text-sm font-medium line-clamp-3 mb-4 flex-grow">{event.description}</p>
                  <button className="self-start text-[#EB5893] font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:text-[#2E1D67] transition-colors">
                    Подробнее <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="news" className="scroll-mt-24 mb-20">
          <h2 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-10 text-center">Новости МКД СПб</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_NEWS.map(news => (
              <div key={news.id} onClick={() => setSelectedNews(news)} className="bg-white rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-[#EB5893] flex flex-col md:flex-row overflow-hidden group">
                <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative bg-[#F0D8C2]">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                </div>
                <div className="p-8 flex flex-col justify-center w-full md:w-3/5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[#FBBA00] text-[#2E1D67] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{news.category}</span>
                    <span className="text-[#6856BC] text-sm font-bold uppercase">📅 {new Date(news.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#2E1D67] uppercase leading-tight mb-3">{news.title}</h3>
                  <p className="text-gray-600 text-sm font-medium line-clamp-2">{news.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Модалки (не изменяем логику, только стили) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 bg-white w-12 h-12 rounded-full flex items-center justify-center text-[#EB5893] text-2xl font-bold shadow-md hover:bg-[#EB5893] hover:text-white transition-colors z-10">×</button>
            
            <div className="h-64 md:h-80 w-full relative rounded-tr-[80px]">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover rounded-tr-[80px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-tr-[80px]"></div>
              <div className="absolute bottom-6 left-8 right-8">
                <span className="bg-[#00A552] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block shadow-md">{selectedEvent.category}</span>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide leading-tight">{selectedEvent.title}</h2>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-6 mb-8 text-[#2E1D67] font-black uppercase tracking-widest text-sm">
                <div className="flex items-center gap-2"><span className="text-[#EB5893] text-xl">📅</span> {new Date(selectedEvent.date).toLocaleString()}</div>
                <div className="flex items-center gap-2"><span className="text-[#EB5893] text-xl">📍</span> МКД Санкт-Петербург</div>
              </div>
              <h3 className="text-xl font-black text-[#2E1D67] uppercase mb-4 tracking-widest">О мероприятии</h3>
              <p className="text-gray-700 font-medium leading-relaxed mb-8 text-lg">{selectedEvent.description}</p>
              
              <div className="flex justify-center border-t-2 border-[#F0D8C2] pt-8">
                <button className="bg-[#6856BC] hover:bg-[#2E1D67] text-white text-lg font-black py-4 px-12 rounded-full transition-colors shadow-xl uppercase tracking-widest">
                  Принять участие
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedNews(null)}>
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl shadow-2xl relative p-8 md:p-12" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            
            <div className="flex items-center justify-between mb-8 border-b-2 border-[#F0D8C2] pb-6 mt-4">
              <span className="bg-[#FBBA00] text-[#2E1D67] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">{selectedNews.category}</span>
              <span className="text-[#6856BC] font-black uppercase tracking-widest text-sm">📅 {new Date(selectedNews.date).toLocaleDateString('ru-RU')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#2E1D67] mb-8 leading-tight uppercase tracking-wide">{selectedNews.title}</h2>
            
            <div className="w-full h-64 md:h-80 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg overflow-hidden mb-8 shadow-lg border-4 border-[#F0D8C2]">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="prose max-w-none text-gray-700 font-medium leading-relaxed text-lg">
              <p>{selectedNews.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;