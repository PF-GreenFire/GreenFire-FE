import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { BsCalendar, BsCamera } from "react-icons/bs";
import PageHeader from "../../components/mypage/PageHeader";
import ProfileImageModal from "../../components/mypage/ProfileImageModal";
import PasswordChangeModal from "../../components/mypage/PasswordChangeModal";
import Loading from "../../components/common/Loading";
import useUserInfoForm from "../../hooks/useUserInfoForm";
import {
  getUserInfoAPI,
  updateUserInfoAPI,
  changePasswordAPI,
} from "../../apis/mypageAPI";
import { getImageUrl } from "../../utils/imageUtils";

const MyPageInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateInputRef = useRef(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redux 상태
  const {
    userInfo: reduxUserInfo,
    loading,
    error,
  } = useSelector((state) => state.mypageReducer);

  // 초기 로딩 여부 (데이터가 없고 로딩 중일 때)
  const isInitialLoading = loading && !reduxUserInfo?.userId;

  // Custom Hook - Redux 상태를 초기값으로 사용
  const {
    userInfo,
    maxNicknameLength,
    isDirty,
    handleInputChange,
    handleNicknameChange,
    handleProfileImageChange,
    handleBirthDateChange,
    getSaveData,
  } = useUserInfoForm(reduxUserInfo);

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    dispatch(getUserInfoAPI());
  }, [dispatch]);

  // 정보 저장 (텍스트 데이터 + 이미지 분리 전송)
  const handleSave = async () => {
    setIsSaving(true);
    const { textData, profileImage, isImageDeleted } = getSaveData();
    const result = await dispatch(updateUserInfoAPI(textData, profileImage, isImageDeleted));

    setIsSaving(false);
    if (result?.success) {
      alert("정보가 저장되었습니다.");
    } else {
      alert(result?.error || "정보 저장에 실패했습니다.");
    }
  };

  // 회원탈퇴 페이지 이동
  const handleWithdraw = () => {
    navigate("/mypage/withdrawal");
  };

  // 프로필 이미지 선택 (로컬 상태만 변경, 저장 버튼 클릭 시 서버 전송)
  const handleProfileImageSave = (image) => {
    handleProfileImageChange(image);
  };

  // 비밀번호 변경
  const handlePasswordChange = async (passwordData) => {
    const result = await dispatch(changePasswordAPI(passwordData));

    if (result?.success) {
      alert("비밀번호가 변경되었습니다.");
      setShowPasswordModal(false);
    } else {
      alert(result?.error || "비밀번호 변경에 실패했습니다.");
    }
  };

  // 초기 로딩 중
  if (isInitialLoading) {
    return <Loading message="사용자 정보 로딩 중..." />;
  }

  // 에러 발생 시
  if (error && !reduxUserInfo?.userId) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-secondary">{error}</p>
        <button
          className="mt-3 px-4 py-2 bg-green-primary text-white rounded-lg"
          onClick={() => dispatch(getUserInfoAPI())}
        >
          다시 시도
        </button>
      </Container>
    );
  }

  return (
    <>
      <PageHeader title={`${userInfo.nickname || "회원"}님의 정보`} />

      <div className="px-4 mb-[120px]">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-5">
          <div
            className="relative w-[120px] h-[120px] rounded-full border-[3px] border-green-primary overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer group"
            onClick={() => setShowProfileModal(true)}
          >
            {userInfo.profileImage ? (
              <img
                src={getImageUrl(userInfo.profileImage)}
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
                onChange={(e) => handleNicknameChange(e.target.value)}
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
                {userInfo.birth}
              </span>
              <BsCalendar className="text-lg text-gray-800" />
              <input
                ref={dateInputRef}
                type="date"
                value={userInfo.birth?.replace(/\./g, "-") || ""}
                onChange={(e) => handleBirthDateChange(e.target.value)}
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
            className={`w-full py-3.5 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 focus:outline-none ${
              isDirty
                ? "bg-green-primary text-white border-transparent hover:!bg-green-dark"
                : "bg-white text-gray-600 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent"
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "변경정보 저장"}
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
