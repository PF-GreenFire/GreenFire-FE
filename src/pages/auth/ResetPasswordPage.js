import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword,
} from "../../apis/authAPI";
import LoginPopup from "./LoginPopup";
import { useAuth } from "../../hooks/useAuth";

const PASSWORD_RULES = [
  { key: "length", label: "8자 이상", test: (pw) => pw.length >= 8 },
  { key: "upper", label: "대문자 1개 이상", test: (pw) => /[A-Z]/.test(pw) },
  { key: "lower", label: "소문자 1개 이상", test: (pw) => /[a-z]/.test(pw) },
  { key: "digit", label: "숫자 1개 이상", test: (pw) => /[0-9]/.test(pw) },
  { key: "special", label: "특수문자 1개 이상", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { onLoginSuccess } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // 5분 타이머
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, []);

  // 비밀번호 검증
  const passwordChecks = useMemo(() => {
    return PASSWORD_RULES.map((rule) => ({
      ...rule,
      passed: rule.test(newPassword),
    }));
  }, [newPassword]);

  const allPasswordRulesPassed = useMemo(() => {
    return newPassword.length > 0 && passwordChecks.every((r) => r.passed);
  }, [newPassword, passwordChecks]);

  const passwordMismatch = useMemo(() => {
    return passwordConfirm.length > 0 && newPassword !== passwordConfirm;
  }, [newPassword, passwordConfirm]);

  // Step 1: 인증코드 발송
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendPasswordResetCode(email);
      setStep(2);
      setTimeLeft(300); // 5분
    } catch (err) {
      const msg =
        err?.response?.data?.message || "인증 코드 발송에 실패했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: 코드 검증
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyPasswordResetCode(email, code);
      setStep(3);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "인증 코드 확인에 실패했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 코드 재발송
  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);
    setCode("");

    try {
      await sendPasswordResetCode(email);
      setTimeLeft(300);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "인증 코드 재발송에 실패했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: 비밀번호 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!allPasswordRulesPassed) {
      setError("비밀번호가 보안 요구사항을 충족하지 않습니다.");
      return;
    }
    if (newPassword !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setStep(4);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[420px] mx-auto px-4 py-10">
        <div>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">비밀번호 재설정</h2>
            <div className="text-gray-500 text-sm">
              {step === 1 && "가입한 이메일로 인증 코드를 발송합니다"}
              {step === 2 && "이메일로 발송된 인증 코드를 입력해주세요"}
              {step === 3 && "새 비밀번호를 설정해주세요"}
              {step === 4 && ""}
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-sm ${
                  step >= s ? "bg-admin-green" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {error && (
            <div
              className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-3"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Step 1: 이메일 입력 */}
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="가입한 이메일을 입력하세요"
                  className="w-full h-12 text-sm border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl hover:bg-admin-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !email}
              >
                {isLoading ? "발송 중..." : "인증코드 발송"}
              </button>
            </form>
          )}

          {/* Step 2: 인증코드 입력 */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">
                    인증 코드
                  </label>
                  <span
                    className={`text-sm font-semibold ${
                      timeLeft <= 60 ? "text-danger" : "text-admin-green"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6자리 인증 코드"
                  className="w-full h-12 text-xl font-bold tracking-[8px] text-center border border-gray-300 rounded-xl px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                  disabled={isLoading}
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl mb-2 hover:bg-admin-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || code.length !== 6 || timeLeft === 0}
              >
                {isLoading ? "확인 중..." : "확인"}
              </button>

              <button
                type="button"
                className="w-full h-11 text-sm border border-gray-400 text-gray-600 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                인증코드 재발송
              </button>
            </form>
          )}

          {/* Step 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">
                  새 비밀번호
                </label>
                <div className="flex">
                  <input
                    type={showPw1 ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력하세요"
                    className="w-full h-12 text-sm border border-gray-300 rounded-l-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw1((v) => !v)}
                    className="h-12 px-3 border border-l-0 border-gray-300 rounded-r-xl text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPw1 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="mt-2">
                    {passwordChecks.map((rule) => (
                      <div
                        key={rule.key}
                        className={`text-[13px] flex items-center gap-1 mb-0.5 ${
                          rule.passed ? "text-admin-green" : "text-danger"
                        }`}
                      >
                        {rule.passed ? (
                          <FaCheck size={11} />
                        ) : (
                          <FaTimes size={11} />
                        )}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  비밀번호 확인
                </label>
                <div className="flex">
                  <input
                    type={showPw2 ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 한번 더 입력하세요"
                    className={`w-full h-12 text-sm border rounded-l-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green ${
                      passwordMismatch
                        ? "border-danger"
                        : "border-gray-300"
                    }`}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw2((v) => !v)}
                    className={`h-12 px-3 border border-l-0 rounded-r-xl text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50 ${
                      passwordMismatch
                        ? "border-danger"
                        : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    {showPw2 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordMismatch && (
                  <div className="text-danger text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl hover:bg-admin-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  isLoading ||
                  !allPasswordRulesPassed ||
                  passwordMismatch ||
                  !passwordConfirm
                }
              >
                {isLoading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          )}

          {/* Step 4: 변경 완료 */}
          {step === 4 && (
            <div className="text-center">
              <FaCheckCircle
                size={64}
                className="text-admin-green mb-5 mx-auto"
              />
              <h3 className="text-xl font-bold mb-2">
                비밀번호가 변경되었습니다
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                새 비밀번호로 로그인해주세요.
              </p>
              <button
                className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl hover:bg-admin-green-dark transition-all"
                onClick={() => setShowLoginPopup(true)}
              >
                로그인하기
              </button>
            </div>
          )}

          <div className="flex justify-center gap-3 mt-4 text-sm">
            <span
              className="cursor-pointer text-admin-green font-semibold hover:underline"
              onClick={() => navigate("/")}
            >
              로그인으로 돌아가기
            </span>
            <span className="text-gray-300">|</span>
            <span
              className="cursor-pointer text-admin-green font-semibold hover:underline"
              onClick={() => navigate("/find-email")}
            >
              아이디 찾기
            </span>
          </div>
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
        initialEmail={email}
      />
    </>
  );
};

export default ResetPasswordPage;
