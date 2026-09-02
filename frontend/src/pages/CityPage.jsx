import React from 'react';
import { Link } from 'react-router-dom';

const CityPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-[1200px] font-['Onest',sans-serif]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#2E1D67] uppercase tracking-widest">О нашем городе — Санкт-Петербург</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
          Культурная столица России, ведущий центр образования, науки и динамично развивающихся молодёжных инициатив.
        </p>
        <div className="w-full h-[300px] md:h-[450px] bg-[#F0D8C2] rounded-tr-[80px] rounded-bl-[80px] rounded-tl-3xl rounded-br-3xl flex justify-center items-center text-[#2E1D67] font-black uppercase tracking-widest text-lg md:text-xl shadow-inner border-4 border-dashed border-[#FBBA00] hover:bg-[#e8cbb0] transition-colors cursor-pointer">
          [ Место для панорамного фото Санкт-Петербурга ]
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
        <div className="md:w-1/2">
          <h3 className="text-3xl font-black mb-4 text-[#EB5893] uppercase tracking-wider">История и архитектура</h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify mb-4 font-medium">
            Основанный в 1703 году, Санкт-Петербург стал "окном в Европу" и одним из красивейших городов мира. Исторический центр города и связанные с ним комплексы памятников входят в список объектов Всемирного наследия ЮНЕСКО. 
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-justify font-medium">
            Величественные ансамбли Дворцовой площади, гранитные набережные Невы, разводные мосты и белые ночи создают неповторимую атмосферу, вдохновляющую новаторов и творцов со всего мира.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[350px] bg-white rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl flex justify-center items-center text-[#2E1D67] font-black shadow-lg border-2 border-dashed border-[#6856BC]">
          [ Фото: Исторический центр / Архитектура ]
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
        <div className="md:w-1/2">
          <h3 className="text-3xl font-black mb-4 text-[#EB5893] uppercase tracking-wider">Образование и наука</h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify mb-4 font-medium">
            Петербург объединяет сотни тысяч студентов со всего мира. В городе сосредоточено свыше семидесяти ведущих высших учебных заведений и академических институтов.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-justify font-medium">
            Здесь созданы комфортные условия для развития науки и технологий: действуют современные исследовательские лаборатории, бизнес-инкубаторы и инновационные площадки.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[350px] bg-white rounded-tr-[60px] rounded-bl-[60px] rounded-tl-2xl rounded-br-2xl flex justify-center items-center text-[#2E1D67] font-black shadow-lg border-2 border-dashed border-[#6856BC]">
          [ Фото: Студенты / Университетский кампус ]
        </div>
      </div>

      <div className="bg-[#FBBA00] rounded-tl-[80px] rounded-br-[80px] rounded-tr-2xl rounded-bl-2xl p-8 md:p-12 shadow-xl mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-bl-full"></div>
        <h3 className="text-3xl font-black mb-8 text-[#2E1D67] text-center uppercase tracking-widest relative z-10">Город безграничных возможностей</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg text-center shadow-lg hover:scale-105 transition-transform">
            <p className="text-4xl font-black text-[#00A552]">70+</p>
            <p className="text-sm font-bold text-[#2E1D67] uppercase mt-3">Высших учебных заведений</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tl-[30px] rounded-br-[30px] rounded-tr-lg rounded-bl-lg text-center shadow-lg hover:scale-105 transition-transform">
            <p className="text-4xl font-black text-[#00A552]">200+</p>
            <p className="text-sm font-bold text-[#2E1D67] uppercase mt-3">Музеев и арт-выставок</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tr-[30px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg text-center shadow-lg hover:scale-105 transition-transform">
            <p className="text-4xl font-black text-[#00A552]">300k+</p>
            <p className="text-sm font-bold text-[#2E1D67] uppercase mt-3">Студентов со всего мира</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-tl-[30px] rounded-br-[30px] rounded-tr-lg rounded-bl-lg text-center shadow-lg hover:scale-105 transition-transform">
            <p className="text-4xl font-black text-[#00A552]">500+</p>
            <p className="text-sm font-bold text-[#2E1D67] uppercase mt-3">Молодёжных инициатив</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F0D8C2] rounded-tr-[80px] rounded-bl-[80px] rounded-tl-2xl rounded-br-2xl p-8 md:p-12 shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 border-4 border-white relative">
        <div className="md:w-2/5 w-full h-[250px] bg-white rounded-tl-[40px] rounded-br-[40px] flex justify-center items-center text-[#2E1D67] font-black uppercase tracking-widest shadow-inner border-2 border-dashed border-[#EB5893]">
          [ Фото: МКД СПб ]
        </div>
        <div className="md:w-3/5 text-center md:text-left">
          <h3 className="text-3xl font-black mb-4 text-[#2E1D67] uppercase tracking-widest">Развивай город вместе с МКД СПб!</h3>
          <p className="text-gray-700 text-lg mb-8 font-medium leading-relaxed">
            Международный клуб дружбы Санкт-Петербурга создает экосистему, где каждый молодой человек может реализовать свои идеи, найти единомышленников и внести реальный вклад в будущее города.
          </p>
          <Link 
            to="/events" 
            className="inline-block bg-[#00A552] hover:bg-[#328D2E] text-white font-black uppercase tracking-widest py-4 px-10 rounded-full transition-colors shadow-xl text-lg"
          >
            Узнать о ближайших событиях
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CityPage;