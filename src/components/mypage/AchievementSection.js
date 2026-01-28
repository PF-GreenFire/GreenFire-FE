import React from 'react';
import { useNavigate } from 'react-router-dom';

const AchievementSection = ({ count, achievements = [] }) => {
  const navigate = useNavigate();

  const displayAchievements = achievements.slice(0, 3);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800 m-0">
          달성한 업적 <span className="text-sm font-normal text-gray-500">+{count}</span>
        </h3>
        <button
          className="bg-transparent border-none text-gray-500 text-sm cursor-pointer p-0 hover:text-green-primary"
          onClick={() => navigate('/mypage/achievements')}
        >
          더보기
        </button>
      </div>
      {achievements.length > 0 ? (
        <div className="flex gap-4 bg-gray-100 rounded-xl p-3 justify-center">
          {displayAchievements.map((achievement) => (
            <div key={achievement.id} className="flex flex-col items-center gap-2 flex-1 max-w-[100px]">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                <img
                  src={achievement.image}
                  alt={achievement.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 text-center break-keep">{achievement.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl py-10 px-5 flex items-center justify-center">
          <p className="text-gray-500 text-sm m-0">업적을 달성해보세요!</p>
        </div>
      )}
    </section>
  );
};

export default AchievementSection;
