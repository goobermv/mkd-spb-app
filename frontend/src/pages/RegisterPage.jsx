import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="flex-grow flex items-center justify-center bg-[#F4F5F8] py-16 px-4 relative overflow-hidden font-['Onest',sans-serif]">
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#FBBA00] rounded-bl-full rounded-tr-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00A552] rounded-tl-full rounded-br-full opacity-10"></div>

      <div className="bg-white w-full max-w-4xl rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl p-10 md:p-14 shadow-2xl relative z-10 border-t-8 border-[#EB5893]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-2">Регистрация</h2>
          <p className="text-[#6856BC] font-bold uppercase tracking-wide">Присоединяйтесь к МКД СПб!</p>
        </div>
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">ФИО</label>
            <input name="fullName" type="text" required placeholder="Введите ваше полное имя" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Email</label>
            <input name="email" type="email" required placeholder="example@mail.ru" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Пароль</label>
            <input name="passwordHash" type="password" required placeholder="••••••••" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Дата рождения</label>
            <input name="birthDate" type="date" required className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors cursor-pointer" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Страна / Гражданство</label>
            <select name="country" required className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors appearance-none cursor-pointer">
              <option value="" disabled selected>Выберите страну</option>
              {COUNTRIES.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Место учебы / работы</label>
            <input name="jobField" type="text" placeholder="Университет или организация" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <button type="submit" className="w-full bg-[#FBBA00] hover:bg-[#e0a700] text-white text-xl font-black py-4 rounded-full transition-colors shadow-xl uppercase tracking-widest">
              Зарегистрироваться
            </button>
          </div>
          
          <div className="text-center mt-2 col-span-1 md:col-span-2">
            <p className="text-sm font-bold text-[#2E1D67] uppercase tracking-wide">
              Уже есть аккаунт? <Link to="/login" className="text-[#00A552] hover:text-[#2E1D67] transition-colors underline underline-offset-4">Войти</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;