import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { BsCalendar } from "react-icons/bs";
import PageHeader from "../../components/mypage/PageHeader";

const MyPageInfo = () => {
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
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      console.log("회원탈퇴 처리");
    }
  };

  return (
    <>
      <PageHeader title={`${userInfo.nickname}님의 정보`} />

      <Container className="px-4 mb-[120px]">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-5">
          <div className="w-[120px] h-[120px] rounded-full border-[3px] border-green-primary overflow-hidden flex items-center justify-center bg-gray-50">
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
          </div>
        </div>

        {/* 닉네임 및 ID */}
        <div className="text-center mb-8 px-5">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <input
              type="text"
              value={userInfo.nickname}
              onChange={handleNicknameChange}
              className="text-xl font-semibold text-gray-800 border-none border-b border-gray-800 bg-transparent text-left py-1 w-auto min-w-[80px] max-w-[200px] focus:outline-none focus:border-b-green-primary"
            />
            <span className="text-sm text-gray-600">
              {userInfo.nickname.length}/{maxNicknameLength}
            </span>
          </div>
          <p className="text-sm text-gray-600 m-0">ID: {userInfo.userId}</p>
        </div>

        {/* 기본 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">기본 정보</h2>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">이름</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary/25 focus:outline-none"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">이메일</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary/25 focus:outline-none"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">비밀번호</label>
            <input
              type="password"
              value={userInfo.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary/25 focus:outline-none"
            />
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">생년월일</label>
            <div className="flex-1 relative flex items-center py-3 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer">
              <span className="flex-1 text-sm text-gray-800">{userInfo.birthDate}</span>
              <BsCalendar className="text-lg text-gray-800" />
              <input
                type="date"
                value={userInfo.birthDate.replace(/\./g, "-")}
                onChange={(e) => {
                  const formatted = e.target.value.replace(/-/g, ".");
                  handleInputChange("birthDate", formatted);
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <label className="w-[90px] flex-shrink-0 text-sm text-gray-800 font-medium">휴대폰 번호</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:border-green-dark focus:ring-2 focus:ring-green-primary/25 focus:outline-none"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all duration-300 hover:bg-green-100 hover:text-green-primary hover:border-transparent focus:outline-none"
            onClick={handleSave}
          >
            변경정보 저장
          </button>
          <button
            className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-[15px] font-medium text-gray-400 cursor-pointer transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-transparent focus:outline-none"
            onClick={handleWithdraw}
          >
            회원탈퇴
          </button>
        </div>
      </Container>
    </>
  );
};

export default MyPageInfo;
