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

  const adminTabs = ['Настройки профиля', 'База пользователей', 'Заявки в актив', 'Модерация мероприятий', 'Модерация новостей', 'Мои мероприятия', 'Мои инициативы', 'Архив', 'Статистика'];
  const activistTabs = ['Настройки профиля', 'Мои мероприятия', 'Мои инициативы', 'Архив', 'Статистика'];
  const userTabs = ['Настройки профиля', 'Мои мероприятия', 'Стать активистом', 'Архив'];
  
  const tabs = isAdmin ? adminTabs : isActivist ? activistTabs : userTabs;
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [viewingEvent, setViewingEvent] = useState(null);
  const [viewingNews, setViewingNews] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingActivistRequest, setViewingActivistRequest] = useState(null);

  const [pendingNews, setPendingNews] = useState([
    { id: 1, author_id: currentUser.id, title: 'Тестовая новость', description: 'Описание новости...', news_block_category: 'Спорт', news_block_picture: '', status: 'pending', author: currentUser.fullName || 'Активист Иванов' }
  ]);
  const [pendingEvents, setPendingEvents] = useState([
    { id: 1, author_id: currentUser.id, event_name: 'Городской субботник', description: 'Уборка парка', event_category: 'Экология', event_date_and_time: '2025-05-15T10:00', event_picture: '', status: 'pending', author: currentUser.fullName || 'Активист Иванов' }
  ]);

  const [myEvents] = useState([
    { id: 101, event_name: 'Экологический форум', event_category: 'Экология', event_date_and_time: '2025-06-20T12:00', description: 'Участие в обсуждении зеленых инициатив города.', status: 'approved' }
  ]);

  const [myOrganizedEvents, setMyOrganizedEvents] = useState([
    { id: 102, author_id: currentUser.id, event_name: 'Турнир по шахматам', event_category: 'Спорт', event_date_and_time: '2025-07-10T15:00', description: 'Городской турнир для всех желающих.', status: 'approved', participants_count: 12, author: currentUser.fullName }
  ]);

  const [activistRequests, setActivistRequests] = useState([
    { id: 1, userId: 201, fullName: 'Петр Петров', email: 'petr@example.com', reason: 'Хочу принимать активное участие в жизни района и помогать в организации мероприятий.', status: 'pending' }
  ]);

  const [usersList, setUsersList] = useState([
    { id: 201, fullName: 'Петр Петров', role: 'user', email: 'petr@example.com', birthDate: '2000-01-01', jobField: 'Студент СПбГУ', country: 'Россия', vkLink: 'https://vk.com/id123' },
    { id: currentUser.id, fullName: currentUser.fullName, role: currentUser.role, email: currentUser.email, birthDate: currentUser.birthDate, jobField: currentUser.jobField, country: currentUser.country, vkLink: currentUser.vkLink }
  ]);

  const [archiveItems] = useState([
    { id: 301, type: 'event', event_name: 'Прошлый субботник', event_category: 'Экология', event_date_and_time: '2024-10-10T10:00', description: 'Уборка территории в прошлом году.', status: 'archived' },
    { id: 302, type: 'news', title: 'Итоги 2024 года', news_block_category: 'Общество', description: 'Краткие итоги прошедшего года.', author: 'Администратор', status: 'archived' }
  ]);

  const [statistics] = useState({
    totalEvents: 45,
    totalNews: 128,
    totalActivists: 15,
    totalUsers: 340
  });


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

  const cancelApprovedEvent = (id) => {
    if (window.confirm('Вы точно хотите ОТМЕНИТЬ это мероприятие? Всем участникам будет разослано уведомление.')) {
      setMyOrganizedEvents(myOrganizedEvents.map(ev => ev.id === id ? { ...ev, status: 'cancelled' } : ev));
      setViewingEvent(prev => ({ ...prev, status: 'cancelled' }));
      alert('Мероприятие отменено. Уведомления участникам отправлены.');
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

  const handleApplyForActivist = (e) => {
    e.preventDefault();
    alert('Ваша заявка на вступление в актив успешно отправлена. Ожидайте решения администратора.');
    e.target.reset();
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
    const ev = pendingEvents.find(e => e.id === id);
    setPendingEvents(pendingEvents.filter(e => e.id !== id));
    if (ev.author_id === currentUser.id) {
       setMyOrganizedEvents([...myOrganizedEvents, { ...ev, status: 'approved', participants_count: 0 }]);
    }
    alert('Мероприятие одобрено и опубликовано!');
  };

  const rejectEvent = (id) => {
    setPendingEvents(pendingEvents.filter(ev => ev.id !== id));
    alert('Мероприятие отклонено.');
  };

  const approveActivist = (id) => {
    setActivistRequests(activistRequests.filter(req => req.id !== id));
    alert('Заявка в актив одобрена! Права пользователя повышены.');
  };

  const rejectActivist = (id) => {
    setActivistRequests(activistRequests.filter(req => req.id !== id));
    alert('Заявка в актив отклонена.');
  };

  const changeUserRole = (userId, newRole) => {
    if (window.confirm(`Вы уверены, что хотите изменить роль пользователя на "${newRole}"?`)) {
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (viewingUser && viewingUser.id === userId) {
        setViewingUser({ ...viewingUser, role: newRole });
      }
      alert('Роль успешно изменена!');
    }
  };

  const downloadList = (listName) => {
    alert(`Началась загрузка: ${listName}.csv`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const getRoleName = (role) => {
    if (role === 'admin') return 'Администратор';
    if (role === 'activist') return 'Активист';
    return 'Пользователь';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="text-yellow-700 bg-yellow-100 text-xs font-bold px-3 py-1 rounded-full">На модерации</span>;
      case 'approved': return <span className="text-green-700 bg-green-100 text-xs font-bold px-3 py-1 rounded-full">Одобрено</span>;
      case 'cancelled': return <span className="text-red-700 bg-red-100 text-xs font-bold px-3 py-1 rounded-full">Отменено</span>;
      case 'archived': return <span className="text-gray-700 bg-gray-200 text-xs font-bold px-3 py-1 rounded-full">В архиве</span>;
      default: return null;
    }
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
            {getRoleName(currentUser.role)}
          </p>
          
          <div className="w-full bg-gray-50 rounded-2xl p-5 flex flex-col gap-3 text-left mb-4">
            <div className="flex items-center gap-3 text-gray-700">
              <span>📧</span> <span className="truncate">{currentUser.email}</span>
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
              <div className="flex items-center gap-3 text-blue-600 hover:underline truncate">
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
                <label className="block text-gray-700 font-bold mb-1">Гражданство / Страна</label>
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

          {activeTab === 'Стать активистом' && (
            <div className="max-w-xl">
               <p className="text-gray-600 mb-6 leading-relaxed">
                 Активисты имеют возможность предлагать свои мероприятия, публиковать новости и участвовать в организации жизни Клуба Дружбы. Опишите вашу мотивацию, чтобы администратор рассмотрел заявку.
               </p>
               <form onSubmit={handleApplyForActivist} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Почему вы хотите стать активистом?</label>
                    <textarea name="reason" required rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] resize-none" placeholder="Расскажите о своем опыте и идеях..."></textarea>
                  </div>
                  <button type="submit" className="bg-[#D3C380] hover:bg-[#c2b270] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md self-start">
                    Подать заявку
                  </button>
               </form>
            </div>
          )}

          {activeTab === 'Мои мероприятия' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 mb-2">Здесь отображаются мероприятия, на которые вы зарегистрировались в качестве участника.</p>
              {myEvents.length === 0 ? (
                <p className="text-gray-500">Вы пока не зарегистрированы ни на одно мероприятие.</p>
              ) : (
                myEvents.map(ev => (
                  <div key={ev.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-2 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewingEvent(ev)}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-gray-900">{ev.event_name}</h4>
                      <div className="flex gap-2">
                        {getStatusBadge(ev.status)}
                        <span className="bg-green-100 text-[#0FA958] text-xs font-bold px-3 py-1 rounded-full">{ev.event_category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Дата: {new Date(ev.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 text-sm mt-1">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Мои инициативы' && (isActivist || isAdmin) && (
            <div className="flex flex-col gap-8">
              
              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm flex justify-between items-center">
                  Мои одобренные мероприятия
                </h4>
                <div className="flex flex-col gap-3">
                  {myOrganizedEvents.length === 0 ? <p className="text-sm text-gray-500">Одобренных инициатив пока нет.</p> : null}
                  {myOrganizedEvents.map(ev => (
                    <div key={ev.id} className="border border-green-100 bg-green-50/30 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-green-50 transition-colors shadow-sm" onClick={() => setViewingEvent(ev)}>
                      <div>
                        <span className="font-bold text-gray-900 block text-lg">{ev.event_name}</span>
                        <span className="text-xs text-gray-500">{ev.event_category} | Дата: {new Date(ev.event_date_and_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                          Участников: {ev.participants_count || 0}
                        </span>
                        <button onClick={() => setViewingEvent(ev)} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold text-sm px-4 py-1.5 rounded-full transition-colors">Управление</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-4 uppercase text-sm">Заявки на модерации</h4>
                
                <div className="flex flex-col gap-3 mb-4">
                  <h5 className="text-xs text-gray-500 font-bold">МЕРОПРИЯТИЯ</h5>
                  {pendingEvents.filter(e => e.author_id === currentUser.id).length === 0 ? <p className="text-sm text-gray-400">Нет заявок</p> : null}
                  {pendingEvents.filter(e => e.author_id === currentUser.id).map(ev => (
                    <div key={ev.id} className="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setViewingEvent(ev)}>
                      <div>
                        <span className="font-bold text-gray-900 block">{ev.event_name}</span>
                        <span className="text-xs text-gray-500">{ev.event_category}</span>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {getStatusBadge(ev.status)}
                        <button onClick={() => setEditingEvent(ev)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Редактировать</button>
                        <button onClick={() => withdrawEvent(ev.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <h5 className="text-xs text-gray-500 font-bold">НОВОСТИ</h5>
                  {pendingNews.filter(n => n.author_id === currentUser.id).length === 0 ? <p className="text-sm text-gray-400">Нет заявок</p> : null}
                  {pendingNews.filter(n => n.author_id === currentUser.id).map(nw => (
                    <div key={nw.id} className="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setViewingNews(nw)}>
                      <div>
                        <span className="font-bold text-gray-900 block">{nw.title}</span>
                        <span className="text-xs text-gray-500">{nw.news_block_category}</span>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {getStatusBadge(nw.status)}
                        <button onClick={() => setEditingNews(nw)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Редактировать</button>
                        <button onClick={() => withdrawNews(nw.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-1.5 rounded-full transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Модерация новостей' && isAdmin && (
            <div className="flex flex-col gap-4">
              {pendingNews.length === 0 ? <p className="text-gray-500">Нет новостей на модерации.</p> : null}
              {pendingNews.map(news => (
                <div key={news.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingNews(news)}>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{news.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">Автор: {news.author} | Сектор: {news.news_block_category}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{news.description}</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
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
                <div key={event.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingEvent(event)}>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{event.event_name}</h4>
                    <p className="text-sm text-gray-500 mb-2">Автор: {event.author} | Сектор: {event.event_category} | Дата: {new Date(event.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveEvent(event.id)} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Принять</button>
                    <button onClick={() => rejectEvent(event.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-6 rounded-full transition-colors">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Заявки в актив' && isAdmin && (
            <div className="flex flex-col gap-4">
              {activistRequests.length === 0 ? <p className="text-gray-500">Нет новых заявок.</p> : null}
              {activistRequests.map(req => (
                <div key={req.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingActivistRequest(req)}>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{req.fullName}</h4>
                    <p className="text-sm text-gray-500">{req.email}</p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveActivist(req.id)} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Принять</button>
                    <button onClick={() => rejectActivist(req.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-6 rounded-full transition-colors">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'База пользователей' && isAdmin && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end mb-2">
                 <button onClick={() => downloadList('Список_Всех_Пользователей')} className="bg-blue-50 text-blue-600 font-bold py-2 px-4 rounded-full text-sm hover:bg-blue-100 transition-colors">
                    ⬇ Скачать список (CSV)
                 </button>
              </div>
              {usersList.map(user => (
                <div key={user.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingUser(user)}>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{user.fullName}</h4>
                    <p className="text-sm text-gray-500">{user.email} | Роль: <span className="font-bold text-gray-700">{getRoleName(user.role)}</span></p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setViewingUser(user); }} className="text-[#0FA958] font-bold text-sm bg-green-50 px-4 py-2 rounded-full hover:bg-green-100">Управление</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Архив' && (
            <div className="flex flex-col gap-4">
              {archiveItems.map(item => (
                <div key={item.id} className="border border-gray-100 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-70" onClick={() => item.type === 'event' ? setViewingEvent(item) : setViewingNews(item)}>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 line-through decoration-gray-300">{item.event_name || item.title}</h4>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 mt-2 inline-block">
                      {item.type === 'event' ? 'Архивное Мероприятие' : 'Архивная Новость'}
                    </span>
                  </div>
                  <button className="text-gray-600 font-bold text-sm">Просмотр</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Статистика' && (isAdmin || isActivist) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
                 <span className="block text-4xl font-bold text-[#0FA958] mb-2">{statistics.totalEvents}</span>
                 <span className="text-sm font-bold text-gray-600 uppercase">Мероприятий</span>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
                 <span className="block text-4xl font-bold text-[#0FA958] mb-2">{statistics.totalNews}</span>
                 <span className="text-sm font-bold text-gray-600 uppercase">Новостей</span>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
                 <span className="block text-4xl font-bold text-[#0FA958] mb-2">{statistics.totalActivists}</span>
                 <span className="text-sm font-bold text-gray-600 uppercase">Активистов</span>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl text-center shadow-sm">
                 <span className="block text-4xl font-bold text-[#0FA958] mb-2">{statistics.totalUsers}</span>
                 <span className="text-sm font-bold text-gray-600 uppercase">Пользователей</span>
               </div>
            </div>
          )}

        </div>
      </main>


      {viewingEvent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingEvent(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingEvent(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="flex gap-2 mb-4">
              {getStatusBadge(viewingEvent.status)}
              <span className="bg-green-100 text-[#0FA958] text-xs font-bold px-3 py-1 rounded-full">{viewingEvent.event_category}</span>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">{viewingEvent.event_name}</h3>
            <p className="text-sm text-gray-500 mb-6">
              📅 {new Date(viewingEvent.event_date_and_time).toLocaleString()} {viewingEvent.author ? `| ✍️ Организатор: ${viewingEvent.author}` : ''}
            </p>
            {viewingEvent.event_picture && <img src={viewingEvent.event_picture} alt="Обложка" className="w-full h-64 object-cover rounded-2xl mb-6" />}
            
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-8">{viewingEvent.description}</div>

            {(viewingEvent.author_id === currentUser.id || isAdmin) && viewingEvent.status === 'approved' && activeTab === 'Мои инициативы' && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mt-4">
                <h4 className="font-bold text-gray-800 mb-4 uppercase text-sm">Управление мероприятием</h4>
                <p className="text-sm text-gray-600 mb-4">Всего записалось: <strong>{viewingEvent.participants_count || 0} чел.</strong></p>
                <div className="flex flex-wrap gap-3">
                   <button onClick={() => downloadList(`Участники_${viewingEvent.event_name}`)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-colors shadow-sm">
                     ⬇ Скачать список участников
                   </button>
                   <button onClick={() => cancelApprovedEvent(viewingEvent.id)} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-5 rounded-full text-sm transition-colors shadow-sm">
                     Отменить мероприятие
                   </button>
                </div>
              </div>
            )}
            
            {viewingEvent.status === 'approved' && viewingEvent.author_id !== currentUser.id && (
               <button onClick={() => alert('Чат с организаторами пока в разработке.')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-full text-sm transition-colors mt-4">
                 💬 Задать вопрос организатору
               </button>
            )}
          </div>
        </div>
      )}

      {viewingNews && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingNews(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingNews(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex gap-2 mb-4">
               {getStatusBadge(viewingNews.status)}
               <span className="bg-[#D3C380] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">{viewingNews.news_block_category}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{viewingNews.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{viewingNews.author ? `✍️ Автор: ${viewingNews.author}` : ''}</p>
            {viewingNews.news_block_picture && <img src={viewingNews.news_block_picture} alt="Изображение новости" className="w-full h-64 object-cover rounded-2xl mb-6" />}
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{viewingNews.description}</div>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-lg relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingUser(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-[#0FA958] flex items-center justify-center mb-4 bg-gray-100 text-4xl">🧑‍💻</div>
              <h3 className="text-2xl font-bold text-gray-900">{viewingUser.fullName}</h3>
              <p className="text-[#0FA958] font-bold uppercase text-xs mt-1">{getRoleName(viewingUser.role)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-gray-50 mb-6">
               <p><strong>Email:</strong> {viewingUser.email}</p>
               <p><strong>Дата рождения:</strong> {viewingUser.birthDate || 'Не указана'}</p>
               <p><strong>Учеба / Работа:</strong> {viewingUser.jobField || 'Не указано'}</p>
               <p><strong>Страна:</strong> {viewingUser.country || 'Не указана'}</p>
               {viewingUser.vkLink && <p><strong>VK:</strong> <a href={viewingUser.vkLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{viewingUser.vkLink}</a></p>}
            </div>
            
            {isAdmin && viewingUser.id !== currentUser.id && (
              <div className="bg-gray-100 p-4 rounded-2xl">
                 <p className="text-xs font-bold text-gray-500 mb-3 uppercase text-center">Изменить роль пользователя</p>
                 <div className="flex justify-center gap-2 flex-wrap">
                   {viewingUser.role !== 'user' && <button onClick={() => changeUserRole(viewingUser.id, 'user')} className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full text-xs shadow-sm">Сделать Пользователем</button>}
                   {viewingUser.role !== 'activist' && <button onClick={() => changeUserRole(viewingUser.id, 'activist')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 px-4 rounded-full text-xs shadow-sm">Назначить Активистом</button>}
                   {viewingUser.role !== 'admin' && <button onClick={() => changeUserRole(viewingUser.id, 'admin')} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-full text-xs shadow-sm">Сделать Администратором</button>}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewingActivistRequest && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingActivistRequest(null)}>
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-lg relative shadow-2xl" onClick={e => e.stopPropagation()}>
             <button onClick={() => setViewingActivistRequest(null)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка в актив</h3>
             <h4 className="text-lg font-bold text-gray-700">{viewingActivistRequest.fullName}</h4>
             <p className="text-sm text-gray-500 mb-4">{viewingActivistRequest.email}</p>
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 mb-6">
               <p className="font-bold mb-2">Причина / Мотивация:</p>
               <p className="text-gray-800 leading-relaxed">{viewingActivistRequest.reason}</p>
             </div>
             <div className="flex gap-4 justify-end">
                <button onClick={() => { approveActivist(viewingActivistRequest.id); setViewingActivistRequest(null); }} className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors">Сделать активистом</button>
                <button onClick={() => { rejectActivist(viewingActivistRequest.id); setViewingActivistRequest(null); }} className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-full transition-colors">Отклонить</button>
             </div>
          </div>
        </div>
      )}

      {(isNewsModalOpen || editingNews) && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setIsNewsModalOpen(false); setEditingNews(null); }} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{editingNews ? 'Редактировать новость' : 'Предложить новость'}</h2>
            <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="flex flex-col gap-5">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Заголовок</label>
                <input type="text" name="title" defaultValue={editingNews?.title} required className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors" placeholder="Введите заголовок..." />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Категория / Сектор</label>
                <select name="news_block_category" defaultValue={editingNews?.news_block_category || (SECTORS && SECTORS[0]?.title)} className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors">
                  {SECTORS ? SECTORS.map((sector, idx) => (
                    <option key={sector.id || idx} value={sector.title || sector}>{sector.title || sector}</option>
                  )) : (
                    <option value="Общество">Общество</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Текст новости</label>
                <textarea name="description" defaultValue={editingNews?.description} required rows="6" className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors resize-none" placeholder="Содержание новости..."></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Обложка</label>
                <input type="file" name="news_block_picture" accept="image/*" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#0FA958]/10 file:text-[#0FA958] hover:file:bg-[#0FA958]/20" />
              </div>
              <button type="submit" className="bg-[#D3C380] hover:bg-[#c2b270] text-white font-bold py-4 rounded-full transition-colors shadow-md mt-2 text-lg">
                {editingNews ? 'Сохранить изменения' : 'Отправить на модерацию'}
              </button>
            </form>
          </div>
        </div>
      )}

      {(isEventModalOpen || editingEvent) && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FBF9F6] rounded-[30px] p-8 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} className="absolute top-5 right-5 text-gray-500 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{editingEvent ? 'Редактировать мероприятие' : 'Создать мероприятие'}</h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="flex flex-col gap-5">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Название мероприятия</label>
                <input type="text" name="event_name" defaultValue={editingEvent?.event_name} required className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors" placeholder="Введите название..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Категория</label>
                  <select name="event_category" defaultValue={editingEvent?.event_category || (SECTORS && SECTORS[0]?.title)} className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors">
                    {SECTORS ? SECTORS.map((sector, idx) => (
                      <option key={sector.id || idx} value={sector.title || sector}>{sector.title || sector}</option>
                    )) : (
                      <option value="Спорт">Спорт</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Дата и время</label>
                  <input type="datetime-local" name="event_date_and_time" defaultValue={editingEvent?.event_date_and_time} required className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Описание</label>
                <textarea name="description" defaultValue={editingEvent?.description} required rows="5" className="w-full bg-white border border-gray-200 rounded-xl p-4 outline-none focus:border-[#0FA958] transition-colors resize-none" placeholder="Опишите программу, цели и аудиторию..."></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Обложка</label>
                <input type="file" name="event_picture" accept="image/*" className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:border-[#0FA958] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#0FA958]/10 file:text-[#0FA958] hover:file:bg-[#0FA958]/20" />
              </div>
              <button type="submit" className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-4 rounded-full transition-colors shadow-md mt-2 text-lg">
                {editingEvent ? 'Сохранить изменения' : 'Отправить на модерацию'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;