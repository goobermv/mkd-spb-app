import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SECTORS } from '../data/constants'; 
import apiClient from '../api/client';

const ProfilePage = ({ currentUser, setCurrentUser, eventsList, newsList, refreshData }) => {
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'Admin';
  const isActivist = currentUser?.role === 'Activist';

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
  const [selectedRole, setSelectedRole] = useState('Regular');
  const [viewingActivistRequest, setViewingActivistRequest] = useState(null);

  const [pendingNews, setPendingNews] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myOrganizedEvents, setMyOrganizedEvents] = useState([]);
  const [activistRequests, setActivistRequests] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [archiveItems, setArchiveItems] = useState([]);
  const [statistics, setStatistics] = useState({ totalEvents: 0, totalNews: 0, totalActivists: 0, totalUsers: 0 });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const loadProfileData = async () => {
      try {
        const myRegsRes = await apiClient.get(`/event_registrations/user/${currentUser.id}`);
        if (myRegsRes.data) {
          const enriched = myRegsRes.data.map(reg => {
            const ev = eventsList.find(e => e.id === reg.event_id) || {};
            return { 
              ...reg, 
              event_name: ev.event_name, 
              event_category: ev.event_category, 
              event_date_and_time: ev.event_date_and_time, 
              description: ev.description, 
              event_picture: ev.event_picture,
              status: reg.registration_status 
            };
          });
          setMyEvents(enriched);
        }
      } catch(e) {}

      if (isAdmin || isActivist) {
         try {
            const orgEvRes = await apiClient.get(`/events/author/${currentUser.id}`);
            const orgEv = orgEvRes.data || [];
            setMyOrganizedEvents(orgEv.filter(e => e.status === 'Published'));
            if (isActivist) setPendingEvents(orgEv.filter(e => e.status === 'In moderation'));
            setArchiveItems(prev => {
               const arch = orgEv.filter(e => e.status === 'Archived').map(e => ({...e, type: 'event'}));
               return [...prev.filter(p => p.type !== 'event'), ...arch];
            });
         } catch(e) {}
         
         try {
            const orgNewsRes = await apiClient.get(`/news_blocks/author/${currentUser.id}`);
            const orgNews = orgNewsRes.data || [];
            if (isActivist) setPendingNews(orgNews.filter(n => n.publication_status === 'Undergoing moderation'));
            setArchiveItems(prev => {
               const arch = orgNews.filter(n => n.publication_status === 'Declined').map(n => ({...n, type: 'news'}));
               return [...prev.filter(p => p.type !== 'news'), ...arch];
            });
         } catch(e) {}
      }

      if (isAdmin) {
         try {
            const allEvRes = await apiClient.get(`/events`);
            setPendingEvents((allEvRes.data || []).filter(e => e.status === 'In moderation'));
         } catch(e) {}
         try {
            const allNewsRes = await apiClient.get(`/news_blocks`);
            setPendingNews((allNewsRes.data || []).filter(n => n.publication_status === 'Undergoing moderation'));
         } catch(e) {}
         try {
            const usrRes = await apiClient.get(`/users`);
            const usrs = usrRes.data || [];
            setUsersList(usrs);

            const appRes = await apiClient.get(`/applications`);
            const apps = appRes.data || [];
            const enrichedApps = apps.filter(a => a.status === 'Pending').map(app => {
              const u = usrs.find(usr => usr.id === app.user_id) || {};
              return { ...app, fullName: u.full_name, email: u.email, reason: app.user_motivation_description };
            });
            setActivistRequests(enrichedApps);

            setStatistics({
              totalEvents: eventsList.length,
              totalNews: newsList.length,
              totalActivists: usrs.filter(u => u.role === 'Activist').length,
              totalUsers: usrs.length
            });
         } catch(e) {}
      }
    };
    loadProfileData();
  }, [currentUser, eventsList, newsList, navigate]);

  useEffect(() => {
    if (viewingUser) {
      setSelectedRole(viewingUser.role || 'Regular');
    }
  }, [viewingUser]);

  const getBase64 = (file) => new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
  });

  const handleExportCSV = async () => {
    try {
      const response = await apiClient.get('/users/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_base.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Ошибка при выгрузке CSV');
    }
  };

  const handleUpdateUserRole = async (e) => {
    e.preventDefault();
    if (!viewingUser) return;
    try {
      await apiClient.patch(`/users/${viewingUser.id}/role`, { role: selectedRole });
      alert('Роль пользователя успешно обновлена!');
      setUsersList(prev => prev.map(u => u.id === viewingUser.id ? { ...u, role: selectedRole } : u));
      setViewingUser(null);
      refreshData();
    } catch (err) {
      alert('Ошибка при обновлении роли пользователя');
    }
  };

  const handleCancelRegistration = async (regId) => {
    if (!window.confirm('Вы уверены, что хотите отменить участие в мероприятии?')) return;
    try {
      await apiClient.delete(`/event_registrations/${regId}`);
      alert('Вы успешно отменили регистрацию на мероприятие.');
      setMyEvents(prev => prev.filter(item => item.id !== regId));
      setViewingEvent(null);
      refreshData();
    } catch (e) {
      alert('Ошибка при отмене регистрации');
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('news_block_picture');
    let picBase64 = '';
    if (pictureFile && pictureFile.size > 0) picBase64 = await getBase64(pictureFile);

    try {
      await apiClient.post('/news_blocks', {
        author_id: currentUser.id,
        title: formData.get('title'),
        description: formData.get('description'),
        news_block_category: formData.get('news_block_category'),
        news_block_picture: picBase64
      });
      alert('Новость отправлена на модерацию!');
      setIsNewsModalOpen(false);
      refreshData();
    } catch(err) { alert('Ошибка при создании новости'); }
  };

  const handleUpdateNews = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('news_block_picture');
    
    const updateData = {
        title: formData.get('title'),
        description: formData.get('description'),
        news_block_category: formData.get('news_block_category'),
    };
    if (pictureFile && pictureFile.size > 0) updateData.news_block_picture = await getBase64(pictureFile);

    try {
       await apiClient.patch(`/news_blocks/${editingNews.id}`, updateData);
       alert('Заявка на новость обновлена!');
       setEditingNews(null);
       refreshData();
    } catch(err) { alert('Ошибка при обновлении'); }
  };

  const withdrawNews = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отозвать эту заявку?')) return;
    try {
       await apiClient.delete(`/news_blocks/${id}`);
       setPendingNews(prev => prev.filter(n => n.id !== id));
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('event_picture');
    let picBase64 = '';
    if (pictureFile && pictureFile.size > 0) picBase64 = await getBase64(pictureFile);

    try {
       await apiClient.post('/events', {
          author_id: currentUser.id,
          event_name: formData.get('event_name'),
          description: formData.get('description'),
          event_category: formData.get('event_category'),
          event_date_and_time: new Date(formData.get('event_date_and_time')).toISOString(),
          event_picture: picBase64
       });
       alert('Мероприятие отправлено на модерацию!');
       setIsEventModalOpen(false);
       refreshData();
    } catch(err) { alert('Ошибка при создании'); }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pictureFile = formData.get('event_picture');
    
    const updateData = {
        event_name: formData.get('event_name'),
        description: formData.get('description'),
        event_category: formData.get('event_category'),
        event_date_and_time: new Date(formData.get('event_date_and_time')).toISOString(),
    };
    if (pictureFile && pictureFile.size > 0) updateData.event_picture = await getBase64(pictureFile);

    try {
       await apiClient.patch(`/events/${editingEvent.id}`, updateData);
       alert('Заявка на мероприятие обновлена!');
       setEditingEvent(null);
       refreshData();
    } catch(err) { alert('Ошибка при обновлении'); }
  };

  const withdrawEvent = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отозвать эту заявку?')) return;
    try {
       await apiClient.delete(`/events/${id}`);
       setPendingEvents(prev => prev.filter(e => e.id !== id));
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
       const res = await apiClient.patch(`/users/${currentUser.id}`, {
          full_name: formData.get('fullName'),
          birth_date: formData.get('birthDate') ? new Date(formData.get('birthDate')).toISOString() : undefined,
          country: formData.get('country'),
          job_field: formData.get('jobField'),
          vk_link: formData.get('vkLink'),
          user_description: formData.get('userDescription')
       });
       setCurrentUser(res.data);
       alert('Профиль успешно обновлен!');
    } catch(e) { alert('Ошибка обновления профиля'); }
  };

  const handleApplyForActivist = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
       await apiClient.post('/applications', {
          user_id: currentUser.id,
          user_motivation_description: formData.get('reason')
       });
       alert('Ваша заявка на вступление в актив успешно отправлена. Ожидайте решения администратора.');
       e.target.reset();
    } catch(err) { alert('Ошибка отправки заявки'); }
  };

  const approveNews = async (id) => {
    try {
       await apiClient.patch(`/news_blocks/${id}`, { publication_status: 'Published' });
       alert('Новость одобрена и опубликована!');
       setPendingNews(prev => prev.filter(n => n.id !== id));
       setViewingNews(null);
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const rejectNews = async (id) => {
    try {
       await apiClient.patch(`/news_blocks/${id}`, { publication_status: 'Declined' });
       alert('Новость отклонена.');
       setPendingNews(prev => prev.filter(n => n.id !== id));
       setViewingNews(null);
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const approveEvent = async (id) => {
    try {
       await apiClient.patch(`/events/${id}`, { status: 'Published' });
       alert('Мероприятие одобрено и опубликовано!');
       setPendingEvents(prev => prev.filter(e => e.id !== id));
       setViewingEvent(null);
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const rejectEvent = async (id) => {
    try {
       await apiClient.patch(`/events/${id}`, { status: 'Archived' });
       alert('Мероприятие отклонено.');
       setPendingEvents(prev => prev.filter(e => e.id !== id));
       setViewingEvent(null);
       refreshData();
    } catch(e) { alert('Ошибка'); }
  };

  const approveActivist = async (req) => {
    try {
       await apiClient.patch(`/applications/${req.id}`, { status: 'Approved' });
       await apiClient.patch(`/users/${req.user_id}/role`, { role: 'Activist' });
       alert('Заявка в актив одобрена, и роль пользователя автоматически повышена до "Активист"!');
       setActivistRequests(prev => prev.filter(a => a.id !== req.id));
       setViewingActivistRequest(null);
       refreshData();
    } catch(e) { alert('Ошибка при одобрении заявки'); }
  };

  const rejectActivist = async (id) => {
    try {
       await apiClient.patch(`/applications/${id}`, { status: 'Rejected' });
       alert('Заявка в актив отклонена.');
       setActivistRequests(prev => prev.filter(a => a.id !== id));
       setViewingActivistRequest(null);
       refreshData();
    } catch(e) { alert('Ошибка при отклонении заявки'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const getRoleName = (role) => {
    if (role === 'Admin') return 'Администратор';
    if (role === 'Activist') return 'Активист МКД СПб';
    return 'Участник МКД СПб';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'In moderation':
      case 'Undergoing moderation':
      case 'Pending': return <span className="text-white bg-[#FBBA00] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">На модерации</span>;
      case 'Published':
      case 'Approved':
      case 'Registered': return <span className="text-white bg-[#00A552] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">Зарегистрирован</span>;
      case 'Declined':
      case 'Rejected':
      case 'Cancelled': return <span className="text-white bg-[#EB5893] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">Отклонено</span>;
      case 'Archived': return <span className="text-white bg-[#6856BC] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">В архиве</span>;
      default: return null;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1400px] flex flex-col lg:flex-row gap-10 font-['Onest',sans-serif]">
      
      <aside className="w-full lg:w-1/4 flex flex-col gap-8">
        <div className="bg-[#F0D8C2] rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl p-10 shadow-xl flex flex-col items-center text-center border-4 border-white">
          <div className="w-32 h-32 rounded-full border-4 border-[#00A552] flex items-center justify-center mb-6 bg-white overflow-hidden text-[#2E1D67] shadow-inner">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
             </svg>
          </div>
          <h2 className="text-2xl font-black text-[#2E1D67] mb-2 uppercase tracking-wide leading-tight">{currentUser.full_name}</h2>
          <p className="text-[#EB5893] font-black uppercase tracking-widest text-sm mb-8">
            {getRoleName(currentUser.role)}
          </p>
          
          <div className="w-full bg-white rounded-xl p-6 flex flex-col gap-4 text-left mb-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="font-bold">Email:</span> <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="font-bold">Дата рождения:</span> <span>{currentUser.birth_date ? new Date(currentUser.birth_date).toLocaleDateString() : 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="font-bold">Страна:</span> <span>{currentUser.country || 'Не указана'}</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E1D67] font-medium">
              <span className="font-bold">Деятельность:</span> <span className="truncate">{currentUser.job_field || 'Не указано'}</span>
            </div>
            {currentUser.vk_link && (
              <div className="flex items-center gap-3 text-[#6856BC] font-bold hover:underline truncate">
                <span className="font-bold text-[#2E1D67]">VK:</span> <a href={currentUser.vk_link} target="_blank" rel="noreferrer">ВКонтакте</a>
              </div>
            )}
          </div>

          {currentUser.user_description && (
            <div className="w-full text-left bg-white p-5 rounded-xl text-sm text-gray-700 font-medium shadow-sm">
              <span className="font-black text-[#2E1D67] uppercase tracking-widest block mb-2">О себе:</span>
              {currentUser.user_description}
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
                className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-8 rounded-full transition-colors shadow-xl w-full sm:w-auto text-center flex items-center justify-center whitespace-nowrap gap-2"
              >
                + МЕРОПРИЯТИЕ
              </button>
              <button 
                onClick={() => setIsNewsModalOpen(true)}
                className="bg-[#FBBA00] hover:bg-[#e0a700] text-white font-black uppercase tracking-widest py-3 px-8 rounded-full transition-colors shadow-xl w-full sm:w-auto text-center flex items-center justify-center whitespace-nowrap gap-2"
              >
                + НОВОСТЬ
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-md mb-8 flex flex-wrap justify-center items-center gap-2 md:gap-3 border-2 border-[#F0D8C2]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-grow md:flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap text-center ${
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
                <input type="text" name="fullName" defaultValue={currentUser.full_name} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Дата рождения</label>
                  <input type="date" name="birthDate" defaultValue={currentUser.birth_date ? currentUser.birth_date.split('T')[0] : ''} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67]" />
                </div>
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Страна / Гражданство</label>
                  <input type="text" name="country" defaultValue={currentUser.country} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67]" />
                </div>
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Место работы / учебы</label>
                <input type="text" name="jobField" defaultValue={currentUser.job_field} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Ссылка на VK</label>
                <input type="url" name="vkLink" defaultValue={currentUser.vk_link} className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" />
              </div>
              <div>
                <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">О себе</label>
                <textarea name="userDescription" defaultValue={currentUser.user_description} rows="4" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea>
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
                  <div key={ev.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 shadow-md flex flex-col md:flex-row gap-6 cursor-pointer hover:border-[#00A552] transition-colors items-center justify-between" onClick={() => setViewingEvent(ev)}>
                    <div className="flex flex-col md:flex-row gap-6 items-center flex-1 w-full">
                      {ev.event_picture && (
                        <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-[#F4F5F8] border border-[#F0D8C2]">
                          <img src={ev.event_picture} alt={ev.event_name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-3 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <h4 className="font-black text-2xl text-[#2E1D67] uppercase leading-tight">{ev.event_name}</h4>
                        </div>
                        <p className="text-sm font-bold text-[#6856BC] uppercase tracking-wide">Дата: {new Date(ev.event_date_and_time).toLocaleString()}</p>
                        <p className="text-gray-700 font-medium line-clamp-2">{ev.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 items-center flex-shrink-0 pl-4 self-center" onClick={e => e.stopPropagation()}>
                      {getStatusBadge(ev.status)}
                      <button onClick={() => handleCancelRegistration(ev.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-colors shadow-sm whitespace-nowrap">
                        Отмена участия
                      </button>
                    </div>
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
                        <span className="text-sm font-bold text-[#6856BC] uppercase tracking-wider">{ev.event_category} | Дата: {new Date(ev.event_date_and_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
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
                        {getStatusBadge(nw.publication_status)}
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
              {pendingNews.map(news => {
                const author = usersList.find(u => u.id === news.author_id);
                const authorName = author ? author.full_name : news.author_id;
                return (
                  <div key={news.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingNews(news)}>
                    <div className="flex-1">
                      <h4 className="font-black text-xl text-[#2E1D67] uppercase leading-tight mb-2">{news.title}</h4>
                      <p className="text-xs font-bold text-[#6856BC] uppercase tracking-widest mb-4">Автор: {authorName} | Сектор: {news.news_block_category}</p>
                      <p className="text-gray-700 font-medium line-clamp-2">{news.description}</p>
                    </div>
                    <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => approveNews(news.id)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                      <button onClick={() => rejectNews(news.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Модерация мероприятий' && isAdmin && (
            <div className="flex flex-col gap-6">
              {pendingEvents.length === 0 ? <p className="text-gray-500 font-medium text-lg">Нет мероприятий на модерации.</p> : null}
              {pendingEvents.map(event => {
                const author = usersList.find(u => u.id === event.author_id);
                const authorName = author ? author.full_name : event.author_id;
                return (
                  <div key={event.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingEvent(event)}>
                    <div className="flex-1">
                      <h4 className="font-black text-xl text-[#2E1D67] uppercase leading-tight mb-2">{event.event_name}</h4>
                      <p className="text-xs font-bold text-[#6856BC] uppercase tracking-widest mb-4">Автор: {authorName} | Сектор: {event.event_category} | Дата: {new Date(event.event_date_and_time).toLocaleString()}</p>
                      <p className="text-gray-700 font-medium line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => approveEvent(event.id)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                      <button onClick={() => rejectEvent(event.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Заявки в актив' && isAdmin && (
            <div className="flex flex-col gap-6">
              {activistRequests.length === 0 ? <p className="text-gray-500 font-medium text-lg">Нет новых заявок.</p> : null}
              {activistRequests.map(req => (
                <div key={req.id} className="bg-white border-2 border-[#F0D8C2] rounded-tr-[40px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-md hover:border-[#FBBA00] transition-colors cursor-pointer" onClick={() => setViewingActivistRequest(req)}>
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-[#2E1D67] uppercase tracking-wide leading-tight mb-2">{req.fullName}</h4>
                    <p className="text-sm font-bold text-[#6856BC] uppercase tracking-widest mb-3">{req.email}</p>
                    <div className="bg-[#F4F5F8] p-4 rounded-xl">
                      <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block mb-1">Мотивация:</span>
                      <p className="text-gray-700 font-medium line-clamp-2 text-sm">{req.reason || 'Нет описания'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => approveActivist(req)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Принять</button>
                    <button onClick={() => rejectActivist(req.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest text-sm py-3 px-8 rounded-full transition-colors shadow-md">Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'База пользователей' && isAdmin && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-end mb-4">
                 <button onClick={handleExportCSV} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black py-2 px-6 rounded-full transition-colors shadow-md">
                    Выгрузить CSV
                 </button>
              </div>
              {usersList.map(user => (
                <div key={user.id} className="bg-[#F4F5F8] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-[#6856BC]" onClick={() => setViewingUser(user)}>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-xl text-[#2E1D67] uppercase mb-1">{user.full_name}</h4>
                    <p className="text-sm font-bold text-gray-600">{user.email} | Роль: <span className="text-[#EB5893] uppercase tracking-wider">{getRoleName(user.role)}</span></p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setViewingUser(user); }} className="bg-white text-[#2E1D67] font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-[#F0D8C2] shadow-sm">Управление</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Архив' && (isAdmin || isActivist) && (
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
                 <span className="text-xs font-black text-[#6856BC] uppercase tracking-widest">Пользователей</span>
               </div>
            </div>
          )}

        </div>
      </main>

      {viewingEvent && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingEvent(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingEvent(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Детали мероприятия</h3>
            
            <div className="flex flex-col gap-6">
              {viewingEvent.event_picture && (
                <div className="w-full h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#F0D8C2] bg-[#F4F5F8]">
                  <img src={viewingEvent.event_picture} alt={viewingEvent.event_name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-[#F4F5F8] p-6 rounded-2xl flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Название</span>
                  <span className="text-2xl font-black text-[#2E1D67]">{viewingEvent.event_name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Автор (Заявитель)</span>
                    <span className="font-bold text-[#2E1D67]">
                      {usersList.find(u => u.id === viewingEvent.author_id)?.full_name || currentUser.full_name || viewingEvent.author_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Категория (Сектор)</span>
                    <span className="font-medium text-[#2E1D67]">{viewingEvent.event_category}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Дата и время</span>
                    <span className="font-medium text-[#2E1D67]">{new Date(viewingEvent.event_date_and_time).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Статус</span>
                    <div className="mt-1">{getStatusBadge(viewingEvent.status)}</div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block mb-2">Описание</span>
                  <p className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-gray-200">{viewingEvent.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                {myEvents.some(item => item.id === viewingEvent.id) && (
                  <button type="button" onClick={() => handleCancelRegistration(viewingEvent.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">
                    Отмена участия
                  </button>
                )}

                {isAdmin && viewingEvent.status === 'In moderation' && (
                  <div className="flex gap-4 ml-auto" onClick={e => e.stopPropagation()}>
                     <button type="button" onClick={() => { rejectEvent(viewingEvent.id); }} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отклонить</button>
                     <button type="button" onClick={() => { approveEvent(viewingEvent.id); }} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Принять</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingNews(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Детали новости</h3>
            
            <div className="flex flex-col gap-6">
              {viewingNews.news_block_picture && (
                <div className="w-full h-72 rounded-2xl overflow-hidden shadow-md border-2 border-[#F0D8C2] bg-[#F4F5F8]">
                  <img src={viewingNews.news_block_picture} alt={viewingNews.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-[#F4F5F8] p-6 rounded-2xl flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Заголовок</span>
                  <span className="text-2xl font-black text-[#2E1D67]">{viewingNews.title}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Автор (Заявитель)</span>
                    <span className="font-bold text-[#2E1D67]">
                      {usersList.find(u => u.id === viewingNews.author_id)?.full_name || currentUser.full_name || viewingNews.author_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Категория (Сектор)</span>
                    <span className="font-medium text-[#2E1D67]">{viewingNews.news_block_category}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Статус</span>
                    <div className="mt-1">{getStatusBadge(viewingNews.publication_status)}</div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block mb-2">Описание</span>
                  <p className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-gray-200">{viewingNews.description}</p>
                </div>
              </div>

              {isAdmin && viewingNews.publication_status === 'Undergoing moderation' && (
                <div className="flex justify-end gap-4 mt-2" onClick={e => e.stopPropagation()}>
                   <button type="button" onClick={() => { rejectNews(viewingNews.id); }} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отклонить</button>
                   <button type="button" onClick={() => { approveNews(viewingNews.id); }} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Принять</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewingActivistRequest && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingActivistRequest(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingActivistRequest(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Заявка в актив</h3>
            
            <div className="flex flex-col gap-6">
              <div className="bg-[#F4F5F8] p-6 rounded-2xl flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">ФИО заявителя</span>
                  <span className="text-xl font-black text-[#2E1D67]">{viewingActivistRequest.fullName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Email</span>
                  <span className="font-medium text-[#2E1D67]">{viewingActivistRequest.email}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block mb-2">Текст заявки (мотивация)</span>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                    {viewingActivistRequest.reason || 'Описание отсутствует'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-2">
                 <button type="button" onClick={() => setViewingActivistRequest(null)} className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Закрыть</button>
                 <button type="button" onClick={() => rejectActivist(viewingActivistRequest.id)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отклонить</button>
                 <button type="button" onClick={() => approveActivist(viewingActivistRequest)} className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Принять и повысить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingUser(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Управление пользователем</h3>
            
            <div className="flex flex-col gap-6">
              <div className="bg-[#F4F5F8] p-6 rounded-2xl flex flex-col gap-4">
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">ФИО</span>
                  <span className="text-xl font-black text-[#2E1D67]">{viewingUser.full_name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Email</span>
                    <span className="font-medium text-[#2E1D67]">{viewingUser.email}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Текущая роль</span>
                    <span className="font-black text-[#EB5893] uppercase tracking-wider">{getRoleName(viewingUser.role)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Дата рождения</span>
                    <span className="font-medium text-[#2E1D67]">{viewingUser.birth_date ? new Date(viewingUser.birth_date).toLocaleDateString() : 'Не указана'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Страна</span>
                    <span className="font-medium text-[#2E1D67]">{viewingUser.country || 'Не указана'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Деятельность</span>
                    <span className="font-medium text-[#2E1D67]">{viewingUser.job_field || 'Не указано'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">VK</span>
                    {viewingUser.vk_link ? (
                      <a href={viewingUser.vk_link} target="_blank" rel="noreferrer" className="text-[#6856BC] font-bold hover:underline truncate block">Ссылка</a>
                    ) : (
                      <span className="font-medium text-gray-500">Не указана</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">О себе</span>
                  <span className="font-medium text-gray-700">{viewingUser.user_description || 'Нет описания'}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6856BC] uppercase tracking-widest block">Дата регистрации</span>
                  <span className="font-medium text-gray-500 text-sm">{viewingUser.created_at ? new Date(viewingUser.created_at).toLocaleString() : 'Н/Д'}</span>
                </div>
              </div>

              <form onSubmit={handleUpdateUserRole} className="flex flex-col gap-4 border-t-2 border-[#F0D8C2] pt-6">
                <div>
                  <label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Изменить роль пользователя</label>
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)} 
                    className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]"
                  >
                    <option value="Regular">Участник МКД СПб</option>
                    <option value="Activist">Активист МКД СПб</option>
                    <option value="Admin">Администратор</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                   <button type="button" onClick={() => setViewingUser(null)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Закрыть</button>
                   <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Сохранить роль</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsNewsModalOpen(false)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsNewsModalOpen(false)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Предложить новость</h3>
            <form onSubmit={handleCreateNews} className="flex flex-col gap-6">
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Заголовок новости</label><input type="text" name="title" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Категория (Сектор)</label>
                <select name="news_block_category" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]">
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Описание</label><textarea name="description" required rows="5" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Изображение</label><input type="file" name="news_block_picture" accept="image/*" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2E1D67] file:text-white file:uppercase file:tracking-widest cursor-pointer" /></div>
              <div className="flex justify-end gap-4 mt-4">
                 <button type="button" onClick={() => setIsNewsModalOpen(false)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отмена</button>
                 <button type="submit" className="bg-[#FBBA00] hover:bg-[#e0a700] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отправить на модерацию</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingNews(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Редактировать заявку на новость</h3>
            <form onSubmit={handleUpdateNews} className="flex flex-col gap-6">
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Заголовок новости</label><input type="text" name="title" defaultValue={editingNews.title} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Категория (Сектор)</label>
                <select name="news_block_category" defaultValue={editingNews.news_block_category} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]">
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Описание</label><textarea name="description" defaultValue={editingNews.description} required rows="5" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Изображение (оставьте пустым, чтобы не менять)</label><input type="file" name="news_block_picture" accept="image/*" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2E1D67] file:text-white file:uppercase file:tracking-widest cursor-pointer" /></div>
              <div className="flex justify-end gap-4 mt-4">
                 <button type="button" onClick={() => setEditingNews(null)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отмена</button>
                 <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEventModalOpen && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsEventModalOpen(false)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsEventModalOpen(false)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Создать мероприятие</h3>
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-6">
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Название мероприятия</label><input type="text" name="event_name" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Категория</label>
                  <select name="event_category" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]">
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Дата и время</label><input type="datetime-local" name="event_date_and_time" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              </div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Описание</label><textarea name="description" required rows="4" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Обложка мероприятия</label><input type="file" name="event_picture" accept="image/*" required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2E1D67] file:text-white file:uppercase file:tracking-widest cursor-pointer" /></div>
              <div className="flex justify-end gap-4 mt-4">
                 <button type="button" onClick={() => setIsEventModalOpen(false)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отмена</button>
                 <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отправить на модерацию</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingEvent(null)}>
          <div className="bg-white rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingEvent(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-wide leading-tight mb-6">Редактировать заявку на мероприятие</h3>
            <form onSubmit={handleUpdateEvent} className="flex flex-col gap-6">
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Название мероприятия</label><input type="text" name="event_name" defaultValue={editingEvent.event_name} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Категория</label>
                  <select name="event_category" defaultValue={editingEvent.event_category} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]">
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Дата и время</label><input type="datetime-local" name="event_date_and_time" defaultValue={editingEvent.event_date_and_time ? new Date(editingEvent.event_date_and_time).toISOString().slice(0, 16) : ''} required className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67]" /></div>
              </div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Описание</label><textarea name="description" defaultValue={editingEvent.description} required rows="4" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-lg text-[#2E1D67] resize-none"></textarea></div>
              <div><label className="block text-[#2E1D67] font-black uppercase tracking-widest text-xs mb-2">Обложка мероприятия (оставьте пустым, чтобы не менять)</label><input type="file" name="event_picture" accept="image/*" className="w-full bg-[#F4F5F8] border-2 border-transparent rounded-xl p-4 outline-none focus:border-[#6856BC] font-medium text-[#2E1D67] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2E1D67] file:text-white file:uppercase file:tracking-widest cursor-pointer" /></div>
              <div className="flex justify-end gap-4 mt-4">
                 <button type="button" onClick={() => setEditingEvent(null)} className="bg-white border-2 border-[#EB5893] text-[#EB5893] hover:bg-[#EB5893] hover:text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Отмена</button>
                 <button type="submit" className="bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-3 px-6 rounded-full text-xs transition-colors shadow-md">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;