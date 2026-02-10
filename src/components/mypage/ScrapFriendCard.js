import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { followUserAPI, unfollowUserAPI } from "../../apis/followAPI";

const ScrapFriendCard = ({ item, followFilter }) => {
  const dispatch = useDispatch();

  // 로컬 상태로 즉각적 UI 반영 (낙관적 업데이트)
  const [isFollowing, setIsFollowing] = useState(
    followFilter === "팔로잉" ? true : !!item.isFollowing
  );

  const handleMessageClick = (e) => {
    e.stopPropagation();
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(true);
    dispatch(followUserAPI(item.userId));
  };

  const handleUnfollow = (e) => {
    e.stopPropagation();
    setIsFollowing(false);
    dispatch(unfollowUserAPI(item.userId));
  };

  const renderButtons = () => {
    if (followFilter === "팔로잉") {
      if (isFollowing) {
        // 팔로잉 중 → 우체통 + 언팔로우
        return (
          <div className="flex gap-2 flex-shrink-0">
            <button
              className="py-2 px-3 bg-gray-200 border-none rounded-lg text-[13px] font-medium text-gray-800 cursor-pointer transition-colors hover:bg-gray-300"
              onClick={handleMessageClick}
            >
              우체통
            </button>
            <button
              className="py-2 px-3 bg-white border border-red-300 rounded-lg text-[13px] font-medium text-red-500 cursor-pointer transition-colors hover:bg-red-50 hover:border-red-400"
              onClick={handleUnfollow}
            >
              언팔로우
            </button>
          </div>
        );
      }
      // 언팔로우 후 → 팔로우 버튼
      return (
        <button
          className="flex-shrink-0 py-2 px-4 bg-green-primary border-none rounded-lg text-[13px] font-medium text-white cursor-pointer transition-colors hover:bg-green-dark"
          onClick={handleFollow}
        >
          팔로우
        </button>
      );
    }

    // 팔로워 필터
    if (isFollowing) {
      // 서로 팔로우 중 → 우체통 버튼
      return (
        <button
          className="flex-shrink-0 py-2 px-4 bg-gray-200 border-none rounded-lg text-[13px] font-medium text-gray-800 cursor-pointer transition-colors hover:bg-gray-300"
          onClick={handleMessageClick}
        >
          우체통
        </button>
      );
    }

    // 상대방만 나를 팔로우 중 → 맞팔로우 버튼
    return (
      <button
        className="flex-shrink-0 py-2 px-4 bg-green-primary border-none rounded-lg text-[13px] font-medium text-white cursor-pointer transition-colors hover:bg-green-dark"
        onClick={handleFollow}
      >
        맞팔로우
      </button>
    );
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
      {renderButtons()}
    </div>
  );
};

export default ScrapFriendCard;
