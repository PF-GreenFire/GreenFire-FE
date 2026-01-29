import React, { useMemo, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signup } from "../../apis/authAPI";
import LoginPopup from "./LoginPopup";

const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "회원가입에 실패했습니다."
  );
};

const SignupPage = () => {
  const navigate = useNavigate();

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

  const passwordMismatch = useMemo(() => {
    return (
      formData.passwordConfirm.length > 0 &&
      formData.password !== formData.passwordConfirm
    );
  }, [formData.password, formData.passwordConfirm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.email) return "이메일을 입력하세요.";
    if (!formData.password) return "비밀번호를 입력하세요.";
    if (!formData.passwordConfirm) return "비밀번호 확인을 입력하세요.";
    if (formData.password !== formData.passwordConfirm)
      return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    setIsLoading(true);
    try {
      await signup(formData.email, formData.password);

      // ✅ 가입 성공 → 로그인 팝업 띄우기
      setShowLoginPopup(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className="py-5" style={{ maxWidth: 420 }}>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="mb-3">
              <h2 style={{ fontSize: 24, fontWeight: 600 }}>회원가입</h2>
              <div className="text-secondary" style={{ fontSize: 14 }}>
                가입 후 바로 로그인할 수 있어요 🙂
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
                  placeholder="이메일을 입력하세요"
                  style={{ height: 48, fontSize: 14, borderColor: "#dee2e6" }}
                  disabled={isLoading}
                  required
                />
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

              <Button
                type="submit"
                variant="success"
                className="w-100"
                style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                disabled={isLoading || passwordMismatch}
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

      {/* ✅ 가입 성공 후 로그인 팝업 */}
      <LoginPopup
        show={showLoginPopup}
        onHide={() => {
          setShowLoginPopup(false);
          navigate("/"); // 팝업 닫으면 메인으로
        }}
        initialEmail={formData.email}
      />
    </>
  );
};

export default SignupPage;
