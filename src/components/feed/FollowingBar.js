import React from "react";

const FILTERS = [
  { key: "ALL", label: "전체", emoji: "🌿" },
  { key: "CHALLENGE", label: "챌린지 인증", emoji: "🏆" },
  { key: "GREENFIRE", label: "장소 후기", emoji: "📍" },
];

const FollowingBar = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 px-4 py-2 mb-3 overflow-x-auto scrollbar-hide">
      {FILTERS.map((f) => {
        const isActive = selectedFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`shrink-0 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border cursor-pointer transition-all ${
              isActive
                ? "bg-admin-green text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {f.emoji} {f.label}
          </button>
        );
      })}
    </div>
  );
};

export default FollowingBar;
