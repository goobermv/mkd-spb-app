import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';

const Layout = ({ children, currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';

  const linkClass = (path) => 
    `font-black text-sm uppercase tracking-widest hover:text-[#EB5893] transition-colors duration-200 ${
      location.pathname === path && !location.hash ? 'text-[#EB5893]' : 'text-[#2E1D67]'
    }`;

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#about');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex flex-col font-['Onest',sans-serif]">
      
      <header className="bg-white py-4 px-8 flex items-center shadow-md sticky top-0 z-50 border-b-4 border-[#FBBA00]">
        
        {/* Левый блок: Логотип */}
        <div className="flex-1 flex justify-start">
          <a href="/" onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <img src="/МКД_логотип.jpg" alt="МКД Логотип" className="h-14 w-14 object-contain" />
          </a>
        </div>

        {!isAuthPage && (
          <>
            {/* Центральный блок: Навигация */}
            <nav className="hidden md:flex gap-8 items-center justify-center">
              <a href="/#about" onClick={handleAboutClick} className={`font-black text-sm uppercase tracking-widest hover:text-[#EB5893] transition-colors ${location.hash === '#about' ? 'text-[#EB5893]' : 'text-[#2E1D67]'}`}>О нас</a>
              <Link to="/city" className={linkClass('/city')}>О городе</Link>
              <Link to="/news" className={linkClass('/news')}>Новости</Link>
              <Link to="/events" className={linkClass('/events')}>Мероприятия</Link>
            </nav>

            {/* Правый блок: Кнопки и уведомления */}
            <div className="flex-1 flex gap-4 items-center justify-end">
              <button className="border-2 border-[#0FA958] text-[#0FA958] bg-[#E8F5E9] font-bold rounded-full px-4 py-1 hover:bg-[#0FA958] hover:text-white transition-colors">
                RU
              </button>
              
              {currentUser ? (
                <>
                  <NotificationsDropdown userId={currentUser.id} />
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="bg-[#00A552] text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-2.5 hover:bg-[#328D2E] transition-colors shadow-md"
                  >
                    Личный кабинет
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="bg-[#00A552] text-white font-black uppercase tracking-widest text-sm rounded-full px-6 py-2.5 hover:bg-[#328D2E] transition-colors">Войти</button>
                  <button onClick={() => navigate('/register')} className="bg-[#F0D8C2] text-[#2E1D67] font-black uppercase tracking-widest text-sm rounded-full px-6 py-2.5 hover:bg-[#FBBA00] transition-colors">Регистрация</button>
                </>
              )}
            </div>
          </>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {!isAuthPage && !isProfilePage && (
        <footer className="bg-[#2E1D67] text-white py-12 px-8 mt-auto border-t-8 border-[#EB5893] relative overflow-hidden rounded-tl-[80px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBA00] rounded-bl-full opacity-20 pointer-events-none"></div>
          <div className="container mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between gap-8 relative z-10">
            <div>
              <h4 className="font-black uppercase tracking-widest text-2xl mb-4 text-[#FBBA00]">МКД СПб</h4>
              <p className="text-[#F0D8C2] mb-4 max-w-sm font-medium">Международный клуб дружбы Санкт-Петербурга — площадка для реализации молодёжных инициатив.</p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-lg mb-4 text-white">Контакты</h4>
              <ul className="space-y-2 text-[#F0D8C2] font-medium">
                <li><span className="font-bold text-white">Email:</span> tbd...</li>
                <li>
                  <span className="font-bold text-white">ВК:</span>{' '}
                  <a href="https://vk.ru/spb_friendshipclub" target="_blank" rel="noreferrer" className="hover:text-[#FBBA00] underline transition-colors">
                    vk.ru/spb_friendshipclub
                  </a>
                </li>
                <li>
                  <span className="font-bold text-white">Телеграм:</span>{' '}
                  <a href="https://t.me/friendshipclub_spb" target="_blank" rel="noreferrer" className="hover:text-[#FBBA00] underline transition-colors">
                    t.me/friendshipclub_spb
                  </a>
                </li>
                <li><span className="font-bold text-white">MAX:</span> tbd...</li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;