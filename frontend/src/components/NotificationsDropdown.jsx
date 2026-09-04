import React, { useState, useEffect } from 'react';

const NotificationsDropdown = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      setNotifications([
        { id: 1, NotificationText: 'Мероприятие "IT-конференция" скоро начнется!', WasReadStatus: false },
        { id: 2, NotificationText: 'Ваша заявка одобрена', WasReadStatus: true }
      ]);
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.WasReadStatus).length;

  return (
    <div className="relative font-['Onest',sans-serif]">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2.5 bg-[#F4F5F8] text-[#2E1D67] rounded-full hover:bg-[#EB5893] hover:text-white transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EB5893] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-tl-[30px] rounded-br-[30px] rounded-tr-xl rounded-bl-xl shadow-2xl border-2 border-[#F0D8C2] z-50 overflow-hidden">
          <div className="p-4 bg-[#2E1D67] text-white font-black uppercase tracking-widest text-sm text-center border-b-4 border-[#FBBA00]">
            Уведомления
          </div>
          <div className="max-h-72 overflow-y-auto bg-[#F4F5F8]">
            {notifications.length === 0 ? (
              <p className="p-6 text-sm text-[#2E1D67] font-bold text-center">Нет новых уведомлений</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 text-sm border-b border-[#F0D8C2] last:border-b-0 transition-colors ${notif.WasReadStatus ? 'bg-white hover:bg-[#F4F5F8] text-gray-700 font-medium' : 'bg-[#F0D8C2]/40 hover:bg-[#F0D8C2]/60 font-bold text-[#2E1D67]'}`}>
                  {notif.NotificationText}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;