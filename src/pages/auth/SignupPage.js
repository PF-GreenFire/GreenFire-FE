import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
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
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 약관 동의 상태
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

  // 이메일 중복 체크 상태
  const [emailStatus, setEmailStatus] = useState(null); // null | "checking" | "available" | "taken" | "error"
  const debounceRef = useRef(null);

  const passwordMismatch = useMemo(() => {
    return (
      formData.passwordConfirm.length > 0 &&
      formData.password !== formData.passwordConfirm
    );
  }, [formData.password, formData.passwordConfirm]);

  // 비밀번호 강도 검증
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

  // 이메일 중복 체크 (debounce)
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
    isLoading || passwordMismatch || !allPasswordRulesPassed || emailStatus === "taken" || !requiredAgreed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password);
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

    const styles = { fontSize: 13, marginTop: 4 };

    if (emailStatus === "checking") {
      return <div style={{ ...styles, color: "#6c757d" }}>확인 중...</div>;
    }
    if (emailStatus === "available") {
      return (
        <div style={{ ...styles, color: "#198754" }}>
          <FaCheck size={12} /> 사용 가능한 이메일입니다.
        </div>
      );
    }
    if (emailStatus === "taken") {
      return (
        <div style={{ ...styles, color: "#dc3545" }}>
          <FaTimes size={12} /> 이미 사용 중인 이메일입니다.
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Container className="py-5" style={{ maxWidth: 420 }}>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="mb-3">
              <h2 style={{ fontSize: 24, fontWeight: 600 }}>회원가입</h2>
              <div className="text-secondary" style={{ fontSize: 14 }}>
                가입 후 바로 로그인할 수 있어요
              </div>
            </div>

            <img
              src="/logo.svg"
              alt="Green Fire Logo"
              style={{ width: 140, marginBottom: "2rem" }}
            />

            <Form onSubmit={handleSubmit} className="text-start">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>이메일</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="이메일을 입력하세요"
                  style={{ height: 48, fontSize: 14, borderColor: "#dee2e6" }}
                  disabled={isLoading}
                  required
                />
                {renderEmailFeedback()}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>비밀번호</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPw1 ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    style={{ height: 48, fontSize: 14, borderColor: "#dee2e6" }}
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

                {formData.password.length > 0 && (
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
                        {rule.passed ? <FaCheck size={11} /> : <FaTimes size={11} />}
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
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호를 한번 더 입력하세요"
                    style={{ height: 48, fontSize: 14, borderColor: "#dee2e6" }}
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

              {/* 약관 동의 */}
              <div
                className="mb-4"
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: 8,
                  padding: "16px",
                }}
              >
                <Form.Check
                  type="checkbox"
                  id="agree-all"
                  label={
                    <span style={{ fontWeight: 700, fontSize: 14 }}>
                      전체 동의합니다
                    </span>
                  }
                  checked={agreements.service && agreements.privacy && agreements.marketing}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                  className="mb-2"
                />
                <hr style={{ margin: "8px 0 12px" }} />

                {Object.entries(TERMS).map(([key, term]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <Form.Check
                        type="checkbox"
                        id={`agree-${key}`}
                        label={
                          <span style={{ fontSize: 13, color: term.required ? "#212529" : "#6c757d" }}>
                            {term.label}
                          </span>
                        }
                        checked={agreements[key]}
                        onChange={(e) => handleAgreementChange(key, e.target.checked)}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6c757d",
                          cursor: "pointer",
                          textDecoration: "underline",
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}
                        onClick={() => setExpandedTerm(expandedTerm === key ? null : key)}
                      >
                        {expandedTerm === key ? "접기" : "보기"}
                      </span>
                    </div>
                    {expandedTerm === key && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "10px 12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: 6,
                          fontSize: 12,
                          color: "#495057",
                          maxHeight: 160,
                          overflowY: "auto",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                        }}
                      >
                        {term.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                variant="success"
                className="w-100"
                style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                disabled={isSubmitDisabled}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>

              <div className="text-center mt-3" style={{ fontSize: 14 }}>
                <span
                  style={{ cursor: "pointer", color: "#198754", fontWeight: 700 }}
                  onClick={() => navigate("/")}
                >
                  메인으로 돌아가기
                </span>
              </div>
            </Form>
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
        initialEmail={formData.email}
      />
    </>
  );
};

export default SignupPage;
