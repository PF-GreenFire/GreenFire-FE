import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
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
      <Container className="py-5" style={{ maxWidth: 420 }}>
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="text-center mb-4">
              <h2 style={{ fontSize: 24, fontWeight: 600 }}>비밀번호 재설정</h2>
              <div className="text-secondary" style={{ fontSize: 14 }}>
                {step === 1 && "가입한 이메일로 인증 코드를 발송합니다"}
                {step === 2 && "이메일로 발송된 인증 코드를 입력해주세요"}
                {step === 3 && "새 비밀번호를 설정해주세요"}
                {step === 4 && ""}
              </div>
            </div>

            {/* 프로그레스 바 */}
            <div className="d-flex gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: step >= s ? "#198754" : "#dee2e6",
                  }}
                />
              ))}
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Step 1: 이메일 입력 */}
            {step === 1 && (
              <Form onSubmit={handleSendCode}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>
                    이메일
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="가입한 이메일을 입력하세요"
                    style={{ height: 48, fontSize: 14, borderColor: "#dee2e6" }}
                    disabled={isLoading}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                  disabled={isLoading || !email}
                >
                  {isLoading ? "발송 중..." : "인증코드 발송"}
                </Button>
              </Form>
            )}

            {/* Step 2: 인증코드 입력 */}
            {step === 2 && (
              <Form onSubmit={handleVerifyCode}>
                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label
                      style={{ fontSize: 14, fontWeight: 600, marginBottom: 0 }}
                    >
                      인증 코드
                    </Form.Label>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: timeLeft <= 60 ? "#dc3545" : "#198754",
                      }}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6자리 인증 코드"
                    style={{
                      height: 48,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: 8,
                      textAlign: "center",
                      borderColor: "#dee2e6",
                      marginTop: 8,
                    }}
                    disabled={isLoading}
                    maxLength={6}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100 mb-2"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                  disabled={isLoading || code.length !== 6 || timeLeft === 0}
                >
                  {isLoading ? "확인 중..." : "확인"}
                </Button>

                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-100"
                  style={{ height: 44, fontSize: 14 }}
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  인증코드 재발송
                </Button>
              </Form>
            )}

            {/* Step 3: 새 비밀번호 설정 */}
            {step === 3 && (
              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>
                    새 비밀번호
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPw1 ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호를 입력하세요"
                      style={{
                        height: 48,
                        fontSize: 14,
                        borderColor: "#dee2e6",
                      }}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPw1((v) => !v)}
                      style={{ borderColor: "#dee2e6" }}
                      disabled={isLoading}
                    >
                      {showPw1 ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>

                  {newPassword.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {passwordChecks.map((rule) => (
                        <div
                          key={rule.key}
                          style={{
                            fontSize: 13,
                            color: rule.passed ? "#198754" : "#dc3545",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 2,
                          }}
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
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>
                    비밀번호 확인
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPw2 ? "text" : "password"}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="비밀번호를 한번 더 입력하세요"
                      style={{
                        height: 48,
                        fontSize: 14,
                        borderColor: "#dee2e6",
                      }}
                      disabled={isLoading}
                      isInvalid={passwordMismatch}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPw2((v) => !v)}
                      style={{ borderColor: "#dee2e6" }}
                      disabled={isLoading}
                    >
                      {showPw2 ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      비밀번호가 일치하지 않습니다.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                  disabled={
                    isLoading ||
                    !allPasswordRulesPassed ||
                    passwordMismatch ||
                    !passwordConfirm
                  }
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </Form>
            )}

            {/* Step 4: 변경 완료 */}
            {step === 4 && (
              <div className="text-center">
                <FaCheckCircle
                  size={64}
                  color="#198754"
                  style={{ marginBottom: 20 }}
                />
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                  비밀번호가 변경되었습니다
                </h3>
                <p
                  className="text-secondary"
                  style={{ fontSize: 14, marginBottom: 24 }}
                >
                  새 비밀번호로 로그인해주세요.
                </p>
                <Button
                  variant="success"
                  className="w-100"
                  style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                  onClick={() => setShowLoginPopup(true)}
                >
                  로그인하기
                </Button>
              </div>
            )}

            <div
              className="d-flex justify-content-center gap-3 mt-4"
              style={{ fontSize: 14 }}
            >
              <span
                style={{ cursor: "pointer", color: "#198754", fontWeight: 600 }}
                onClick={() => navigate("/")}
              >
                로그인으로 돌아가기
              </span>
              <span style={{ color: "#dee2e6" }}>|</span>
              <span
                style={{ cursor: "pointer", color: "#198754", fontWeight: 600 }}
                onClick={() => navigate("/find-email")}
              >
                아이디 찾기
              </span>
            </div>
          </Col>
        </Row>
      </Container>

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
