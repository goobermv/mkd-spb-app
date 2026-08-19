import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/users/register', form);
      navigate('/login');
    } catch (err) {
      setError('Ошибка при регистрации. Проверьте данные.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>
      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Имя" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          className="border p-2 rounded" 
          required 
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={form.password} 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          className="border p-2 rounded" 
          required 
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;