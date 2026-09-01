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
    alert('Ваша заявка на вступление в актив успешно отправлена. Ожидайте решения администратора МКД СПб.');
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
    alert('Заявка в актив МКД СПб одобрена! Права пользователя повышены.');
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
    if (role === 'activist') return 'Активист МКД СПб';
    return 'Участник МКД СПб';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="text-white bg-[#FBBA00] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">На модерации</span>;
      case 'approved': return <span className="text-white bg-[#00A552] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">Одобрено</span>;
      case 'cancelled': return <span className="text-white bg-[#EB5893] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">Отменено</span>;
      case 'archived': return <span className="text-white bg-[#6856BC] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">В архиве</span>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1400px] flex flex-col lg:flex-row gap-10 font-['Onest',sans-serif]">
      
      <aside className="w-full lg:w-1/4 flex flex-col gap-8">
        <div className="bg-[#F0D8C2] rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl p-10 shadow-xl flex flex-col items-center text-center border-4 border-white">
          <div className="w-32 h-32 rounded-full border-4 border-[#00A552] flex items-center justify-center mb-6 bg-white overflow-hidden text-5xl shadow-inner">
            🧑‍💻
          </div>
          <h2 className="text-2xl font-black text-[#2E1D67] mb-2 uppercase tracking-wide leading-tight">{currentUser.fullName}</h2>
          <p className="text-[#EB5893] font-black uppercase tracking-widest text-sm mb-8">
            {getRoleName(currentUser.role)}
          </p>
          
          <div className="w-full bg-white rounded-xl p-6 flex flex-col gap-4 text-left mb-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="text-xl">📧</span> <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="text-xl">📅</span> <span>{currentUser.birthDate || 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="text-xl">🌍</span> <span>{currentUser.country || 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="text-xl">🎓</span> <span>{currentUser.jobField || 'Не указано'}</span>
            </div>
            {currentUser.vkLink && (
              <div className="flex items-center gap-3 text-[#6856BC] font-bold hover:underline truncate">
                <span className="text-xl">🔗</span> <a href={currentUser.vkLink} target="_blank" rel="noreferrer">ВКонтакте</a>
              </div>
            )}
          </div>

          {currentUser.userDescription && (
            <div className="w-full text-left bg-white p-5 rounded-xl text-sm text-gray-700 font-medium shadow-sm">
              <span className="font-black text-[#2E1D67] uppercase tracking-widest block mb-2">О себе:</span>
              {currentUser.userDescription}
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="w-full bg-white border-2 border-transparent hover:border-[#EB5893] text-[#EB5893] font-black uppercase tracking-widest py-4 rounded-full transition-colors shadow-lg">
          Выйти из аккаунта
        </button>
      </aside>

      <main className="w-full lg:w-3/4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-widest leading-tight">
            {isAdmin ? 'Панель администратора' : isActivist ? 'Кабинет активиста' : 'Личный кабинет'}
          </h1>
          
          {(isAdmin || isActivist) && (
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-8 rounded-full transition-colors shadow-xl w-full sm:w-auto"
              >
                + Мероприятие
              </button>
              <button 
                onClick={() => setIsNewsModalOpen(true)}
                className="bg-[#FBBA00] hover:bg-[#e0a700] text-white font-black uppercase tracking-widest py-3 px-8 rounded-full transition-colors shadow-xl w-full sm:w-auto"
              >
                + Новость
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-full p-2 shadow-md mb-8 flex flex-wrap gap-2 border-2 border-[#F0D8C2]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-[#2E1D67] text-white shadow-md' 
                  : 'text-[#6856BC] hover:bg-[#F4F5F8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-10 md:p-14 shadow-xl flex-grow min-h-[500px] border-t-8 border-[#2E1D67]">
          <h3 className="text-2xl font-black mb-8 text-[#2E1D67] uppercase tracking-widest border-b-2 border-[#F0D8C2] pb-4">{activeTab}</h3>
          
          {activeTab === 'Настройки профиля' && (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6 max-w-2xl">
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">ФИО</label>
                <input type="text" name="fullName" defaultValue={currentUser.fullName} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Дата рождения</label>
                  <input type="date" name="birthDate" defaultValue={currentUser.birthDate} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67]" />
                </div>
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Страна / Гражданство</label>
                  <input type="text" name="country" defaultValue={currentUser.country} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67]" />
                </div>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Место работы / учебы</label>
                <input type="text" name="jobField" defaultValue={currentUser.jobField} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Ссылка на VK</label>
                <input type="url" name="vkLink" defaultValue={currentUser.vkLink} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">О себе</label>
                <textarea name="userDescription" defaultValue={currentUser.userDescription} rows="4" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea>
              </div>
              <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-4 px-10 rounded-full transition-colors shadow-xl mt-4 self-start text-lg">
                Сохранить изменения
              </button>
            </form>
          )}

          {activeTab === 'Стать активистом' && (
            <div className="max-w-2xl">
               <p className="text-gray-700 text-lg mb-8 font-medium leading-relaxed bg-[#F0D8C2]/40 p-6 rounded-2xl border border-[#F0D8C2]">
                  Опишите вашу мотивацию, чтобы администратор рассмотрел заявку.
                </p>
               <form onSubmit={handleApplyForActivist} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Почему вы хотите стать активистом МКД СПб?</label>
                    <textarea name="reason" required rows="6" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none" placeholder="Расскажите о своем опыте и идеях..."></textarea>
                  </div>
                  <button type="submit" className="bg-[#FBBA00] hover:bg-[#e0a700] text-white font-black uppercase tracking-widest py-4 px-10 rounded-full transition-colors shadow-xl self-start text-lg">
                    Подать заявку
                  </button>
               </form>
            </div>
          )}

          {activeTab === 'Мои мероприятия' && (
            <div className="flex flex-col gap-6">
              <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-4 bg-[#F4F5F8] inline-block py-2 px-4 rounded-full self-start">Мероприятия, на которые вы зарегистрированы</p>
              {myEvents.length === 0 ? (
                <p className="text-gray-500 font-medium text-lg">Вы пока не зарегистрированы ни на одно мероприятие.</p>
              ) : (
                myEvents.map(ev => (
                  <div key={ev.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 shadow-md flex flex-col gap-4 cursor-pointer hover:border-[#00A552] transition-colors" onClick={() => setViewingEvent(ev)}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <h4 className="font-black text-2xl text-[#2E1D67] uppercase leading-tight">{ev.event_name}</h4>
                      <div className="flex gap-3 flex-wrap">
                        {getStatusBadge(ev.status)}
                        <span className="bg-[#F4F5F8] text-[#2E1D67] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">{ev.event_category}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#6856BC] uppercase tracking-wide">📅 Дата: {new Date(ev.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 font-medium text-lg leading-relaxed mt-2">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Мои инициативы' && (isActivist || isAdmin) && (
            <div className="flex flex-col gap-12">
              
              <div>
                <h4 className="font-black text-[#2E1D67] mb-6 uppercase tracking-widest text-lg flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#00A552]"></span> Мои одобренные мероприятия
                </h4>
                <div className="flex flex-col gap-4">
                  {myOrganizedEvents.length === 0 ? <p className="text-gray-500 font-medium">Одобренных инициатив пока нет.</p> : null}
                  {myOrganizedEvents.map(ev => (
                    <div key={ev.id} className="bg-white border-2 border-[#00A552]/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:border-[#00A552] transition-colors shadow-md" onClick={() => setViewingEvent(ev)}>
                      <div>
                        <span className="font-black text-[#2E1D67] uppercase block text-xl mb-2 leading-tight">{ev.event_name}</span>
                        <span className="text-sm font-bold text-[#6856BC] uppercase tracking-wider">{ev.event_category} | 📅 {new Date(ev.event_date_and_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <span className="text-sm font-black text-[#2E1D67] uppercase tracking-widest bg-[#F4F5F8] px-4 py-2 rounded-full">
                          Участников: <span className="text-[#EB5893]">{ev.participants_count || 0}</span>
                        </span>
                        <button onClick={() => setViewingEvent(ev)} className="bg-[#2E1D67] hover:bg-[#1a1040] text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-colors shadow-md">Управление</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black text-[#2E1D67] mb-6 uppercase tracking-widest text-lg flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#FBBA00]"></span> Заявки на модерации
                </h4>
                
                <div className="flex flex-col gap-4 mb-8">
                  <h5 className="text-sm text-[#6856BC] font-black uppercase tracking-widest mb-2 bg-[#F4F5F8] inline-block py-1 px-4 rounded-full">МЕРОПРИЯТИЯ</h5>
                  {pendingEvents.filter(e => e.author_id === currentUser.id).length === 0 ? <p className="text-gray-500 font-medium">Нет заявок</p> : null}
                  {pendingEvents.filter(e => e.author_id === currentUser.id).map(ev => (
                    <div key={ev.id} className="bg-white border-2 border-[#F0D8C2] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:border-[#FBBA00] transition-colors shadow-sm" onClick={() => setViewingEvent(ev)}>
                      <div>
                        <span className="font-black text-[#2E1D67] uppercase block text-lg mb-1 leading-tight">{ev.event_name}</span>
                        <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest">{ev.event_category}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3" onClick={e => e.stopPropagation()}>
                        {getStatusBadge(ev.status)}
                        <button onClick={() => setEditingEvent(ev)} className="bg-white border-2 border-[#2E1D67] text-[#2E1D67] font-black uppercase tracking-widest text-xs px-5 py-2 rounded-full hover:bg-[#2E1D67] hover:text-white transition-colors">Редактировать</button>
                        <button onClick={() => withdrawEvent(ev.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] font-black uppercase tracking-widest text-xs px-5 py-2 rounded-full hover:bg-[#EB5893] hover:text-white transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <h5 className="text-sm text-[#6856BC] font-black uppercase tracking-widest mb-2 bg-[#F4F5F8] inline-block py-1 px-4 rounded-full">НОВОСТИ</h5>
                  {pendingNews.filter(n => n.author_id === currentUser.id).length === 0 ? <p className="text-gray-500 font-medium">Нет заявок</p> : null}
                  {pendingNews.filter(n => n.author_id === currentUser.id).map(nw => (
                    <div key={nw.id} className="bg-white border-2 border-[#F0D8C2] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:border-[#FBBA00] transition-colors shadow-sm" onClick={() => setViewingNews(nw)}>
                      <div>
                        <span className="font-black text-[#2E1D67] uppercase block text-lg mb-1 leading-tight">{nw.title}</span>
                        <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest">{nw.news_block_category}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3" onClick={e => e.stopPropagation()}>
                        {getStatusBadge(nw.status)}
                        <button onClick={() => setEditingNews(nw)} className="bg-white border-2 border-[#2E1D67] text-[#2E1D67] font-black uppercase tracking-widest text-xs px-5 py-2 rounded-full hover:bg-[#2E1D67] hover:text-white transition-colors">Редактировать</button>
                        <button onClick={() => withdrawNews(nw.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] font-black uppercase tracking-widest text-xs px-5 py-2 rounded-full hover:bg-[#EB5893] hover:text-white transition-colors">Отозвать</button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Модерация новостей' && isAdmin && (
            <div className="flex flex-col gap-6">
              {pendingNews.length === 0 ? <p className="text-gray-500 font-medium text-lg">Нет новостей на модерации.</p> : null}
              {pendingNews.map(news => (
                <div key={news.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingNews(news)}>
                  <div className="flex-1">
                    <h4 className="font-black text-xl text-[#2E1D67] uppercase leading-tight mb-2">{news.title}</h4>
                    <p className="text-xs font-bold text-[#6856BC] uppercase tracking-widest mb-4">Автор: {news.author} | Сектор: {news.news_block_category}</p>
                    <p className="text-gray-700 font-medium line-clamp-2">{news.description}</p>
                  </div>
                  <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveNews(news.id)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                    <button onClick={() => rejectNews(news.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Модерация мероприятий' && isAdmin && (
            <div className="flex flex-col gap-6">
              {pendingEvents.length === 0 ? <p className="text-gray-500 font-medium text-lg">Нет мероприятий на модерации.</p> : null}
              {pendingEvents.map(event => (
                <div key={event.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingEvent(event)}>
                  <div className="flex-1">
                    <h4 className="font-black text-xl text-[#2E1D67] uppercase leading-tight mb-2">{event.event_name}</h4>
                    <p className="text-xs font-bold text-[#6856BC] uppercase tracking-widest mb-4">Автор: {event.author} | Сектор: {event.event_category} | 📅 {new Date(event.event_date_and_time).toLocaleString()}</p>
                    <p className="text-gray-700 font-medium line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveEvent(event.id)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                    <button onClick={() => rejectEvent(event.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Заявки в актив' && isAdmin && (
            <div className="flex flex-col gap-6">
              {activistRequests.length === 0 ? <p className="text-gray-500 font-medium text-lg">Нет новых заявок.</p> : null}
              {activistRequests.map(req => (
                <div key={req.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingActivistRequest(req)}>
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-[#2E1D67] uppercase tracking-wide leading-tight mb-2">{req.fullName}</h4>
                    <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-4">{req.email}</p>
                  </div>
                  <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveActivist(req.id)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                    <button onClick={() => rejectActivist(req.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'База пользователей' && isAdmin && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-end mb-4">
                 <button onClick={() => downloadList('Список_Всех_Пользователей')} className="bg-white border-2 border-[#2E1D67] text-[#2E1D67] font-black uppercase tracking-widest py-3 px-6 rounded-full text-sm hover:bg-[#2E1D67] hover:text-white transition-colors shadow-md">
                    ⬇ Скачать список (CSV)
                 </button>
              </div>
              {usersList.map(user => (
                <div key={user.id} className="bg-[#F4F5F8] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-[#6856BC]" onClick={() => setViewingUser(user)}>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-xl text-[#2E1D67] uppercase mb-1">{user.fullName}</h4>
                    <p className="text-sm font-bold text-gray-600">{user.email} | Роль: <span className="text-[#EB5893] uppercase tracking-wider">{getRoleName(user.role)}</span></p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setViewingUser(user); }} className="bg-white text-[#2E1D67] font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-[#F0D8C2] shadow-sm">Управление</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Архив' && (
            <div className="flex flex-col gap-4">
              {archiveItems.map(item => (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:border-gray-400 transition-colors cursor-pointer opacity-75" onClick={() => item.type === 'event' ? setViewingEvent(item) : setViewingNews(item)}>
                  <div>
                    <h4 className="font-black text-lg text-gray-500 uppercase tracking-wide line-through decoration-gray-400 leading-tight">{item.event_name || item.title}</h4>
                    <span className="text-xs font-bold bg-gray-200 px-4 py-1.5 rounded-full text-gray-600 mt-3 inline-block uppercase tracking-widest">
                      {item.type === 'event' ? 'Архивное Мероприятие' : 'Архивная Новость'}
                    </span>
                  </div>
                  <button className="text-[#6856BC] font-black uppercase tracking-widest text-sm hover:underline">Просмотр</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Статистика' && (isAdmin || isActivist) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               <div className="bg-[#F0D8C2]/50 p-8 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl text-center shadow-md border border-[#F0D8C2]">
                 <span className="block text-5xl font-black text-[#2E1D67] mb-3">{statistics.totalEvents}</span>
                 <span className="text-xs font-black text-[#6856BC] uppercase tracking-widest">Мероприятий</span>
               </div>
               <div className="bg-[#F0D8C2]/50 p-8 rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl text-center shadow-md border border-[#F0D8C2]">
                 <span className="block text-5xl font-black text-[#2E1D67] mb-3">{statistics.totalNews}</span>
                 <span className="text-xs font-black text-[#6856BC] uppercase tracking-widest">Новостей</span>
               </div>
               <div className="bg-[#F0D8C2]/50 p-8 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl text-center shadow-md border border-[#F0D8C2]">
                 <span className="block text-5xl font-black text-[#2E1D67] mb-3">{statistics.totalActivists}</span>
                 <span className="text-xs font-black text-[#6856BC] uppercase tracking-widest">Активистов</span>
               </div>
               <div className="bg-[#F0D8C2]/50 p-8 rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl text-center shadow-md border border-[#F0D8C2]">
                 <span className="block text-5xl font-black text-[#2E1D67] mb-3">{statistics.totalUsers}</span>
                 <span className="text-xs font-black text-[#6856BC] uppercase tracking-widest">Участников</span>
               </div>
            </div>
          )}

        </div>
      </main>

      {viewingEvent && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingEvent(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingEvent(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
              ×
            </button>
            
            <div className="flex flex-wrap gap-4 mb-8 mt-4">
              {getStatusBadge(viewingEvent.status)}
              <span className="bg-[#F4F5F8] text-[#2E1D67] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">{viewingEvent.event_category}</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-4">{viewingEvent.event_name}</h3>
            <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-8">
              📅 {new Date(viewingEvent.event_date_and_time).toLocaleString()} {viewingEvent.author ? `| ✍️ Организатор: ${viewingEvent.author}` : ''}
            </p>
            {viewingEvent.event_picture && <img src={viewingEvent.event_picture} alt="Обложка" className="w-full h-72 object-cover rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl mb-8 shadow-md" />}
            
            <div className="text-gray-700 font-medium text-lg whitespace-pre-wrap leading-relaxed mb-10">{viewingEvent.description}</div>

            {(viewingEvent.author_id === currentUser.id || isAdmin) && viewingEvent.status === 'approved' && activeTab === 'Мои инициативы' && (
              <div className="bg-[#F4F5F8] border-2 border-[#F0D8C2] rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl p-8 mt-6 shadow-inner">
                <h4 className="font-black text-[#2E1D67] mb-6 uppercase tracking-widest">Управление мероприятием</h4>
                <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-6 bg-white py-2 px-4 inline-block rounded-full shadow-sm">Участников: {viewingEvent.participants_count || 0}</p>
                <div className="flex flex-wrap gap-4">
                   <button onClick={() => downloadList(`Участники_${viewingEvent.event_name}`)} className="bg-[#2E1D67] hover:bg-[#1a1040] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">
                     ⬇ Скачать список
                   </button>
                   <button onClick={() => cancelApprovedEvent(viewingEvent.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">
                     Отменить мероприятие
                   </button>
                </div>
              </div>
            )}
            
            {viewingEvent.status === 'approved' && viewingEvent.author_id !== currentUser.id && (
               <button onClick={() => alert('Чат с организаторами МКД СПб пока в разработке.')} className="bg-white border-2 border-[#2E1D67] text-[#2E1D67] hover:bg-[#2E1D67] hover:text-white font-black uppercase tracking-widest py-4 px-8 rounded-full text-sm transition-colors mt-6 shadow-md w-full md:w-auto">
                 💬 Задать вопрос организатору
               </button>
            )}
          </div>
        </div>
      )}

      {viewingNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingNews(null)}>
          <div className="bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl p-8 md:p-12 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
              ×
            </button>
            <div className="flex flex-wrap gap-4 mb-8 mt-4">
               {getStatusBadge(viewingNews.status)}
               <span className="bg-[#F4F5F8] text-[#2E1D67] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">{viewingNews.news_block_category}</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-4">{viewingNews.title}</h3>
            <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-8">{viewingNews.author ? `✍️ Автор: ${viewingNews.author}` : ''}</p>
            {viewingNews.news_block_picture && <img src={viewingNews.news_block_picture} alt="Изображение новости" className="w-full h-72 object-cover rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl mb-8 shadow-md" />}
            <div className="text-gray-700 font-medium text-lg whitespace-pre-wrap leading-relaxed">{viewingNews.description}</div>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-white rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl p-10 w-full max-w-xl relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-10 h-10 rounded-full flex items-center justify-center text-[#2E1D67] text-xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
              ×
            </button>
            <div className="flex flex-col items-center text-center mb-8 mt-4">
              <div className="w-24 h-24 rounded-full border-4 border-[#00A552] flex items-center justify-center mb-6 bg-white shadow-inner text-4xl">🧑‍💻</div>
              <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight">{viewingUser.fullName}</h3>
              <p className="text-[#EB5893] font-black uppercase tracking-widest text-sm mt-3">{getRoleName(viewingUser.role)}</p>
            </div>
            <div className="bg-[#F4F5F8] p-8 rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl flex flex-col gap-4 shadow-inner mb-8">
               <p className="text-[#2E1D67] font-medium"><span className="font-black uppercase tracking-wider text-xs mr-2">Email:</span> {viewingUser.email}</p>
               <p className="text-[#2E1D67] font-medium"><span className="font-black uppercase tracking-wider text-xs mr-2">Дата рождения:</span> {viewingUser.birthDate || 'Не указана'}</p>
               <p className="text-[#2E1D67] font-medium"><span className="font-black uppercase tracking-wider text-xs mr-2">Учеба / Работа:</span> {viewingUser.jobField || 'Не указано'}</p>
               <p className="text-[#2E1D67] font-medium"><span className="font-black uppercase tracking-wider text-xs mr-2">Страна:</span> {viewingUser.country || 'Не указана'}</p>
               {viewingUser.vkLink && <p className="text-[#2E1D67] font-medium"><span className="font-black uppercase tracking-wider text-xs mr-2">VK:</span> <a href={viewingUser.vkLink} target="_blank" rel="noreferrer" className="text-[#6856BC] hover:underline font-bold">{viewingUser.vkLink}</a></p>}
            </div>
            
            {isAdmin && viewingUser.id !== currentUser.id && (
              <div className="bg-white border-2 border-[#F0D8C2] p-6 rounded-2xl">
                 <p className="text-xs font-black text-[#2E1D67] mb-4 uppercase tracking-widest text-center">Изменить роль пользователя</p>
                 <div className="flex justify-center gap-3 flex-wrap">
                   {viewingUser.role !== 'user' && <button onClick={() => changeUserRole(viewingUser.id, 'user')} className="bg-[#F4F5F8] hover:bg-white border-2 border-transparent hover:border-[#2E1D67] text-[#2E1D67] font-black uppercase tracking-widest py-2.5 px-5 rounded-full text-xs transition-colors shadow-sm">Сделать Участником</button>}
                   {viewingUser.role !== 'activist' && <button onClick={() => changeUserRole(viewingUser.id, 'activist')} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-2.5 px-5 rounded-full text-xs transition-colors shadow-sm">Назначить Активистом</button>}
                   {viewingUser.role !== 'admin' && <button onClick={() => changeUserRole(viewingUser.id, 'admin')} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-2.5 px-5 rounded-full text-xs transition-colors shadow-sm">Сделать Админом</button>}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewingActivistRequest && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingActivistRequest(null)}>
          <div className="bg-white rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl p-10 w-full max-w-xl relative shadow-2xl" onClick={e => e.stopPropagation()}>
             <button onClick={() => setViewingActivistRequest(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-10 h-10 rounded-full flex items-center justify-center text-[#2E1D67] text-xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
               ×
             </button>
             <h3 className="text-sm font-black text-[#6856BC] uppercase tracking-widest mb-4 bg-[#F4F5F8] inline-block py-2 px-5 rounded-full mt-4">Заявка в актив МКД СПб</h3>
             <h4 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-2 mt-4">{viewingActivistRequest.fullName}</h4>
             <p className="text-sm font-bold text-gray-500 mb-8">{viewingActivistRequest.email}</p>
             <div className="bg-[#F0D8C2]/40 p-8 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl shadow-inner border border-[#F0D8C2] mb-10">
               <p className="font-black text-[#2E1D67] uppercase tracking-widest text-xs mb-3">Причина / Мотивация:</p>
               <p className="text-gray-800 font-medium text-lg leading-relaxed">{viewingActivistRequest.reason}</p>
             </div>
             <div className="flex gap-4 justify-end flex-wrap">
                <button onClick={() => { approveActivist(viewingActivistRequest.id); setViewingActivistRequest(null); }} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors shadow-xl text-sm flex-1 md:flex-none">Сделать активистом</button>
                <button onClick={() => { rejectActivist(viewingActivistRequest.id); setViewingActivistRequest(null); }} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3.5 px-8 rounded-full transition-colors shadow-xl text-sm flex-1 md:flex-none">Отклонить</button>
             </div>
          </div>
        </div>
      )}

      {(isNewsModalOpen || editingNews) && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-10 md:p-14 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setIsNewsModalOpen(false); setEditingNews(null); }} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
              ×
            </button>
            <h2 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-10 mt-4 leading-tight">{editingNews ? 'Редактировать новость' : 'Предложить новость'}</h2>
            <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="flex flex-col gap-6">
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Заголовок</label>
                <input type="text" name="title" defaultValue={editingNews?.title} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors" placeholder="Введите заголовок..." />
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Категория / Сектор</label>
                <select name="news_block_category" defaultValue={editingNews?.news_block_category || (SECTORS && SECTORS[0])} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors appearance-none cursor-pointer">
                  {SECTORS ? SECTORS.map((sector, idx) => (
                    <option key={idx} value={sector}>{sector}</option>
                  )) : (
                    <option value="Общество">Общество</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Текст новости</label>
                <textarea name="description" defaultValue={editingNews?.description} required rows="8" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors resize-none" placeholder="Содержание новости..."></textarea>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Обложка</label>
                <input type="file" name="news_block_picture" accept="image/*" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-3 outline-none focus:border-[#6856BC] transition-colors file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#2E1D67] file:text-white hover:file:bg-[#1a1040] cursor-pointer" />
              </div>
              <button type="submit" className="bg-[#FBBA00] hover:bg-[#e0a700] text-white font-black uppercase tracking-widest py-4 rounded-full transition-colors shadow-xl mt-6 text-lg">
                {editingNews ? 'Сохранить изменения' : 'Отправить на модерацию'}
              </button>
            </form>
          </div>
        </div>
      )}

      {(isEventModalOpen || editingEvent) && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl p-10 md:p-14 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">
              ×
            </button>
            <h2 className="text-3xl font-black text-[#2E1D67] uppercase tracking-widest mb-10 mt-4 leading-tight">{editingEvent ? 'Редактировать мероприятие' : 'Создать мероприятие МКД СПб'}</h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="flex flex-col gap-6">
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Название мероприятия</label>
                <input type="text" name="event_name" defaultValue={editingEvent?.event_name} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors" placeholder="Введите название..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Категория</label>
                  <select name="event_category" defaultValue={editingEvent?.event_category || (SECTORS && SECTORS[0])} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors appearance-none cursor-pointer">
                    {SECTORS ? SECTORS.map((sector, idx) => (
                      <option key={idx} value={sector}>{sector}</option>
                    )) : (
                      <option value="Спорт">Спорт</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Дата и время</label>
                  <input type="datetime-local" name="event_date_and_time" defaultValue={editingEvent?.event_date_and_time} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Описание мероприятия</label>
                <textarea name="description" defaultValue={editingEvent?.description} required rows="8" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] transition-colors resize-none" placeholder="Подробное описание..."></textarea>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-3">Афиша / Обложка</label>
                <input type="file" name="event_picture" accept="image/*" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-3 outline-none focus:border-[#6856BC] transition-colors file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#2E1D67] file:text-white hover:file:bg-[#1a1040] cursor-pointer" />
              </div>
              <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-4 rounded-full transition-colors shadow-xl mt-6 text-lg">
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