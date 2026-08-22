import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setEditFormData(currentUser);
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCurrentUser(editFormData);
    setIsEditing(false);
  };

  const role = currentUser.role || 'user';
  
  const getRoleTitle = () => {
    if (role === 'admin') return 'Панель администратора';
    if (role === 'activist') return 'Личный кабинет активиста';
    return 'Личный кабинет';
  };

  const getTabs = () => {
    const userTabs = ["Мои мероприятия", "Архив", "Статистика"];
    const activistTabs = ["Мои проекты", ...userTabs];
    const adminTabs = ["Заявки в актив", "Модерация мероприятий", "Модерация новостей", "База пользователей", ...activistTabs];

    switch (role) {
      case 'admin': return adminTabs;
      case 'activist': return activistTabs;
      default: return userTabs;
    }
  };

  const tabs = getTabs();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  
  useEffect(() => {
    setActiveTab(getTabs()[0]);
  }, [role]);

  const mockUsers = [
    { id: 1, name: "Иван Иванов", email: "ivan@mail.ru", role: "user", requestActive: true },
    { id: 2, name: "Анна Смирнова", email: "anna@mail.ru", role: "activist", requestActive: false },
    { id: 3, name: "Петр Петров", email: "petr@mail.ru", role: "user", requestActive: false },
  ];
  
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-white rounded-[30px] p-8 flex flex-col shadow-lg border border-gray-100 relative min-h-[500px]">
            <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-[#E4D596] to-[#0FA958] rounded-full p-1 mb-6 shadow-md">
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-4xl">🧑‍💻</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="font-bold text-2xl text-gray-900 mb-1">{currentUser.fullName}</h3>
              <p className="text-sm font-semibold text-[#0FA958] uppercase tracking-wider mb-4">
                {role === 'admin' ? 'Администратор' : role === 'activist' ? 'Активист МКД' : 'Пользователь'}
              </p>
              
              <div className="flex flex-col gap-3 text-left bg-gray-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span>🌍</span> {currentUser.country || "Страна не указана"}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span>🎓</span> {currentUser.jobField || "Место учебы/работы"}
                </p>
                {currentUser.vkLink && (
                  <a href={currentUser.vkLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <span>🔗</span> ВКонтакте
                  </a>
                )}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
               <button 
                 onClick={() => setIsEditing(true)}
                 className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-full transition-colors w-full shadow-sm text-sm"
               >
                 Настройки профиля
               </button>
               <button 
                 onClick={handleLogout}
                 className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-full transition-colors w-full shadow-sm text-sm"
               >
                 Выйти из аккаунта
               </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900">{getRoleTitle()}</h2>
            
            {(role === 'activist' || role === 'admin') && (
              <div className="flex gap-3">
                <button className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-md text-sm">
                  + Мероприятие
                </button>
                <button className="bg-[#DBCB89] hover:bg-[#c9b978] text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-md text-sm">
                  + Новость
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[30px] shadow-lg border border-gray-100 flex-grow overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-2 flex flex-wrap gap-2 items-center w-full">
                 {tabs.map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex-grow md:flex-grow-0 text-center ${
                       activeTab === tab 
                        ? 'bg-white text-[#0FA958] shadow-sm ring-1 ring-gray-100' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                     }`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
            </div>

            <div className="p-6 md:p-8 flex-grow bg-gray-50/50">
               
               {activeTab === "Мои мероприятия" && (
                 <div className="space-y-4">
                   <h4 className="text-xl font-bold text-gray-800 mb-4">Ближайшие события</h4>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-hover hover:shadow-md">
                     <div>
                       <h5 className="font-bold text-gray-900 text-lg">Молодёжный Петербург: Слет лидеров</h5>
                       <p className="text-sm text-gray-500 mt-1">📅 25 Октября 2026 | 📍 Главный корпус</p>
                     </div>
                     <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
                       Вы зарегистрированы
                     </span>
                   </div>
                 </div>
               )}

               {activeTab === "Архив" && (
                 <div className="space-y-4">
                   <h4 className="text-xl font-bold text-gray-800 mb-4">Прошедшие события</h4>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-70">
                     <div>
                       <h5 className="font-bold text-gray-900 text-lg">Экологическая акция "Чистый берег"</h5>
                       <p className="text-sm text-gray-500 mt-1">📅 12 Сентября 2026 | 📍 Парк 300-летия</p>
                     </div>
                     <span className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
                       Завершено
                     </span>
                   </div>
                 </div>
               )}

               {activeTab === "Статистика" && (
                 <div>
                   <h4 className="text-xl font-bold text-gray-800 mb-6">Ваша активность</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-6 rounded-3xl text-center shadow-sm border border-gray-100">
                       <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3 text-[#0FA958] text-2xl font-bold">12</div>
                       <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Мероприятий</p>
                     </div>
                     <div className="bg-white p-6 rounded-3xl text-center shadow-sm border border-gray-100">
                       <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-3 text-yellow-600 text-2xl font-bold">120</div>
                       <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Часов</p>
                     </div>
                     <div className="bg-white p-6 rounded-3xl text-center shadow-sm border border-gray-100">
                       <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600 text-2xl font-bold">3</div>
                       <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Сертификата</p>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === "Мои проекты" && (
                 <div className="space-y-4">
                   <h4 className="text-xl font-bold text-gray-800 mb-4">Ваши инициативы</h4>
                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                       <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">В разработке</span>
                       <h5 className="font-bold text-gray-900 text-lg">Платформа для обмена книгами</h5>
                       <p className="text-sm text-gray-500 mt-1">Роль: Руководитель проекта</p>
                     </div>
                     <button className="bg-gray-100 text-gray-700 py-2 px-6 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                       Управление
                     </button>
                   </div>
                 </div>
               )}

               {activeTab === "Заявки в актив" && (
                 <div className="space-y-4">
                   <h4 className="text-xl font-bold text-gray-800 mb-4">Новые заявки на вступление</h4>
                   {mockUsers.filter(u => u.requestActive).map(user => (
                     <div key={user.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                         <div>
                           <h5 className="font-bold text-gray-900">{user.name}</h5>
                           <p className="text-sm text-gray-500">{user.email}</p>
                         </div>
                       </div>
                       <div className="flex gap-2 w-full md:w-auto">
                         <button className="flex-1 md:flex-none bg-[#0FA958] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors">Принять</button>
                         <button className="flex-1 md:flex-none bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 px-6 rounded-full text-sm transition-colors">Отклонить</button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {activeTab === "Модерация мероприятий" && (
                 <div className="space-y-4">
                   <h4 className="text-xl font-bold text-gray-800 mb-4">Мероприятия на проверке</h4>
                   <div className="bg-white p-5 rounded-2xl border border-yellow-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                       <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Ожидает проверки</span>
                       <h5 className="font-bold text-gray-900 text-lg">Хакатон "Цифровой город"</h5>
                       <p className="text-sm text-gray-500 mt-1">Автор: Анна Смирнова | Дата: 15 Ноября 2026</p>
                     </div>
                     <div className="flex gap-2 w-full md:w-auto">
                       <button className="flex-1 bg-[#0FA958] text-white py-2 px-4 rounded-full text-sm font-bold hover:bg-green-600">Одобрить</button>
                       <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-full text-sm font-bold hover:bg-gray-200">Изучить</button>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === "База пользователей" && (
                 <div className="space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <h4 className="text-xl font-bold text-gray-800">Все пользователи</h4>
                     <input 
                       type="text" 
                       placeholder="Поиск по имени или почте..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full md:w-72 h-10 rounded-full px-5 border border-gray-200 outline-none focus:border-[#0FA958] text-sm"
                     />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                     {filteredUsers.map(user => (
                       <div key={user.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                         <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex-shrink-0"></div>
                         <div className="overflow-hidden">
                           <h5 className="font-bold text-gray-900 truncate">{user.name}</h5>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                           <span className={`text-[10px] font-bold uppercase mt-1 inline-block ${user.role === 'activist' ? 'text-[#0FA958]' : 'text-gray-400'}`}>
                             {user.role === 'activist' ? 'Активист' : 'Пользователь'}
                           </span>
                         </div>
                       </div>
                     ))}
                     {filteredUsers.length === 0 && (
                       <p className="text-gray-500 text-sm col-span-full">Пользователи не найдены.</p>
                     )}
                   </div>
                 </div>
               )}

            </div>
          </div>
        </div>

      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[30px] p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Редактирование профиля</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">ФИО</label>
                <input 
                  type="text" 
                  value={editFormData.fullName || ''} 
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                  className="w-full h-12 rounded-xl bg-gray-50 px-4 mt-1 border border-gray-200 outline-none focus:border-[#0FA958] focus:bg-white transition-colors" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Страна</label>
                  <input 
                    type="text" 
                    value={editFormData.country || ''} 
                    onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                    className="w-full h-12 rounded-xl bg-gray-50 px-4 mt-1 border border-gray-200 outline-none focus:border-[#0FA958] focus:bg-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Учеба/Работа</label>
                  <input 
                    type="text" 
                    value={editFormData.jobField || ''} 
                    onChange={(e) => setEditFormData({...editFormData, jobField: e.target.value})}
                    className="w-full h-12 rounded-xl bg-gray-50 px-4 mt-1 border border-gray-200 outline-none focus:border-[#0FA958] focus:bg-white transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ссылка на ВКонтакте</label>
                <input 
                  type="url" 
                  value={editFormData.vkLink || ''} 
                  onChange={(e) => setEditFormData({...editFormData, vkLink: e.target.value})}
                  className="w-full h-12 rounded-xl bg-gray-50 px-4 mt-1 border border-gray-200 outline-none focus:border-[#0FA958] focus:bg-white transition-colors" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">О себе</label>
                <textarea 
                  value={editFormData.userDescription || ''} 
                  onChange={(e) => setEditFormData({...editFormData, userDescription: e.target.value})}
                  className="w-full rounded-xl bg-gray-50 p-4 mt-1 border border-gray-200 outline-none focus:border-[#0FA958] focus:bg-white transition-colors min-h-[100px] resize-none" 
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#0FA958] text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-md"
                >
                  Сохранить
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;