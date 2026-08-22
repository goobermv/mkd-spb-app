import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children, currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';

  const linkClass = (path) => 
    `font-bold text-lg hover:text-[#0FA958] transition-colors ${
      location.pathname === path && !location.hash ? 'text-[#0FA958]' : 'text-gray-800'
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
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      <header className="bg-white py-4 px-8 flex items-center shadow-md sticky top-0 z-50">
        <div className="flex-1 flex justify-start">
          <a href="/" onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <img src="/МКД_логотип.jpg" alt="МКД Логотип" className="h-16 w-16 object-contain" />
          </a>
        </div>

        {!isAuthPage && (
          <>
            <nav className="hidden md:flex gap-8 items-center justify-center">
              <a href="/#about" onClick={handleAboutClick} className={`font-bold text-lg hover:text-[#0FA958] transition-colors ${location.hash === '#about' ? 'text-[#0FA958]' : 'text-gray-800'}`}>О нас</a>
              <Link to="/city" className={linkClass('/city')}>О нашем городе</Link>
              <Link to="/news" className={linkClass('/news')}>Новости</Link>
              <Link to="/events" className={linkClass('/events')}>Мероприятия</Link>
            </nav>

            <div className="flex-1 flex gap-4 items-center justify-end">
              <button className="border-2 border-[#0FA958] text-[#0FA958] bg-white font-bold rounded-full px-4 py-1 hover:bg-[#0FA958] hover:text-white transition-colors">RU</button>
              
              {currentUser ? (
                <button 
                  onClick={() => navigate('/profile')} 
                  className="bg-[#0FA958] text-white font-bold rounded-full px-6 py-2 hover:bg-green-600 transition-colors shadow-sm"
                >
                  Личный кабинет
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="bg-[#0FA958] text-[#ffffff] font-bold rounded-full px-6 py-2 hover:bg-green-600 transition-colors shadow-sm">Войти</button>
                  <button onClick={() => navigate('/register')} className="bg-[#C5E1A5] text-green-900 font-bold rounded-full px-6 py-2 hover:bg-[#aed884] transition-colors shadow-sm">Регистрация</button>
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
        <footer className="bg-[#E4D596] py-10 px-8 mt-auto border-t-[12px] border-[#D3C380]">
          <div className="container mx-auto max-w-[1200px]">
            <h4 className="font-bold text-xl mb-4 text-gray-800">Доп инфа. (Контакты и т.д.)</h4>
            <ul className="list-disc pl-5 font-medium space-y-2 text-gray-800">
              <li>Почта</li>
              <li>Ссылки на соц. сети</li>
            </ul>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;