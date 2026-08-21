import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

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

const COUNTRIES = [
  "Россия", "Беларусь", "Казахстан", "Австралия", "Австрия", "Азербайджан", "Албания", 
  "Алжир", "Ангола", "Андорра", "Антигуа и Барбуда", "Аргентина", "Армения", "Афганистан", 
  "Багамские Острова", "Бангладеш", "Барбадос", "Бахрейн", "Белиз", "Бельгия", "Бенин", 
  "Болгария", "Боливия", "Босния и Герцеговина", "Ботсвана", "Бразилия", "Бруней", 
  "Буркина-Фасо", "Бурунди", "Бутан", "Вануату", "Ватикан", "Великобритания", "Венгрия", 
  "Венесуэла", "Восточный Тимор", "Вьетнам", "Габон", "Гаити", "Гайана", "Гамбия", "Гана", 
  "Гватемала", "Гвинея", "Гвинея-Бисау", "Германия", "Гондурас", "Гренада", "Греция", 
  "Грузия", "Дания", "Джибути", "Доминика", "Доминиканская Республика", "Египет", 
  "Замбия", "Зимбабве", "Израиль", "Индия", "Индонезия", "Иордания", "Ирак", "Иран", 
  "Ирландия", "Исландия", "Испания", "Италия", "Йемен", "Кабо-Верде", "Камбоджа", 
  "Камерун", "Канада", "Катар", "Кения", "Кипр", "Кыргызстан", "Кирибати", "Китай", 
  "Колумбия", "Коморские Острова", "Конго (ДРК)", "Конго (Республика)", "Коста-Рика", 
  "Кот-д'Ивуар", "Куба", "Кувейт", "Лаос", "Латвия", "Лесото", "Либерия", "Ливан", 
  "Ливия", "Литва", "Лихтенштейн", "Люксембург", "Маврикий", "Мавритания", "Мадагаскар", 
  "Малави", "Малайзия", "Мали", "Мальдивы", "Мальта", "Марокко", "Маршалловы Острова", 
  "Мексика", "Микронезия", "Мозамбик", "Молдавия", "Монако", "Монголия", "Мьянма", 
  "Намибия", "Науру", "Непал", "Нигер", "Нигерия", "Нидерланды", "Никарагуа", 
  "Новая Зеландия", "Норвегия", "ОАЭ", "Оман", "Пакистан", "Палау", "Панама", 
  "Папуа — Новая Гвинея", "Парагвай", "Перу", "Польша", "Португалия", "Руанда", 
  "Румыния", "Сальвадор", "Самоа", "Сан-Марино", "Сан-Томе и Принсипи", "Саудовская Аравия", 
  "Северная Македония", "Сейшельские Острова", "Сенегал", "Сент-Винсент и Гренадины", 
  "Сент-Китс и Невис", "Сент-Люсия", "Сербия", "Сингапур", "Сирия", "Словакия", 
  "Словения", "США", "Сомали", "Судан", "Суринам", "Сьерра-Леоне", "Таджикистан", 
  "Таиланд", "Танзания", "Того", "Тонга", "Тринидад и Тобаго", "Тувалу", "Тунис", 
  "Туркменистан", "Турция", "Уганда", "Узбекистан", "Украина", "Уругвай", "Фиджи", 
  "Филиппины", "Финляндия", "Франция", "Хорватия", "ЦАР", "Чад", "Черногория", "Чехия", 
  "Чили", "Швейцария", "Швеция", "Шри-Ланка", "Эквадор", "Экваториальная Гвинея", 
  "Эритрея", "Эсватини", "Эстония", "Эфиопия", "ЮАР", "Южная Корея", "Южный Судан", 
  "Ямайка", "Япония"
];

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash === '#about') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

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

const EventCard = ({ title, date, description }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-6 flex flex-col md:flex-row justify-between mb-6 shadow-sm">
    <div className="flex flex-col justify-between w-full md:w-1/2 pr-4">
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description || "Текст с информацией..."}</p>
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

const NewsCard = ({ title, date, description }) => (
  <div className="bg-[#F5EFE6] rounded-2xl p-4 flex flex-col shadow-sm h-full">
    <div className="bg-white flex items-center justify-center text-gray-400 h-[150px] rounded-xl mb-4 border border-gray-100">
      Фото новости
    </div>
    <h4 className="font-bold mb-2 text-lg">{title}</h4>
    <p className="text-sm text-gray-600 mb-4 flex-grow">{description || "Краткая информация..."}</p>
    <p className="text-sm font-bold text-gray-800">{date}</p>
  </div>
);

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    setCurrentUser(prev => prev || {
      fullName: "Пользователь",
      email: email,
      birthDate: "Не указана",
      country: "Не указана",
      jobField: "Не указано",
      vkLink: "",
      userDescription: ""
    });
    
    navigate('/profile');
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-white py-12 px-4">
      <div className="bg-[#F6EFE6] w-full max-w-md rounded-[30px] p-10 shadow-sm">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Вход</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="text-lg font-bold mb-2 text-gray-900">Почта</label>
          <input 
            name="email"
            type="email" 
            required 
            className="w-full h-12 rounded-full px-5 mb-6 outline-none border border-transparent focus:border-[#0FA958] transition-colors" 
          />

          <label className="text-lg font-bold mb-2 text-gray-900">Пароль</label>
          <input 
            type="password" 
            required 
            className="w-full h-12 rounded-full px-5 mb-8 outline-none border border-transparent focus:border-[#0FA958] transition-colors" 
          />

          <button 
            type="submit" 
            className="bg-[#0FA958] text-white font-bold py-3 rounded-full mb-4 hover:bg-green-600 transition-colors shadow-md"
          >
            Войти
          </button>

          <button type="button" className="text-gray-900 font-bold hover:text-gray-600 transition-colors text-center w-full mb-6">
            Забыл пароль
          </button>

          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm font-semibold text-gray-700 hover:text-[#0FA958] transition-colors text-center w-full underline"
          >
            Ещё не зарегистрирован? Создай аккаунт
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    setCurrentUser(data);
    navigate('/profile'); 
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-white py-12 px-4">
      <div className="bg-[#F6EFE6] w-full max-w-3xl rounded-[30px] p-10 shadow-sm">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Регистрация</h2>
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-base font-bold mb-2 text-gray-900">ФИО</label>
            <input name="fullName" type="text" required className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold mb-2 text-gray-900">Электронная почта</label>
            <input name="email" type="email" required className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold mb-2 text-gray-900">Пароль</label>
            <input name="passwordHash" type="password" required className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold mb-2 text-gray-900">Дата рождения</label>
            <input name="birthDate" type="date" required className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm text-gray-600" />
          </div>

          <div className="flex flex-col">
            <label className="text-base font-bold mb-2 text-gray-900">Страна</label>
            <input 
              name="country" 
              list="countries-list" 
              type="text" 
              required 
              placeholder="Выберите или введите страну"
              className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" 
            />
            <datalist id="countries-list">
              {COUNTRIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-base font-bold mb-2 text-gray-900">Место учебы/работы</label>
            <input name="jobField" type="text" required className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" />
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-base font-bold mb-2 text-gray-900">Ссылка на ВКонтакте</label>
            <input name="vkLink" type="url" placeholder="https://vk.com/id..." className="w-full h-10 rounded-full px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm" />
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-base font-bold mb-2 text-gray-900">О себе</label>
            <textarea 
              name="userDescription" 
              rows="3" 
              placeholder="Расскажите немного о себе, о ваших хобби и интересах"
              className="w-full rounded-2xl py-3 px-5 outline-none focus:border-[#0FA958] border border-transparent shadow-sm resize-none"
            ></textarea>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <button 
              type="submit" 
              className="w-full bg-[#0FA958] text-white text-lg font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md"
            >
              Создать аккаунт
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const user = currentUser || {
    fullName: "Пользователь не авторизован",
    email: "—",
    birthDate: "—",
    country: "—",
    jobField: "—",
    vkLink: "",
    userDescription: ""
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1000px]">
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
        
        <div className="md:w-1/3 flex flex-col items-center border-r border-gray-100 pr-0 md:pr-10">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 flex items-center justify-center text-4xl shadow-inner">
            👤
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{user.fullName}</h3>
          <p className="text-gray-500 mb-8">Участник</p>
          <button 
            onClick={handleLogout}
            className="text-red-500 font-bold hover:text-red-700 transition-colors"
          >
            Выйти из аккаунта
          </button>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Личный кабинет</h2>
          
          <div className="bg-[#F5EFE6] rounded-3xl p-6 mb-6 flex flex-col gap-3">
            <h4 className="font-bold text-xl mb-2 text-gray-900 border-b pb-2 border-gray-300">Мои данные</h4>
            
            <p className="text-gray-800">
              <strong className="font-semibold text-gray-900">Электронная почта:</strong> {user.email}
            </p>
            
            <p className="text-gray-800">
              <strong className="font-semibold text-gray-900">Дата рождения:</strong> {user.birthDate}
            </p>

            <p className="text-gray-800">
              <strong className="font-semibold text-gray-900">Страна:</strong> {user.country}
            </p>

            <p className="text-gray-800">
              <strong className="font-semibold text-gray-900">Место учебы/работы:</strong> {user.jobField}
            </p>

            {user.vkLink && (
              <p className="text-gray-800">
                <strong className="font-semibold text-gray-900">ВКонтакте:</strong>{' '}
                <a href={user.vkLink} target="_blank" rel="noreferrer" className="text-[#0FA958] underline hover:text-green-700 break-all">
                  {user.vkLink}
                </a>
              </p>
            )}

            {user.userDescription && (
              <p className="text-gray-800">
                <strong className="font-semibold text-gray-900">О себе:</strong> {user.userDescription}
              </p>
            )}
          </div>

          <div className="bg-[#E4D596] rounded-3xl p-6 text-white shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Мои мероприятия</h4>
            <p className="text-gray-700">Вы пока не зарегистрированы ни на одно мероприятие.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

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

  const getVisibleNews = () => {
    if (top5News.length === 0) return [];
    const count = Math.min(3, top5News.length);
    const visible = [];
    for (let i = 0; i < count; i++) {
      visible.push(top5News[(newsIndex + i) % top5News.length]);
    }
    return visible;
  };

  const visibleNews = getVisibleNews();

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
        <button onClick={prevHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all duration-300 z-10 shadow-md hover:shadow-xl hover:-translate-x-1 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <button onClick={nextHeroSlide} className="bg-white/90 p-3 rounded-full hover:bg-white transition-all duration-300 z-10 shadow-md hover:shadow-xl hover:translate-x-1 text-gray-700">
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
                <button onClick={prevNews} className="bg-white p-3 rounded-full shadow-md transition-all duration-300 z-10 hover:shadow-lg hover:-translate-x-1 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {visibleNews.map(item => <NewsCard key={item.id} title={item.title} date={item.date} description={item.description} />)}
                </div>
                <button onClick={nextNews} className="bg-white p-3 rounded-full shadow-md transition-all duration-300 z-10 hover:shadow-lg hover:translate-x-1 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              </>
            ) : (
              <p className="text-center text-gray-700 text-lg w-full py-10">Новостей пока нет (ожидание данных из БД).</p>
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
            <p className="text-gray-700 leading-relaxed text-justify">Здесь будет располагаться подробный текст об истории создания МКД Санкт-Петербурга. Мы дополним этот текст позже, когда будет готова полная информация.</p>
          </div>
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner">Место для фото "История"</div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
          <div className="md:w-1/3 h-[300px] w-full bg-gray-200 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner order-2 md:order-1">Место для фото "Миссия"</div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наша миссия</h3>
            <p className="text-lg text-gray-800 font-medium mb-4">Формирование глобального сообщества лидеров на принципах равенства, укрепление долгосрочных связей СПб/РФ с миром.</p>
            <p className="text-gray-700 leading-relaxed text-justify">Здесь будет размещена расширенная информация о миссии организации, ее целях и задачах на будущее.</p>
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

const EventsPage = ({ eventsList }) => {
  const approvedEvents = eventsList.filter(event => event.approved);
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">Мероприятия</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <div className="md:w-3/4 flex flex-col">
            {approvedEvents.length > 0 ? (
              approvedEvents.map(event => <EventCard key={event.id} title={event.title} date={event.date} description={event.description} />)
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl">Мероприятий пока нет.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage = ({ newsList }) => {
  const approvedNews = newsList.filter(news => news.approved);
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">Новости</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <div className="md:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedNews.length > 0 ? (
              approvedNews.map(news => <NewsCard key={news.id} title={news.title} date={news.date} description={news.description} />)
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
  <div className="container mx-auto px-4 py-12 max-w-[1200px]">
    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
      О нашем городе — Санкт-Петербург
    </h2>

    <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Культурная столица</h3>
        <p className="text-gray-700 leading-relaxed mb-4 text-justify text-lg">
          Санкт-Петербург — один из красивейших мегаполисов мира, основанный Петром Великим в 1703 году. 
          Город часто с любовью называют «Северной Венецией» из-за невероятного обилия рек, каналов, 
          живописных набережных и сотен мостов, разводные пролеты которых стали визитной карточкой города.
        </p>
        <p className="text-gray-700 leading-relaxed text-justify text-lg">
          Архитектурный облик Северной столицы поражает гармонией стилей: от изящного петровского барокко 
          до строгого классицизма и выразительного модерна. Исторический центр Петербурга входит в список 
          объектов Всемирного наследия ЮНЕСКО. Город обладает богатейшим литературным и художественным наследием, 
          вдохновлявшим Пушкина, Достоевского и Гоголя, и по праву остается культурным сердцем страны.
        </p>
      </div>
      
      <div className="md:w-1/2 w-full h-[350px] bg-[#F5EFE6] rounded-3xl flex flex-col justify-center items-center text-gray-400 shadow-inner overflow-hidden border border-gray-200">
        <span className="text-4xl mb-2">🏛️</span>
        <span className="font-bold">Место для фото: Архитектура СПб</span>
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
      <div className="md:w-1/2 w-full h-[350px] bg-[#F5EFE6] rounded-3xl flex flex-col justify-center items-center text-gray-400 shadow-inner overflow-hidden border border-gray-200 order-2 md:order-1">
         <span className="text-4xl mb-2">🎓</span>
         <span className="font-bold">Место для фото: Студенты / ВУЗы</span>
      </div>
      <div className="md:w-1/2 order-1 md:order-2">
        <h3 className="text-2xl font-bold mb-4 text-[#0FA958]">Наука и инновации</h3>
        <p className="text-gray-700 leading-relaxed mb-4 text-justify text-lg">
          Петербург не только хранит вековые традиции, но и по праву считается крупнейшим 
          научно-образовательным центром. Здесь расположены ведущие вузы страны, выпускающие 
          высококлассных специалистов в самых разных областях — от фундаментальной физики 
          и инженерии до передовой медицины.
        </p>
        <p className="text-gray-700 leading-relaxed text-justify text-lg">
          Сегодня город стремительно смотрит в будущее: здесь активно развивается IT-сектор, 
          искусственный интеллект, биотехнологии и креативные индустрии. Современные технопарки 
          и исследовательские центры делают Петербург идеальным местом для стартапов, молодых 
          ученых и инициативных предпринимателей, стремящихся реализовать свои самые смелые идеи.
        </p>
      </div>
    </div>

    <div className="bg-[#E4D596] rounded-[40px] p-8 md:p-12 shadow-md">
      <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Город для молодежи</h3>
      <p className="text-lg text-gray-800 text-center max-w-3xl mx-auto mb-10 font-medium">
        Санкт-Петербург предоставляет огромные возможности для самореализации, гражданской 
        активности и волонтерства. Именно здесь мы объединяем инициативных людей для создания 
        комфортной городской среды.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FBF9F6] p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
          <div className="h-40 w-full bg-white rounded-2xl mb-6 flex flex-col justify-center items-center text-gray-400 border border-gray-100">
            <span className="text-3xl mb-1">🤝</span>
            <span className="text-sm font-bold">Фото: Общество</span>
          </div>
          <h4 className="font-bold text-xl mb-3 text-gray-800">Общественные проекты</h4>
          <p className="text-base text-gray-600">Участие в развитии городской инфраструктуры и социальных инициативах.</p>
        </div>
        
        <div className="bg-[#FBF9F6] p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
          <div className="h-40 w-full bg-white rounded-2xl mb-6 flex flex-col justify-center items-center text-gray-400 border border-gray-100">
            <span className="text-3xl mb-1">🏃‍♂️</span>
            <span className="text-sm font-bold">Фото: Спорт</span>
          </div>
          <h4 className="font-bold text-xl mb-3 text-gray-800">Спорт и здоровье</h4>
          <p className="text-base text-gray-600">Сотни современных площадок, марафоны и фестивали для активного отдыха.</p>
        </div>
        
        <div className="bg-[#FBF9F6] p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
          <div className="h-40 w-full bg-white rounded-2xl mb-6 flex flex-col justify-center items-center text-gray-400 border border-gray-100">
            <span className="text-3xl mb-1">🎨</span>
            <span className="text-sm font-bold">Фото: Творчество</span>
          </div>
          <h4 className="font-bold text-xl mb-3 text-gray-800">Творческий потенциал</h4>
          <p className="text-base text-gray-600">Креативные кластеры, современные выставки, концерты и уникальные арт-пространства.</p>
        </div>
      </div>
    </div>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
              <button onClick={() => navigate('/login')} className="bg-[#0FA958] text-white font-bold rounded-full px-6 py-2 hover:bg-green-600 transition-colors shadow-sm">Войти</button>
              <button onClick={() => navigate('/register')} className="bg-[#C5E1A5] text-green-900 font-bold rounded-full px-6 py-2 hover:bg-[#aed884] transition-colors shadow-sm">Регистрация</button>
            </div>
          </>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {!isAuthPage && (
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

export default function App() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage newsList={news} />} />
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