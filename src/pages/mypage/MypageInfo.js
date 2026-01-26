import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { BsCalendar } from "react-icons/bs";
import PageHeader from "../../components/mypage/PageHeader";
import "./MypageInfo.css";

const MyPageInfo = () => {
  // 임시 사용자 데이터
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
    // TODO: API 호출하여 정보 저장
  };

  const handleWithdraw = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      console.log("회원탈퇴 처리");
      // TODO: 회원탈퇴 API 호출
    }
  };

  return (
    <>
      <PageHeader title={`${userInfo.nickname}님의 정보`} />

      <Container className="mypage-info-container">
        {/* 프로필 이미지 */}
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            {userInfo.profileImage ? (
              <img
                src={userInfo.profileImage}
                alt="프로필"
                className="profile-image"
              />
            ) : (
              <img
                src="/default_profile.png"
                alt="기본 프로필"
                className="profile-image"
              />
            )}
          </div>
        </div>

        {/* 닉네임 및 ID */}
        <div className="nickname-section">
          <div className="nickname-input-wrapper">
            <input
              type="text"
              value={userInfo.nickname}
              onChange={handleNicknameChange}
              className="nickname-input"
            />
            <span className="nickname-count">
              {userInfo.nickname.length}/{maxNicknameLength}
            </span>
          </div>
          <p className="user-id">ID: {userInfo.userId}</p>
        </div>

        {/* 기본 정보 */}
        <div className="basic-info-section">
          <h2 className="section-title">기본 정보</h2>

          <div className="info-field">
            <label className="field-label">이름</label>
            <Form.Control
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="field-input"
            />
          </div>

          <div className="info-field">
            <label className="field-label">이메일</label>
            <Form.Control
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="field-input"
            />
          </div>

          <div className="info-field">
            <label className="field-label">비밀번호</label>
            <Form.Control
              type="password"
              value={userInfo.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="field-input"
            />
          </div>

          <div className="info-field">
            <label className="field-label">생년월일</label>
            <div className="date-input-wrapper">
              <span className="date-display">{userInfo.birthDate}</span>
              <BsCalendar className="calendar-icon" />
              <input
                type="date"
                value={userInfo.birthDate.replace(/\./g, "-")}
                onChange={(e) => {
                  const formatted = e.target.value.replace(/-/g, ".");
                  handleInputChange("birthDate", formatted);
                }}
                className="date-input-hidden"
              />
            </div>
          </div>

          <div className="info-field">
            <label className="field-label">휴대폰 번호</label>
            <Form.Control
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="button-section">
          <Button className="save-button" onClick={handleSave}>
            변경정보 저장
          </Button>
          <Button className="withdraw-button" onClick={handleWithdraw}>
            회원탈퇴
          </Button>
        </div>
      </Container>
    </>
  );
};

export default MyPageInfo;
