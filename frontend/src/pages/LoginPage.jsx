import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const mockUser = {
      id: 1,
      email: data.email,
      fullName: 'Иван Иванов',
      role: 'activist',
      birthDate: '2000-01-01',
      country: 'Россия'
    };
    
    setCurrentUser(mockUser);
    navigate(sessionStorage.getItem('pendingApplication') === 'true' ? '/' : '/profile');
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#F4F5F8] py-12 px-4 relative overflow-hidden font-['Onest',sans-serif]">
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#FBBA00] rounded-bl-full rounded-tr-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#EB5893] rounded-tl-full rounded-br-full opacity-10"></div>

      <div className="bg-[#F0D8C2] w-full max-w-xl rounded-tr-[80px] rounded-bl-[80px] rounded-tl-3xl rounded-br-3xl p-10 md:p-14 shadow-2xl relative z-10 border-4 border-white">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-2">Вход</h2>
          <p className="text-[#6856BC] font-bold uppercase tracking-wide">С возвращением в МКД СПб!</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="Введите ваш email"
              className="w-full h-14 rounded-full px-6 outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67]" 
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black mb-2 text-[#2E1D67] uppercase tracking-widest">Пароль</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full h-14 rounded-full px-6 outline-none focus:border-[#6856BC] border-2 border-transparent shadow-inner font-medium text-lg text-[#2E1D67]" 
            />
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full bg-[#00A552] text-white text-xl font-black py-4 rounded-full hover:bg-[#328D2E] transition-colors shadow-xl uppercase tracking-widest">
              Войти
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm font-bold text-[#2E1D67] uppercase tracking-wide">
              Нет аккаунта? <Link to="/register" className="text-[#EB5893] hover:text-[#2E1D67] transition-colors underline underline-offset-4">Зарегистрироваться</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;