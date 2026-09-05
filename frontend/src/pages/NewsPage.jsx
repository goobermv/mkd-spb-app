import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard';

const NewsPage = ({ newsList }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredNews = newsList.filter(news => {
    if (news.publication_status !== 'Published') return false;
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(news.news_block_category);
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px] font-['Onest',sans-serif]">
      <div className="bg-[#F0D8C2] rounded-tl-[80px] rounded-br-[80px] rounded-tr-xl rounded-bl-xl p-10 pb-16 shadow-2xl relative overflow-hidden border-t-8 border-[#EB5893]">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FBBA00] rounded-tl-full opacity-20"></div>
        <h2 className="text-3xl md:text-4xl text-white font-black bg-[#6856BC]/50 rounded-full py-4 px-12 mx-auto w-fit mb-10 shadow-sm uppercase tracking-widest backdrop-blur-sm border border-[#6856BC] block relative z-10 text-center">
          Новости
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <Sidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
          
          <div className="md:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {filteredNews.length > 0 ? (
              filteredNews.map(news => (
                <div key={news.id} onClick={() => setSelectedNews(news)} className="cursor-pointer transition-transform hover:-translate-y-1 h-full">
                  <NewsCard title={news.title} date={new Date(news.publication_date).toLocaleDateString()} description={news.description} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-full min-h-[300px] bg-white/40 backdrop-blur-sm rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl border-2 border-dashed border-[#2E1D67]/30">
                <p className="text-center text-[#2E1D67] text-xl font-bold uppercase tracking-widest">По выбранным категориям новостей пока нет.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedNews && (
        <div className="fixed inset-0 bg-[#2E1D67]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl p-8 md:p-12 w-full max-w-4xl flex flex-col md:flex-row gap-8 relative shadow-2xl font-['Onest',sans-serif]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 bg-[#F4F5F8] w-12 h-12 rounded-full flex items-center justify-center text-[#2E1D67] text-2xl font-bold hover:bg-[#EB5893] hover:text-white transition-colors shadow-md z-10">×</button>
            <div className="flex-1 flex flex-col justify-between mt-4 md:mt-0">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-[#2E1D67] uppercase tracking-widest mb-6 pr-6 leading-tight">{selectedNews.title}</h3>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-8 whitespace-pre-line">{selectedNews.description}</p>
              </div>
              <div>
                <p className="text-[#6856BC] font-black text-xl mb-6"> Дата: {new Date(selectedNews.publication_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="md:w-[350px] md:h-[450px] h-[300px] bg-[#F0D8C2] rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl shadow-inner flex items-center justify-center text-[#2E1D67] font-black uppercase tracking-widest text-xl flex-shrink-0 border-4 border-white">Фото</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;