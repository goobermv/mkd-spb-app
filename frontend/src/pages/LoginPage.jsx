import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await apiClient.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      
      if (sessionStorage.getItem('pendingApplication') === 'true') {
        sessionStorage.removeItem('pendingApplication');
        navigate('/');
      } else if (sessionStorage.getItem('redirectAfterLogin') === 'events') {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate('/events');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#F4F5F8] py-16 px-4 relative overflow-hidden font-['Onest',sans-serif]">
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#FBBA00] rounded-bl-full rounded-tr-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00A552] rounded-tl-full rounded-br-full opacity-10"></div>

      <div className="bg-white w-full max-w-2xl rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl p-10 md:p-14 shadow-2xl relative z-10 border-t-8 border-[#EB5893]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-2">Вход</h2>
          <p className="text-[#6856BC] font-bold uppercase tracking-wide">Добро пожаловать в МКД СПб!</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-y-6">
          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Email</label>
            <input name="email" type="email" required placeholder="example@mail.ru" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Пароль</label>
            <input name="password" type="password" required placeholder="••••••••" className="w-full h-14 rounded-full px-6 bg-[#F4F5F8] outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67] transition-colors" />
          </div>

          <div className="mt-4">
            <button type="submit" className="w-full bg-[#FBBA00] hover:bg-[#e0a700] text-white text-xl font-black py-4 rounded-full transition-colors shadow-xl uppercase tracking-widest">
              Войти
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-sm font-bold text-[#2E1D67] uppercase tracking-wide">
              Еще нет аккаунта?
              <Link to="/register" className="text-[#00A552] hover:text-[#2E1D67] transition-colors underline underline-offset-4 ml-1">Зарегистрироваться</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;