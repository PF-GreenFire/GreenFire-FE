import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaCamera } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { signup, checkEmailAvailable } from "../../apis/authAPI";
import LoginPopup from "./LoginPopup";
import { useAuth } from "../../hooks/useAuth";

const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "회원가입에 실패했습니다."
  );
};

const TERMS = {
  service: {
    label: "[필수] 서비스 이용약관 동의",
    required: true,
    content: `제1조 (목적)
본 약관은 GreenFire(이하 "서비스")가 제공하는 환경 보호 관련 커뮤니티 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "회원"이란 본 약관에 동의하고 서비스에 가입한 자를 말합니다.
2. "콘텐츠"란 회원이 서비스 내에서 작성한 게시글, 댓글, 이미지 등을 말합니다.
3. "챌린지"란 서비스에서 제공하는 환경 보호 실천 활동을 말합니다.

제3조 (약관의 효력)
본 약관은 회원가입 시 동의함으로써 효력이 발생하며, 회원 탈퇴 시까지 적용됩니다.

제4조 (회원의 의무)
1. 회원은 타인의 권리를 침해하거나 공서양속에 반하는 행위를 하여서는 안 됩니다.
2. 회원은 허위 정보를 등록하거나 타인의 정보를 도용하여서는 안 됩니다.
3. 서비스의 안정적 운영을 방해하는 행위를 하여서는 안 됩니다.

제5조 (서비스 제공 및 변경)
1. 서비스는 회원에게 커뮤니티 활동, 챌린지 참여, 게시글 작성 등의 기능을 제공합니다.
2. 서비스는 운영상 필요한 경우 서비스의 내용을 변경할 수 있으며, 변경 시 사전 공지합니다.

제6조 (게시물 관리)
1. 회원이 작성한 게시물의 저작권은 해당 회원에게 있습니다.
2. 서비스는 관련 법령에 위반되거나 신고가 접수된 게시물을 삭제하거나 비공개 처리할 수 있습니다.

제7조 (회원 탈퇴 및 자격 제한)
1. 회원은 언제든지 서비스에 탈퇴를 요청할 수 있습니다.
2. 탈퇴 후 30일간 동일 이메일로 재가입할 수 없습니다.
3. 탈퇴 시 회원의 개인정보 및 활동 기록은 관련 법령에 따라 처리됩니다.

제8조 (면책 조항)
1. 서비스는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.
2. 회원 간 분쟁에 대해 서비스는 개입할 의무를 지지 않습니다.`,
  },
  privacy: {
    label: "[필수] 개인정보 수집 및 이용 동의",
    required: true,
    content: `1. 수집하는 개인정보 항목
- 필수: 이메일 주소, 비밀번호(암호화 저장)
- 자동 수집: 서비스 이용 기록, 접속 IP 주소, 접속 일시

2. 개인정보의 수집 및 이용 목적
- 회원 식별 및 본인 인증
- 서비스 제공 및 운영 (게시글, 댓글, 챌린지 참여 등)
- 서비스 개선을 위한 통계 분석
- 부정 이용 방지 및 서비스 안정성 확보
- 고객 문의 및 불만 처리

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 보유하며, 탈퇴 후 30일간 재가입 방지 목적으로 이메일 정보를 보관한 뒤 즉시 파기합니다.
- 관련 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
  · 전자상거래 등에서의 소비자 보호에 관한 법률: 계약 또는 청약 철회 기록 5년
  · 통신비밀보호법: 접속 로그 기록 3개월

4. 개인정보의 파기 절차 및 방법
- 전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제
- 보유 기간 경과 시 지체 없이 파기

5. 이용자의 권리
- 회원은 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.
- 회원은 개인정보 수집 및 이용에 대한 동의를 철회(회원 탈퇴)할 수 있습니다.

6. 개인정보 보호 책임자
- 서비스 운영팀 (greenfire@example.com)

※ 개인정보 수집 및 이용에 동의하지 않을 권리가 있으나, 동의하지 않을 경우 회원가입이 제한됩니다.`,
  },
  marketing: {
    label: "[선택] 마케팅 정보 수신 동의",
    required: false,
    content: `GreenFire에서 제공하는 다양한 환경 보호 캠페인, 챌린지 소식, 이벤트 정보 등을 이메일로 받아보실 수 있습니다.

수신 동의 항목:
- 신규 챌린지 및 캠페인 안내
- 환경 관련 뉴스 및 정보
- 서비스 업데이트 및 이벤트 소식

※ 마케팅 정보 수신에 동의하지 않아도 서비스 이용에는 제한이 없습니다.
※ 수신 동의 후에도 마이페이지에서 언제든지 수신 거부할 수 있습니다.`,
  },
};

const PASSWORD_RULES = [
  { key: "length", label: "8자 이상", test: (pw) => pw.length >= 8 },
  { key: "upper", label: "대문자 1개 이상", test: (pw) => /[A-Z]/.test(pw) },
  { key: "lower", label: "소문자 1개 이상", test: (pw) => /[a-z]/.test(pw) },
  { key: "digit", label: "숫자 1개 이상", test: (pw) => /[0-9]/.test(pw) },
  { key: "special", label: "특수문자 1개 이상", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { onLoginSuccess } = useAuth();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    birth: "",
    gender: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });
  const [expandedTerm, setExpandedTerm] = useState(null);

  const requiredAgreed = agreements.service && agreements.privacy;

  const handleAllAgree = (checked) => {
    setAgreements({ service: checked, privacy: checked, marketing: checked });
  };

  const handleAgreementChange = (key, checked) => {
    setAgreements((prev) => ({ ...prev, [key]: checked }));
  };

  const [emailStatus, setEmailStatus] = useState(null);
  const debounceRef = useRef(null);

  const passwordMismatch = useMemo(() => {
    return (
      formData.passwordConfirm.length > 0 &&
      formData.password !== formData.passwordConfirm
    );
  }, [formData.password, formData.passwordConfirm]);

  const passwordChecks = useMemo(() => {
    return PASSWORD_RULES.map((rule) => ({
      ...rule,
      passed: rule.test(formData.password),
    }));
  }, [formData.password]);

  const allPasswordRulesPassed = useMemo(() => {
    return formData.password.length > 0 && passwordChecks.every((r) => r.passed);
  }, [formData.password, passwordChecks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailStatus(null);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("프로필 이미지는 5MB 이하만 가능합니다.");
      return;
    }
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const checkEmail = useCallback(async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus(null);
      return;
    }
    setEmailStatus("checking");
    try {
      const result = await checkEmailAvailable(email);
      setEmailStatus(result.available ? "available" : "taken");
    } catch {
      setEmailStatus("error");
    }
  }, []);

  const handleEmailBlur = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      checkEmail(formData.email);
    }, 300);
  }, [formData.email, checkEmail]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const validate = () => {
    if (!requiredAgreed) return "필수 약관에 동의해주세요.";
    if (!formData.name) return "이름을 입력하세요.";
    if (!formData.nickname) return "닉네임을 입력하세요.";
    if (!formData.email) return "이메일을 입력하세요.";
    if (!formData.password) return "비밀번호를 입력하세요.";
    if (!allPasswordRulesPassed) return "비밀번호가 보안 요구사항을 충족하지 않습니다.";
    if (!formData.passwordConfirm) return "비밀번호 확인을 입력하세요.";
    if (formData.password !== formData.passwordConfirm)
      return "비밀번호가 일치하지 않습니다.";
    if (emailStatus === "taken") return "이미 사용 중인 이메일입니다.";
    return "";
  };

  const isSubmitDisabled =
    isLoading || passwordMismatch || !allPasswordRulesPassed || emailStatus === "taken" || !requiredAgreed || !formData.name || !formData.nickname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    setIsLoading(true);
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname,
        birth: formData.birth || null,
        gender: formData.gender || null,
        phone: formData.phone ? formData.phone.replace(/-/g, "") : null,
        profileImage: profileImage,
      });
      setShowLoginPopup(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailFeedback = () => {
    if (!emailStatus || emailStatus === "error") return null;
    if (emailStatus === "checking") {
      return <div className="text-xs text-gray-500 mt-1">확인 중...</div>;
    }
    if (emailStatus === "available") {
      return (
        <div className="text-xs mt-1 flex items-center gap-1 text-admin-green-dark">
          <FaCheck size={10} /> 사용 가능한 이메일입니다.
        </div>
      );
    }
    if (emailStatus === "taken") {
      return (
        <div className="text-xs mt-1 flex items-center gap-1 text-red-600">
          <FaTimes size={10} /> 이미 사용 중인 이메일입니다.
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-[563px] mx-auto px-[15px]">

          {/* 헤더 */}
          <div className="flex items-center relative py-4">
            <button
              className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center text-gray-800 absolute left-0 hover:text-green-primary"
              onClick={() => navigate(-1)}
              type="button"
            >
              <IoIosArrowBack size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 m-0 w-full text-center">
              회원가입
            </h1>
          </div>

          <p className="text-center text-sm text-gray-400 m-0 mb-6">
            가입 후 바로 로그인할 수 있어요
          </p>

          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-5">
            <div
              className="relative w-[120px] h-[120px] rounded-full border-[3px] border-green-primary overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer group"
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="프로필 미리보기"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaCamera size={32} className="text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:!opacity-100 transition-opacity duration-300">
                <FaCamera size={28} className="text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleProfileImageChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {profilePreview && (
            <div className="flex justify-center mb-5">
              <button
                type="button"
                onClick={removeProfileImage}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-400 cursor-pointer transition-all duration-300 hover:!bg-red-100 hover:!text-red-600 hover:!border-transparent focus:outline-none"
              >
                이미지 삭제
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 m-0 mb-8">
            JPG, PNG, GIF, WebP (최대 5MB)
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 py-3 px-4 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            {/* 기본 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">기본 정보</h2>

              <div className="flex items-center mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium">
                  이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  disabled={isLoading}
                  required
                  className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary"
                />
              </div>

              <div className="flex items-center mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium">
                  닉네임 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="닉네임을 입력하세요"
                  disabled={isLoading}
                  required
                  className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary"
                />
              </div>

              <div className="flex items-center mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium">
                  생년월일
                </label>
                <div
                  className="flex-1 relative flex items-center py-3 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer"
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <span className={`flex-1 text-sm ${formData.birth ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formData.birth || '선택하세요'}
                  </span>
                  <BsCalendar className="text-lg text-gray-800" />
                  <input
                    ref={dateInputRef}
                    type="date"
                    name="birth"
                    value={formData.birth}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex items-center mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium">
                  성별
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-primary appearance-none cursor-pointer"
                >
                  <option value="">선택하세요</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>

              <div className="flex items-center mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="010-1234-5678"
                  maxLength={13}
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary"
                />
              </div>
            </div>

            {/* 계정 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">계정 정보</h2>

              {/* 이메일 */}
              <div className="flex items-start mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium pt-3">
                  이메일 <span className="text-red-600">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    placeholder="이메일을 입력하세요"
                    disabled={isLoading}
                    required
                    className="w-full border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary"
                  />
                  {renderEmailFeedback()}
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="flex items-start mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium pt-3">
                  비밀번호 <span className="text-red-600">*</span>
                </label>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type={showPw1 ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호를 입력하세요"
                      disabled={isLoading}
                      required
                      className="flex-1 border border-green-primary rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw1((v) => !v)}
                      disabled={isLoading}
                      className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 cursor-pointer transition-all duration-300 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent focus:outline-none"
                    >
                      {showPw1 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formData.password.length > 0 && (
                    <div className="mt-2">
                      {passwordChecks.map((rule) => (
                        <div
                          key={rule.key}
                          className={`flex items-center gap-1 mb-0.5 text-xs ${rule.passed ? 'text-admin-green-dark' : 'text-red-600'}`}
                        >
                          {rule.passed ? <FaCheck size={10} /> : <FaTimes size={10} />}
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex items-start mb-4">
                <label className="w-[100px] flex-shrink-0 text-sm text-gray-800 font-medium pt-3">
                  비밀번호 확인 <span className="text-red-600">*</span>
                </label>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type={showPw2 ? "text" : "password"}
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      placeholder="비밀번호를 한번 더 입력하세요"
                      disabled={isLoading}
                      required
                      className={`flex-1 border rounded-lg py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-primary ${
                        passwordMismatch ? 'border-red-600' : 'border-green-primary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw2((v) => !v)}
                      disabled={isLoading}
                      className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 cursor-pointer transition-all duration-300 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent focus:outline-none"
                    >
                      {showPw2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <div className="mt-1 text-xs text-red-600">
                      비밀번호가 일치하지 않습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">약관 동의</h2>
              <div className="rounded-xl border border-gray-200 p-4">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={agreements.service && agreements.privacy && agreements.marketing}
                    onChange={(e) => handleAllAgree(e.target.checked)}
                    className="w-[18px] h-[18px] cursor-pointer accent-green-primary"
                  />
                  <span className="text-sm font-bold text-gray-800">전체 동의합니다</span>
                </label>
                <hr className="my-3 border-gray-200" />

                {Object.entries(TERMS).map(([key, term]) => (
                  <div key={key} className="mb-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreements[key]}
                          onChange={(e) => handleAgreementChange(key, e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-green-primary"
                        />
                        <span className={`text-xs ${term.required ? 'text-gray-800' : 'text-gray-500'}`}>
                          {term.label}
                        </span>
                      </label>
                      <span
                        className="text-xs text-gray-400 cursor-pointer underline ml-2 whitespace-nowrap"
                        onClick={() => setExpandedTerm(expandedTerm === key ? null : key)}
                      >
                        {expandedTerm === key ? "접기" : "보기"}
                      </span>
                    </div>
                    {expandedTerm === key && (
                      <div className="mt-2 rounded-lg whitespace-pre-wrap py-2.5 px-3 bg-gray-50 text-xs text-gray-600 max-h-40 overflow-y-auto leading-relaxed">
                        {term.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col gap-3 mb-[60px]">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-3.5 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 focus:outline-none ${
                  isSubmitDisabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 !cursor-not-allowed'
                    : 'bg-green-primary text-white border-transparent hover:bg-green-dark'
                }`}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all duration-300 hover:!bg-green-badge hover:!text-green-dark hover:!border-transparent focus:outline-none"
              >
                메인으로 돌아가기
              </button>
            </div>
          </form>
        </div>
      </div>

      <LoginPopup
        show={showLoginPopup}
        onHide={() => {
          setShowLoginPopup(false);
          navigate("/");
        }}
        onLoginSuccess={() => {
          setShowLoginPopup(false);
          onLoginSuccess();
          navigate("/");
        }}
        initialEmail={formData.email}
      />
    </>
  );
};

export default SignupPage;
