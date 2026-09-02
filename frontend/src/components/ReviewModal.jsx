import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, onSubmit, eventName }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ rating, text });
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-bold mb-4">Отзыв о мероприятии</h3>
        <p className="text-gray-600 mb-4">{eventName}</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Оценка (1-5)</label>
          <input 
            type="number" min="1" max="5" 
            value={rating} onChange={(e) => setRating(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ваш отзыв</label>
          <textarea 
            rows="4" 
            value={text} onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-lg p-2 resize-none"
            placeholder="Напишите ваши впечатления..."
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Отмена</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#0FA958] text-white rounded-lg hover:bg-green-600">
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;