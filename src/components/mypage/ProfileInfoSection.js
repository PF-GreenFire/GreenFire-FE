import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUtils";

const ProfileInfoSection = ({ user, onSettingsClick }) => {
  return (
    <div className="flex -mt-[50px] relative z-[1]">
      {/* 프로필 이미지 */}
      <div className="w-[90px] h-[90px] rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex-shrink-0">
        {user.profileImage ? (
          <img
            src={getImageUrl(user.profileImage)}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img
              src="/default_profile.png"
              alt="기본 프로필"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span class="text-[36px]">👤</span>';
              }}
            />
          </div>
        )}
      </div>

      {/* 통계 및 버튼 */}
      <div className="flex-1 flex flex-col ml-3 pt-[52px]">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-gray-800">
                {user.stats.posts}
              </span>
              <span className="text-[11px] text-gray-500">게시물</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-gray-800">
                {user.stats.followers}
              </span>
              <span className="text-[11px] text-gray-500">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-gray-800">
                {user.stats.following}
              </span>
              <span className="text-[11px] text-gray-500">팔로잉</span>
            </div>
          </div>

          {/* 설정 버튼 */}
          <button
            className="flex items-center gap-1 py-1.5 px-3 border border-gray-300 rounded-lg bg-white text-xs text-gray-700 cursor-pointer transition-all hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent"
            onClick={onSettingsClick}
          >
            <IoSettingsOutline size={14} />
            설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;
