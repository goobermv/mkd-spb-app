import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS } from '../data/constants'; 

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const isAdmin = currentUser.role === 'admin';
  const isActivist = currentUser.role === 'activist';

  const adminTabs = ['Заявки в актив', 'Модерация мероприятий', 'Модерация новостей', 'База пользователей', 'Мои мероприятия', 'Мои заявки (ожидают)', 'Архив', 'Статистика'];
  const activistTabs = ['Мои мероприятия', 'Мои заявки (ожидают)', 'Архив', 'Статистика'];
  const userTabs = ['Мои мероприятия', 'Настройки профиля'];
  
  const tabs = isAdmin ? adminTabs : isActivist ? activistTabs : userTabs;
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  const [editingNews, setEditingNews] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [pendingNews, setPendingNews] = useState([
    { id: 1, author_id: currentUser.id, title: 'Тестовая новость', description: 'Описание новости...', news_block_category: 'Спорт', news_block_picture: '', status: 'pending', author: currentUser.fullName || 'Активист Иванов' }
  ]);
  const [pendingEvents, setPendingEvents] = useState([
    { id: 1, author_id: currentUser.id, event_name: 'Городской субботник', description: 'Уборка парка', event_category: 'Экология', event_date_and_time: '2025-05-15T10:00', event_picture: '', status: 'pending', author: currentUser.fullName || 'Активист Иванов' }
  ]);

  const [myEvents] = useState([
    { id: 101, event_name: 'Экологический форум', event_category: 'Экология', event_date_and_time: '2025-06-20T12:00', description: 'Участие в обсуждении зеленых инициатив города.' }
  ]);

  const handleCreateNews = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('news_block_picture');
    
    const newNews = {
      id: Date.now(),
      author_id: currentUser.id,
      title: formData.get('title'),
      description: formData.get('description'),
      news_block_category: formData.get('news_block_category'),
      news_block_picture: pictureFile && pictureFile.name ? URL.createObjectURL(pictureFile) : '',
      status: 'pending',
      author: currentUser.fullName
    };
    
    setPendingNews([...pendingNews, newNews]);
    setIsNewsModalOpen(false);
    alert('Новость отправлена на модерацию!');
  };

  const handleUpdateNews = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('news_block_picture');

    setPendingNews(pendingNews.map(item => {
      if (item.id === editingNews.id) {
        return {
          ...item,
          title: formData.get('title'),
          description: formData.get('description'),
          news_block_category: formData.get('news_block_category'),
          news_block_picture: pictureFile && pictureFile.name ? URL.createObjectURL(pictureFile) : item.news_block_picture
        };
      }
      return item;
    }));

    setEditingNews(null);
    alert('Заявка на новость обновлена!');
  };

  const withdrawNews = (id) => {
    if (window.confirm('Вы уверены, что хотите отозвать эту заявку?')) {
      setPendingNews(pendingNews.filter(n => n.id !== id));
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('event_picture');

    const newEvent = {
      id: Date.now(),
      author_id: currentUser.id,
      event_name: formData.get('event_name'),
      description: formData.get('description'),
      event_category: formData.get('event_category'),
      event_date_and_time: formData.get('event_date_and_time'),
      event_picture: pictureFile && pictureFile.name ? URL.createObjectURL(pictureFile) : '',
      status: 'pending',
      author: currentUser.fullName
    };

    setPendingEvents([...pendingEvents, newEvent]);
    setIsEventModalOpen(false);
    alert('Мероприятие отправлено на модерацию!');
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('event_picture');

    setPendingEvents(pendingEvents.map(item => {
      if (item.id === editingEvent.id) {
        return {
          ...item,
          event_name: formData.get('event_name'),
          description: formData.get('description'),
          event_category: formData.get('event_category'),
          event_date_and_time: formData.get('event_date_and_time'),
          event_picture: pictureFile && pictureFile.name ? URL.createObjectURL(pictureFile) : item.event_picture
        };
      }
      return item;
    }));

    setEditingEvent(null);
    alert('Заявка на мероприятие обновлена!');
  };

  const withdrawEvent = (id) => {
    if (window.confirm('Вы уверены, что хотите отозвать эту заявку?')) {
      setPendingEvents(pendingEvents.filter(e => e.id !== id));
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      ...currentUser,
      fullName: formData.get('fullName'),
      birthDate: formData.get('birthDate'),
      country: formData.get('country'),
      jobField: formData.get('jobField'),
      vkLink: formData.get('vkLink'),
      userDescription: formData.get('userDescription')
    };
    setCurrentUser(updatedData);
    alert('Профиль успешно обновлен!');
  };

  const approveNews = (id) => {
    setPendingNews(pendingNews.filter(news => news.id !== id));
    alert('Новость одобрена и опубликована!');
  };

  const rejectNews = (id) => {
    setPendingNews(pendingNews.filter(news => news.id !== id));
    alert('Новость отклонена.');
  };

  const approveEvent = (id) => {
    setPendingEvents(pendingEvents.filter(ev => ev.id !== id));
    alert('Мероприятие одобрено и опубликовано!');
  };

  const rejectEvent = (id) => {
    setPendingEvents(pendingEvents.filter(ev => ev.id !== id));
    alert('Мероприятие отклонено.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px] flex flex-col lg:flex-row gap-8">
      
      <aside className="w-full lg:w-1/4 flex flex-col gap-6">
        <div className="bg-white rounded-[30px] p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#0FA958] flex items-center justify-center mb-4 bg-gray-100 overflow-hidden text-5xl">
            🧑‍💻
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentUser.fullName}</h2>
          <p className="text-[#0FA958] font-bold uppercase text-sm mb-6">
            {isAdmin ? 'Администратор' : isActivist ? 'Активист' : 'Пользователь'}
          </p>
          
          <div className="w-full bg-gray-50 rounded-2xl p-5 flex flex-col gap-3 text-left mb-4">
            <div className="flex items-center gap-3 text-gray-700">
              <span>📧</span> <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span>📅</span> <span>{currentUser.birthDate || 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span>🌍</span> <span>{currentUser.country || 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span>🎓</span> <span>{currentUser.jobField || 'Не указано'}</span>
            </div>
            {currentUser.vkLink && (
              <div className="flex items-center gap-3 text-blue-600 hover:underline">
                <span>🔗</span> <a href={currentUser.vkLink} target="_blank" rel="noreferrer">ВКонтакте</a>
              </div>
            )}
          </div>

          {currentUser.userDescription && (
            <div className="w-full text-left bg-gray-50 p-4 rounded-2xl text-sm text-gray-600">
              <span className="font-bold text-gray-800 block mb-1">О себе:</span>
              {currentUser.userDescription}
            </div>
          )}
        </div>

        <button 
          onClick={() => setActiveTab('Настройки профиля')} 
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-full transition-colors shadow-sm"
        >
          Настройки профиля
        </button>
        <button onClick={handleLogout} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-full transition-colors shadow-sm">
          Выйти из аккаунта
        </button>
      </aside>

      <main className="w-full lg:w-3/4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Панель администратора' : isActivist ? 'Личный кабинет активиста' : 'Личный кабинет'}
          </h1>
          
          {(isAdmin || isActivist) && (
            <div className="flex gap-4">
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-md"
              >
                + Мероприятие
              </button>
              <button 
                onClick={() => setIsNewsModalOpen(true)}
                className="bg-[#D3C380] hover:bg-[#c2b270] text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-md"
              >
                + Новость
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[30px] p-6 shadow-sm mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? 'bg-[#0FA958] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[30px] p-8 shadow-sm flex-grow min-h-[400px]">
          <h3 className="text-xl font-bold mb-6 text-gray-800">{activeTab}</h3>
          
          {activeTab === 'Мои мероприятия' && (
            <div className="flex flex-col gap-4">
              {myEvents.length === 0 ? (
                <p className="text-gray-500">Вы пока не зарегистрированы ни на одно мероприятие.</p>
              ) : (
                myEvents.map(ev => (
                  <div key={ev.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-900">{ev.event_name}</h4>
                      <span className="bg-green-100 text-[#0FA958] text-xs font-bold px-3 py-1 rounded-full">{ev.event_category}</span>
                    </div>
                    <p className="text-sm text-gray-500">Дата: {new Date(ev.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 text-sm mt-1">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Настройки профиля' && (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 max-w-xl">
              <div>
                <label className="block text-gray-700 font-bold mb-1">ФИО</label>
                <input type="text" name="fullName" defaultValue={currentUser.fullName} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Дата рождения</label>
                <input type="date" name="birthDate" defaultValue={currentUser.birthDate} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Страна</label>
                <input type="text" name="country" defaultValue={currentUser.country} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Место работы / учебы</label>
                <input type="text" name="jobField" defaultValue={currentUser.jobField} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Ссылка на VK</label>
                <input type="url" name="vkLink" defaultValue={currentUser.vkLink} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">О себе</label>
                <textarea name="userDescription" defaultValue={currentUser.userDescription} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none"></textarea>
              </div>
              <button type="submit" className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md mt-2 self-start">
                Сохранить изменения
              </button>
            </form>
          )}

          {activeTab === 'Модерация новостей' && isAdmin && (
            <div className="flex flex-col gap-4">
              {pendingNews.length === 0 ? <p className="text-gray-500">Нет новостей на модерации.</p> : null}
              {pendingNews.map(news => (
                <div key={news.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{news.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">Автор: {news.author} | Сектор: {news.news_block_category}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{news.description}</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button onClick={() => approveNews(news.id)} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Принять</button>
                    <button onClick={() => rejectNews(news.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-6 rounded-full transition-colors">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Модерация мероприятий' && isAdmin && (
            <div className="flex flex-col gap-4">
              {pendingEvents.length === 0 ? <p className="text-gray-500">Нет мероприятий на модерации.</p> : null}
              {pendingEvents.map(event => (
                <div key={event.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{event.event_name}</h4>
                    <p className="text-sm text-gray-500 mb-2">Автор: {event.author} | Сектор: {event.event_category} | Дата: {new Date(event.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button onClick={() => approveEvent(event.id)} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Принять</button>
                    <button onClick={() => rejectEvent(event.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-6 rounded-full transition-colors">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Мои заявки (ожидают)' && (isActivist || isAdmin) && (
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">Мероприятия на модерации</h4>
                <div className="flex flex-col gap-3">
                  {pendingEvents.filter(e => e.author_id === currentUser.id).length === 0 ? <p className="text-sm text-gray-500">Заявок нет</p> : null}
                  {pendingEvents.filter(e => e.author_id === currentUser.id).map(ev => (
                    <div key={ev.id} className="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="font-bold text-gray-900 block">{ev.event_name}</span>
                        <span className="text-xs text-gray-500">{ev.event_category} | {new Date(ev.event_date_and_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-700 text-xs font-bold bg-yellow-100 px-3 py-1.5 rounded-full">Ожидает</span>
                        <button onClick={() => setEditingEvent(ev)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Редактировать</button>
                        <button onClick={() => withdrawEvent(ev.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">Новости на модерации</h4>
                <div className="flex flex-col gap-3">
                  {pendingNews.filter(n => n.author_id === currentUser.id).length === 0 ? <p className="text-sm text-gray-500">Заявок нет</p> : null}
                  {pendingNews.filter(n => n.author_id === currentUser.id).map(nw => (
                    <div key={nw.id} className="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="font-bold text-gray-900 block">{nw.title}</span>
                        <span className="text-xs text-gray-500">{nw.news_block_category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-700 text-xs font-bold bg-yellow-100 px-3 py-1.5 rounded-full">Ожидает</span>
                        <button onClick={() => setEditingNews(nw)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Редактировать</button>
                        <button onClick={() => withdrawNews(nw.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {!['Мои мероприятия', 'Настройки профиля', 'Модерация новостей', 'Модерация мероприятий', 'Мои заявки (ожидают)'].includes(activeTab) && (
            <p className="text-gray-500 text-center py-10">Содержимое вкладки "{activeTab}" находится в разработке.</p>
          )}
        </div>
      </main>

      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsNewsModalOpen(false)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsNewsModalOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Предложить новость</h3>
            
            <form onSubmit={handleCreateNews} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Заголовок новости</label>
                <input type="text" name="title" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" placeholder="Введите заголовок" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Категория (Сектор)</label>
                <select name="news_block_category" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]">
                  <option value="">Выберите сектор...</option>
                  {SECTORS && SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Описание</label>
                <textarea name="description" required rows="5" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none" placeholder="Текст новости..."></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Изображение</label>
                <input type="file" name="news_block_picture" accept="image/*" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setIsNewsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">Отмена</button>
                <button type="submit" className="bg-[#D3C380] hover:bg-[#c2b270] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">Отправить на модерацию</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingNews && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingNews(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingNews(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Редактировать заявку на новость</h3>
            
            <form onSubmit={handleUpdateNews} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Заголовок новости</label>
                <input type="text" name="title" defaultValue={editingNews.title} required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Категория (Сектор)</label>
                <select name="news_block_category" defaultValue={editingNews.news_block_category} required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]">
                  <option value="">Выберите сектор...</option>
                  {SECTORS && SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Описание</label>
                <textarea name="description" defaultValue={editingNews.description} required rows="5" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Изображение (оставьте пустым, чтобы не менять)</label>
                <input type="file" name="news_block_picture" accept="image/*" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setEditingNews(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">Отмена</button>
                <button type="submit" className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEventModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsEventModalOpen(false)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsEventModalOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Создать мероприятие</h3>
            
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Название мероприятия</label>
                <input type="text" name="event_name" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" placeholder="Введите название" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Категория (Сектор)</label>
                  <select name="event_category" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]">
                    <option value="">Выберите сектор...</option>
                    {SECTORS && SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Дата и время</label>
                  <input type="datetime-local" name="event_date_and_time" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Описание</label>
                <textarea name="description" required rows="4" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none" placeholder="Подробности мероприятия..."></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Обложка мероприятия</label>
                <input type="file" name="event_picture" accept="image/*" required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">Отмена</button>
                <button type="submit" className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">Отправить на модерацию</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingEvent(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingEvent(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Редактировать заявку на мероприятие</h3>
            
            <form onSubmit={handleUpdateEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Название мероприятия</label>
                <input type="text" name="event_name" defaultValue={editingEvent.event_name} required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Категория (Сектор)</label>
                  <select name="event_category" defaultValue={editingEvent.event_category} required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]">
                    <option value="">Выберите сектор...</option>
                    {SECTORS && SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Дата и время</label>
                  <input type="datetime-local" name="event_date_and_time" defaultValue={editingEvent.event_date_and_time} required className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958]" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Описание</label>
                <textarea name="description" defaultValue={editingEvent.description} required rows="4" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Обложка мероприятия (оставьте пустым, чтобы не менять)</label>
                <input type="file" name="event_picture" accept="image/*" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setEditingEvent(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">Отмена</button>
                <button type="submit" className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;