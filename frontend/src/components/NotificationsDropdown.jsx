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
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b font-bold text-gray-700">Уведомления</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">Нет новых уведомлений</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-3 text-sm border-b last:border-b-0 ${notif.WasReadStatus ? 'bg-white' : 'bg-blue-50'}`}>
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