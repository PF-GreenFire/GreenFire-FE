import { useState, useCallback, useEffect } from "react";

/**
 * 사용자 정보 폼 상태와 로직을 관리하는 Custom Hook
 * @param {Object} initialData - Redux에서 가져온 초기 사용자 정보
 */
const useUserInfoForm = (initialData = null) => {
  const defaultUserInfo = {
    nickname: "",
    userId: "",
    name: "",
    email: "",
    password: "",
    birth: "",
    phone: "",
    profileImage: null,
  };

  const [userInfo, setUserInfo] = useState(initialData || defaultUserInfo);
  const [isDirty, setIsDirty] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const maxNicknameLength = 10;

  // Redux 상태가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (initialData) {
      setUserInfo({
        ...defaultUserInfo,
        ...initialData,
        password: "",
      });
      setIsDirty(false);
      setIsImageChanged(false);
    }
  }, [initialData]);

  /**
   * 특정 필드 값 변경
   */
  const handleInputChange = useCallback((field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  }, []);

  /**
   * 닉네임 변경 (글자 수 제한 적용)
   */
  const handleNicknameChange = useCallback((value) => {
    if (value.length <= maxNicknameLength) {
      setUserInfo((prev) => ({
        ...prev,
        nickname: value,
      }));
      setIsDirty(true);
    }
  }, []);

  /**
   * 프로필 이미지 변경
   */
  const handleProfileImageChange = useCallback((image) => {
    setUserInfo((prev) => ({
      ...prev,
      profileImage: image,
    }));
    setIsImageChanged(true);
    setIsDirty(true);
  }, []);

  /**
   * 생년월일 변경 (YYYY-MM-DD -> YYYY.MM.DD 포맷 변환)
   */
  const handleBirthDateChange = useCallback((dateValue) => {
    const formatted = dateValue.replace(/-/g, ".");
    setUserInfo((prev) => ({
      ...prev,
      birth: formatted,
    }));
    setIsDirty(true);
  }, []);

  /**
   * 저장용 데이터 반환 (API 전송용)
   * @returns {{ textData: Object, profileImage: string|null }}
   */
  const getSaveData = useCallback(() => {
    const { password, profileImage, ...textData } = userInfo;
    return {
      textData,      // JSON으로 보낼 텍스트 데이터
      profileImage: isImageChanged ? profileImage : null,  // 변경된 경우에만 이미지 전송
      isImageDeleted: isImageChanged && !profileImage,     // 이미지 삭제 여부
    };
  }, [userInfo, isImageChanged]);

  /**
   * 폼 초기화 (Redux 상태로 리셋)
   */
  const resetForm = useCallback(() => {
    if (initialData) {
      setUserInfo({
        ...defaultUserInfo,
        ...initialData,
        password: "******************",
      });
    }
    setIsDirty(false);
    setIsImageChanged(false);
  }, [initialData]);

  return {
    // 상태
    userInfo,
    maxNicknameLength,
    isDirty,

    // 핸들러
    handleInputChange,
    handleNicknameChange,
    handleProfileImageChange,
    handleBirthDateChange,
    getSaveData,
    resetForm,
  };
};

export default useUserInfoForm;
