import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

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

  const isActivist = currentUser.role === 'activist' || currentUser.role === 'admin';
  const roleTitle = isActivist ? 'ЛК активиста' : 'ЛК пользователя';

  const tabs = isActivist 
    ? ["Мои мероприятия", "Мои заявки", "Архив", "Статистика"]
    : ["Мои мероприятия", "Архив мероприятий", "Статистика"];
  
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-[1200px]">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{roleTitle}</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        
        <div className="w-full md:w-[300px] bg-[#DBCB89] rounded-[40px] p-8 flex flex-col flex-shrink-0 shadow-sm relative min-h-[600px]">
          
          <div className="bg-white w-full aspect-square rounded-[30px] flex items-center justify-center mb-8 shadow-inner overflow-hidden border-2 border-white/50">
            <span className="text-xl font-bold text-gray-500">Аватарка</span>
          </div>
          
          <div className="flex flex-col gap-2 text-gray-900 mb-10">
            <p className="font-bold text-xl leading-tight">{currentUser.fullName}</p>
            <p className="font-medium text-gray-800">🌍 {currentUser.country || "Не указана"}</p>
            <p className="font-medium text-gray-800">🎓 {currentUser.jobField || "Не указано"}</p>
            <p className="font-medium truncate text-gray-800">
              {currentUser.vkLink ? (
                <a href={currentUser.vkLink} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">
                  🔗 Ссылка на ВК
                </a>
              ) : '🔗 Нет ссылки ВК'}
            </p>
            {currentUser.userDescription && (
              <p className="text-xs text-gray-700 italic mt-2 bg-white/40 p-3 rounded-xl">
                "{currentUser.userDescription}"
              </p>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4">
             <button 
               onClick={() => setIsEditing(true)}
               className="bg-[#B5FF9C] border-2 border-[#1ECA42] text-[#149530] hover:bg-[#a3f887] font-bold py-3 px-4 rounded-full transition-colors w-full shadow-sm text-center"
             >
               Редактировать
             </button>
             <button 
               onClick={handleLogout}
               className="bg-[#FFA4A4] border-2 border-[#FF4E4E] text-[#D81B1B] hover:bg-[#ff9191] font-bold py-3 px-4 rounded-full transition-colors w-full shadow-sm text-center"
             >
               Выйти
             </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          
          <div className="bg-[#D9FAFA] rounded-[30px] p-6 flex flex-col md:flex-row justify-end items-center gap-4 shadow-sm w-full">
            {isActivist && (
              <>
                <button className="bg-[#E9B9FF] hover:bg-[#dfa0fc] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-sm w-full md:w-auto">
                  + Создать инфоповод
                </button>
                <button className="bg-[#FFDE59] hover:bg-[#f2cd3c] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-sm w-full md:w-auto">
                  + Создать мероприятие
                </button>
              </>
            )}
            <button 
              onClick={() => navigate('/')} 
              className="bg-[#0FA958] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-sm w-full md:w-auto"
            >
              Вернуться на главную
            </button>
          </div>

          <div className="bg-[#F6EFE6] rounded-[40px] p-6 shadow-sm flex-grow min-h-[500px]">
            
            <div className="bg-[#DBCB89] rounded-full p-2 flex flex-wrap md:flex-nowrap gap-2 justify-between md:justify-start items-center">
               {tabs.map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 md:flex-none text-center font-bold py-3 px-6 rounded-full transition-all text-sm md:text-base ${
                     activeTab === tab 
                      ? 'bg-[#F6EFE6] text-gray-900 shadow-sm' 
                      : 'text-gray-800 hover:bg-white/40'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="p-6 mt-4">
               {activeTab === "Мои мероприятия" && (
                 <div className="space-y-4">
                   <p className="text-gray-700 text-lg mb-4 font-medium">Мероприятия, на которые вы зарегистрированы:</p>
                   <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                     <div>
                       <h4 className="font-bold text-gray-800 text-lg">Молодёжный Петербург: Слет лидеров</h4>
                       <p className="text-sm text-gray-500">Дата: 25 Октября 2026 | Локация: Главный корпус</p>
                     </div>
                     <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Подтверждено</span>
                   </div>
                 </div>
               )}
               {activeTab === "Архив мероприятий" && (
                 <p className="text-gray-600 text-lg">История посещенных вами мероприятий пока пуста.</p>
               )}
               {activeTab === "Архив" && (
                 <p className="text-gray-600 text-lg">Архив созданных вами мероприятий и инфоповодов.</p>
               )}
               {activeTab === "Мои заявки" && (
                 <div className="space-y-4">
                   <p className="text-gray-700 text-lg mb-4 font-medium">Ваши заявки на рассмотрении:</p>
                   <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                     <div>
                       <h4 className="font-bold text-gray-800 text-lg">Заявка на организацию форума IT-стартапов</h4>
                       <p className="text-sm text-gray-500">Отправлено: 12 Сентября 2026</p>
                     </div>
                     <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">На проверке</span>
                   </div>
                 </div>
               )}
               {activeTab === "Статистика" && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
                     <span className="text-3xl font-bold text-[#0FA958]">12</span>
                     <p className="text-sm text-gray-600 font-medium mt-1">Посещенных событий</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
                     <span className="text-3xl font-bold text-[#0FA958]">5</span>
                     <p className="text-sm text-gray-600 font-medium mt-1">Проектов подано</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
                     <span className="text-3xl font-bold text-[#0FA958]">120 ч</span>
                     <p className="text-sm text-gray-600 font-medium mt-1">Волонтёрских часов</p>
                   </div>
                 </div>
               )}
            </div>
            
          </div>
        </div>

      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F6EFE6] rounded-[30px] p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Редактирование профиля</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700">ФИО</label>
                <input 
                  type="text" 
                  value={editFormData.fullName || ''} 
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                  className="w-full h-10 rounded-full px-4 mt-1 border border-gray-300 outline-none focus:border-[#0FA958]" 
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Страна</label>
                <input 
                  type="text" 
                  value={editFormData.country || ''} 
                  onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                  className="w-full h-10 rounded-full px-4 mt-1 border border-gray-300 outline-none focus:border-[#0FA958]" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Место учебы/работы</label>
                <input 
                  type="text" 
                  value={editFormData.jobField || ''} 
                  onChange={(e) => setEditFormData({...editFormData, jobField: e.target.value})}
                  className="w-full h-10 rounded-full px-4 mt-1 border border-gray-300 outline-none focus:border-[#0FA958]" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Ссылка на ВКонтакте</label>
                <input 
                  type="url" 
                  value={editFormData.vkLink || ''} 
                  onChange={(e) => setEditFormData({...editFormData, vkLink: e.target.value})}
                  className="w-full h-10 rounded-full px-4 mt-1 border border-gray-300 outline-none focus:border-[#0FA958]" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">О себе</label>
                <textarea 
                  value={editFormData.userDescription || ''} 
                  onChange={(e) => setEditFormData({...editFormData, userDescription: e.target.value})}
                  className="w-full rounded-2xl p-4 mt-1 border border-gray-300 outline-none focus:border-[#0FA958] h-24" 
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#0FA958] text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors"
                >
                  Сохранить
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-full hover:bg-gray-400 transition-colors"
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