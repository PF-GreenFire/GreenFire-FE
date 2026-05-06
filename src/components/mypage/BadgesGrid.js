import React from "react";
import { BsLock } from "react-icons/bs";

// "🐝" 같은 이모지/짧은 문자는 src로 쓰면 안 되고 텍스트로 렌더
const isEmojiSrc = (s) => typeof s === "string" && s.length <= 6 && !/^[/.\w-]/.test(s);

const BadgesGrid = ({ badges, onBadgeClick }) => {
  // 데이터가 없을 때
  if (!badges || badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-6xl mb-4">🏆</span>
        <p className="text-base m-0">아직 달성한 배지가 없어요</p>
        <p className="text-sm m-0 mt-1">챌린지에 참여해서 배지를 모아보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 mt-5">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`relative flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 transition-all duration-200
            ${badge.unlocked ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : "opacity-60"}`}
          onClick={() => onBadgeClick(badge)}
        >
          {/* NEW 표시 */}
          {badge.unlocked && badge.isNew && !badge.isViewed && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
              NEW
            </div>
          )}

          <div className="w-[80px] h-[80px] flex items-center justify-center">
            {badge.unlocked ? (
              isEmojiSrc(badge.image) ? (
                <span className="text-5xl select-none">{badge.image}</span>
              ) : (
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <BsLock size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-gray-800 text-center line-clamp-2">
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BadgesGrid;
