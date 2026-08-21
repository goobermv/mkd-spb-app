import React from 'react';
import Sidebar from '../components/Sidebar';
import NewsCard from '../components/NewsCard';

const NewsPage = ({ newsList }) => {
  const approvedNews = newsList.filter(news => news.approved);
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="bg-[#E4D596] rounded-[40px] p-8 pb-12 shadow-md">
        <h2 className="text-3xl text-white font-bold text-center mb-8 bg-[#D3C380] rounded-full py-2 w-1/2 md:w-1/3 mx-auto shadow-sm">Новости</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar />
          <div className="md:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {approvedNews.length > 0 ? (
              approvedNews.map(news => <NewsCard key={news.id} title={news.title} date={news.date} description={news.description} />)
            ) : (
              <p className="text-center text-gray-700 text-lg py-10 bg-white/50 rounded-2xl col-span-full">Новостей пока нет.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;