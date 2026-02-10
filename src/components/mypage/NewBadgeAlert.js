import React from "react";

const NewBadgeAlert = () => {
  return (
    <div className="bg-green-lighter rounded-2xl p-5 mb-5 border border-green-light">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-green-primary font-semibold">
            축하해요
          </span>
          <span className="text-lg font-bold text-gray-800">
            새로운 배지가 생겼어요!
          </span>
        </div>
        <div className="w-[70px] h-[70px] flex items-center justify-center">
          <img
            src="/images/celebration-cat.png"
            alt="축하 일러스트"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = '<span class="text-5xl">🎉</span>';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewBadgeAlert;
