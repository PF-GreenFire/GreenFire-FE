import React from 'react';
import { Row } from 'react-bootstrap';
import { IoSettingsOutline, IoMailOutline } from 'react-icons/io5';

const ProfileInfoSection = ({ user }) => {
  return (
    <Row className="m-0 p-0">
      <div className="flex px-4 -mt-[50px] relative z-[1]">
        {/* 프로필 이미지 */}
        <div className="w-[100px] h-[100px] rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex-shrink-0">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src="/images/default-profile.png"
                alt="기본 프로필"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-[40px]">👤</span>';
                }}
              />
            </div>
          )}
        </div>

        {/* 통계 및 버튼 */}
        <div className="flex-1 flex flex-col ml-4 pt-14">
          <div className="flex gap-5 mb-2.5">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-800">{user.stats.posts}</span>
              <span className="text-xs text-gray-600">게시물</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-800">{user.stats.followers}</span>
              <span className="text-xs text-gray-600">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-800">{user.stats.following}</span>
              <span className="text-xs text-gray-600">팔로잉</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 py-1.5 px-3 border border-gray-300 rounded-lg bg-white text-xs text-gray-800 cursor-pointer transition-colors hover:bg-gray-100">
              <IoSettingsOutline /> 설정
            </button>
            <button className="flex items-center gap-1 py-1.5 px-3 border border-gray-300 rounded-lg bg-white text-xs text-gray-800 cursor-pointer transition-colors hover:bg-gray-100">
              <IoMailOutline /> 우체통
            </button>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default ProfileInfoSection;
