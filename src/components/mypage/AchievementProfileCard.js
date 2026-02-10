import React from "react";

const AchievementProfileCard = ({ user, progress, calculateProgress }) => {
  // 데이터가 없을 때
  if (!progress || !progress.categories) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-5 border border-green-primary">
        <p className="text-center text-gray-400 m-0">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-5 border border-green-primary">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-green-primary">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/default_profile.png"
              alt="기본 프로필"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span class="text-2xl">👤</span>';
              }}
            />
          )}
        </div>
        <h2 className="text-lg font-semibold m-0 text-gray-800">
          {user.nickname} 님
        </h2>
      </div>

      {/* 전체 진행률 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500">배지 달성률</span>
          <span className="text-xl font-bold text-gray-800">
            {progress.overall}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-primary to-[#5fa675] rounded-full transition-all duration-300"
            style={{ width: `${progress.overall}%` }}
          />
        </div>
      </div>

      {/* 카테고리별 진행률 */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        {progress.categories.map((category, index) => (
          <div key={index} className="flex-1 flex flex-col gap-1">
            <span className="text-[11px] text-gray-500">{category.name}</span>
            <span className="text-sm font-semibold text-gray-800">
              {category.current}/{category.total}
            </span>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-primary to-[#5fa675] rounded-full transition-all duration-300"
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
