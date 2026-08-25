import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    let role = 'user';
    let fullName = 'Обычный Пользователь';

    if (email.includes('admin')) {
      role = 'admin';
      fullName = 'Администратор МКД';
    } else if (email.includes('activist')) {
      role = 'activist';
      fullName = 'Активист Иванов';
    }

    setCurrentUser({
      fullName: fullName,
      email: email,
      birthDate: "2000-01-01",
      country: "Россия",
      jobField: "СПбГУ",
      vkLink: "https://vk.com/id123456",
      userDescription: "Интересуюсь социальными проектами и развитием городской среды.",
      role: role 
    });
    
    if (sessionStorage.getItem('pendingApplication') === 'true') {
      navigate('/');
    } else {
      navigate('/profile');
    }
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
            placeholder="admin@mail.ru, activist@... или любая"
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

export default LoginPage;