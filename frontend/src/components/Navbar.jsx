import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/events" className="text-xl font-bold">МКД СПб</Link>
      <div className="flex gap-4 items-center">
        <Link to="/events" className="hover:underline">Мероприятия</Link>
        {user ? (
          <>
            <span className="text-sm bg-slate-700 px-3 py-1 rounded-full">{user.name} ({user.role || 'user'})</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Вход</Link>
            <Link to="/register" className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;