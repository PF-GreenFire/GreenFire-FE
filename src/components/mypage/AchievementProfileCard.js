import React from 'react';

const AchievementProfileCard = ({ user, progress, calculateProgress }) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-5 shadow-md">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl overflow-hidden">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <h2 className="text-xl font-semibold m-0 text-gray-800">{user.nickname} 님</h2>
      </div>

      {/* 전체 진행률 */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">배지 달성률</span>
          <span className="text-2xl font-bold text-gray-800">{progress.overall}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-primary to-[#5fa675] rounded-md transition-all duration-300"
            style={{ width: `${progress.overall}%` }}
          />
        </div>
      </div>

      {/* 카테고리별 진행률 */}
      <div className="flex gap-4">
        {progress.categories.map((category, index) => (
          <div key={index} className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-gray-600 font-medium">{category.name}</span>
            <span className="text-sm font-semibold text-gray-800">
              {category.current}/{category.total}
            </span>
            <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-primary to-[#5fa675] rounded transition-all duration-300"
                style={{
                  width: `${calculateProgress(category.current, category.total)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementProfileCard;
