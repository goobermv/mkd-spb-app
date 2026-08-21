import React from 'react';
import { Link } from 'react-router-dom';

const CityPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-[1200px]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">О нашем городе — Санкт-Петербург</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
          Культурная столица России, ведущий центр образования, науки и динамично развивающихся молодёжных инициатив.
        </p>
        <div className="w-full h-[300px] md:h-[450px] bg-gray-200 rounded-[40px] flex justify-center items-center text-gray-500 font-bold text-lg md:text-xl shadow-inner border-4 border-dashed border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer">
          [ Место для панорамного фото Санкт-Петербурга ]
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
        <div className="md:w-1/2">
          <h3 className="text-3xl font-bold mb-4 text-[#0FA958]">История и архитектура</h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify mb-4">
            Основанный в 1703 году, Санкт-Петербург стал "окном в Европу" и одним из красивейших городов мира. Исторический центр города и связанные с ним комплексы памятников входят в список объектов Всемирного наследия ЮНЕСКО. 
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            Величественные ансамбли Дворцовой площади, гранитные набережные Невы, разводные мосты и белые ночи создают неповторимую атмосферу, вдохновляющую новаторов и творцов со всего мира.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[350px] bg-gray-200 rounded-[30px] flex justify-center items-center text-gray-500 shadow-inner border-2 border-dashed border-gray-400 hover:bg-gray-300 transition-colors">
          [ Фото: Исторический центр / Архитектура ]
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
        <div className="md:w-1/2">
          <h3 className="text-3xl font-bold mb-4 text-[#0FA958]">Образование и наука</h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify mb-4">
            Петербург объединяет сотни тысяч студентов со всего мира. В городе сосредоточено свыше семидесяти ведущих высших учебных заведений и академических институтов.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            Здесь созданы комфортные условия для развития науки и технологий: действуют современные исследовательские лаборатории, бизнес-инкубаторы и инновационные площадки.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[350px] bg-gray-200 rounded-[30px] flex justify-center items-center text-gray-500 shadow-inner border-2 border-dashed border-gray-400 hover:bg-gray-300 transition-colors">
          [ Фото: Студенты / Университетский кампус ]
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
        <div className="md:w-1/2">
          <h3 className="text-3xl font-bold mb-4 text-[#0FA958]">Креативные пространства</h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify mb-4">
            Город славится не только классическими театрами и музеями мировой величины, но и современными общественными пространствами.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            Преобразованные набережные и кластеры стали точками притяжения для молодежи. Здесь регулярно проходят международные фестивали, открытые лекции и выставки.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[350px] bg-gray-200 rounded-[30px] flex justify-center items-center text-gray-500 shadow-inner border-2 border-dashed border-gray-400 hover:bg-gray-300 transition-colors">
          [ Фото: Креативные пространства города ]
        </div>
      </div>

      <div className="bg-[#E4D596] rounded-[40px] p-8 md:p-12 shadow-md mb-20">
        <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">Город безграничных возможностей</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-sm">
            <p className="text-4xl font-bold text-[#0FA958]">70+</p>
            <p className="text-sm font-bold text-gray-700 mt-3">Высших учебных заведений</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-sm">
            <p className="text-4xl font-bold text-[#0FA958]">200+</p>
            <p className="text-sm font-bold text-gray-700 mt-3">Музеев и арт-выставок</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-sm">
            <p className="text-4xl font-bold text-[#0FA958]">300k+</p>
            <p className="text-sm font-bold text-gray-700 mt-3">Студентов со всего мира</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-sm">
            <p className="text-4xl font-bold text-[#0FA958]">500+</p>
            <p className="text-sm font-bold text-gray-700 mt-3">Молодёжных инициатив</p>
          </div>
        </div>
      </div>

      <div className="bg-[#FCEB9C] rounded-[40px] p-8 md:p-10 shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-2/5 w-full h-[250px] bg-white/50 rounded-3xl flex justify-center items-center text-gray-500 shadow-inner border-2 border-dashed border-gray-400">
          [ Фото: Команда МКД / Волонтёры ]
        </div>
        <div className="md:w-3/5 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">Развивай город вместе с нами!</h3>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            Наша команда создает экосистему, где каждый молодой человек может реализовать свои идеи, найти единомышленников и внести реальный вклад в будущее Санкт-Петербурга.
          </p>
          <Link 
            to="/events" 
            className="inline-block bg-[#0FA958] hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-colors shadow-md text-lg"
          >
            Узнать о ближайших событиях
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CityPage;