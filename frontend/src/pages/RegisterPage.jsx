import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/constants';

const RegisterPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data.role = 'user';
    setCurrentUser(data);
    
    if (sessionStorage.getItem('pendingApplication') === 'true') {
      navigate('/');
    } else {
      navigate('/profile');
    }
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
              placeholder="Выберите страну"
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

          <div className="col-span-1 md:col-span-2 mt-4">
            <button type="submit" className="w-full bg-[#0FA958] text-white text-lg font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md">
              Создать аккаунт
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;