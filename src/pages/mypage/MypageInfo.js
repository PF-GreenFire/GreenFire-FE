import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsCalendar, BsCamera } from "react-icons/bs";
import PageHeader from "../../components/mypage/PageHeader";
import ProfileImageModal from "../../components/mypage/ProfileImageModal";
import PasswordChangeModal from "../../components/mypage/PasswordChangeModal";

const MyPageInfo = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    nickname: "메밀면",
    userId: "saladybest12",
    name: "고등어",
    email: "saladybest12@naver.com",
    password: "******************",
    birthDate: "1998.11.06",
    phone: "010-1234-1234",
    profileImage: null,
  });

  const maxNicknameLength = 10;

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxNicknameLength) {
      handleInputChange("nickname", value);
    }
  };

  const handleSave = () => {
    console.log("저장할 정보:", userInfo);
  };

  const handleWithdraw = () => {
    navigate("/mypage/withdrawal");
  };

  const handleProfileImageSave = (image) => {
    handleInputChange("profileImage", image);
  };

  const handlePasswordChange = (passwordData) => {
    console.log("비밀번호 변경:", passwordData);
    // TODO: API 호출하여 비밀번호 변경 처리
  };

  return (
    <>
      <PageHeader title={`${userInfo.nickname}님의 정보`} />

      <div className="px-4 mb-[120px]">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-5">
          <div
            className="relative w-[120px] h-[120px] rounded-full border-[3px] border-green-primary overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer group"
            onClick={() => setShowProfileModal(true)}
          >
            {userInfo.profileImage ? (
              <img
                src={userInfo.profileImage}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/default_profile.png"
                alt="기본 프로필"
                className="w-full h-full object-cover"
              />
            )}
            {/* Hover 오버레이 */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:!opacity-100 transition-opacity duration-300">
              <BsCamera size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* 닉네임 및 ID */}
        <div className="mb-8 px-5 flex justify-center">
          <div>
            <div className="inline-flex items-center gap-2.5 pb-2 border-b border-gray-300">
              <input
                type="text"
                value={userInfo.nickname}
                onChange={handleNicknameChange}
                className="text-xl font-semibold text-gray-800 bg-transparent py-1 w-auto min-w-[80px] max-w-[200px] focus:outline-none"
              />
              <span className="text-sm text-gray-400">
                {userInfo.nickname.length}/{maxNicknameLength}
              </span>
            </div>
            <p className="text-sm text-gray-600 m-0 mt-2">
              ID: {userInfo.userId}
            </p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            기본 정보
          </h2>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">
              이름
            </label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">
              이메일
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">
              비밀번호
            </label>
            <div className="flex-1 flex gap-2">
              <input
                type="password"
                value={userInfo.password}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 bg-gray-50"
              />
              <button
                className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all duration-300 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent focus:outline-none whitespace-nowrap"
                onClick={() => setShowPasswordModal(true)}
              >
                비밀번호 변경
              </button>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">
              생년월일
            </label>
            <div
              className="flex-1 relative flex items-center py-3 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <span className="flex-1 text-sm text-gray-800">
                {userInfo.birthDate}
              </span>
              <BsCalendar className="text-lg text-gray-800" />
              <input
                ref={dateInputRef}
                type="date"
                value={userInfo.birthDate.replace(/\./g, "-")}
                onChange={(e) => {
                  const formatted = e.target.value.replace(/-/g, ".");
                  handleInputChange("birthDate", formatted);
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">
              휴대폰 번호
            </label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary focus:outline-none"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all duration-300 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent focus:outline-none"
            onClick={handleSave}
          >
            변경정보 저장
          </button>
          <button
            className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-[15px] font-medium text-gray-400 cursor-pointer transition-all duration-300 hover:!bg-red-100 hover:!text-red-600 hover:!border-transparent focus:outline-none"
            onClick={handleWithdraw}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 프로필 이미지 변경 모달 */}
      <ProfileImageModal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        nickname={userInfo.nickname}
        currentImage={userInfo.profileImage}
        onSave={handleProfileImageSave}
      />

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
      />
    </>
  );
};

export default MyPageInfo;
