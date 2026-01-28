import React from "react";

const ScrapFriendCard = ({ item, onLikeToggle }) => {
  const handleMessageClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center py-4 px-5 bg-white border-b border-gray-200 gap-4">
      <div className="flex-shrink-0 w-[70px] h-[70px] rounded-full overflow-hidden bg-gray-100">
        <img
          src={item.profileImage || "https://via.placeholder.com/80x80"}
          alt={item.nickname}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {item.nickname}
        </h3>
        <p className="text-[13px] text-gray-400 mb-1">
          {item.userId || item.email}
        </p>
        {item.bio && (
          <p className="text-[13px] text-gray-600 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {item.bio}
          </p>
        )}
      </div>
      <button
        className="flex-shrink-0 py-2 px-4 bg-gray-200 border-none rounded-lg text-[13px] font-medium text-gray-800 cursor-pointer transition-colors hover:bg-gray-300"
        onClick={handleMessageClick}
      >
        우체통
      </button>
    </div>
  );
};

export default ScrapFriendCard;
