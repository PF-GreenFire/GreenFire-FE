import React from 'react';
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";

const AchievementSection = ({ count, achievements = [] }) => {
  const displayAchievements = achievements.slice(0, 3);

  return (
    <section className="mb-6">
      <SectionHeader
        title="달성한 업적"
        count={count}
        navigateTo="/mypage/achievements"
      />
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
        <EmptyState message="업적을 달성해보세요!" />
      )}
    </section>
  );
};

export default AchievementSection;
