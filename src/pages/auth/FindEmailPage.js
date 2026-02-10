import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { findEmail } from "../../apis/authAPI";

const FindEmailPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null); // { exists, maskedEmail }
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const data = await findEmail(email);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "확인 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 420 }}>
      <Row className="justify-content-center">
        <Col xs={12} className="text-center">
          <div className="mb-4">
            <h2 style={{ fontSize: 24, fontWeight: 600 }}>아이디 찾기</h2>
            <div className="text-secondary" style={{ fontSize: 14 }}>
              가입한 이메일 주소를 입력해주세요
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="text-start">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: 14, fontWeight: 600 }}>
                이메일
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
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
              {isLoading ? "확인 중..." : "확인"}
            </Button>
          </Form>

          {result && (
            <div
              className="mt-4"
              style={{
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: 8,
                border: "1px solid #dee2e6",
              }}
            >
              {result.exists ? (
                <div className="text-center">
                  <FaCheckCircle
                    size={40}
                    color="#198754"
                    style={{ marginBottom: 12 }}
                  />
                  <div
                    style={{ fontSize: 14, color: "#198754", fontWeight: 600 }}
                  >
                    가입된 계정입니다
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginTop: 8,
                      color: "#212529",
                    }}
                  >
                    {result.maskedEmail}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FaTimesCircle
                    size={40}
                    color="#dc3545"
                    style={{ marginBottom: 12 }}
                  />
                  <div style={{ fontSize: 14, color: "#dc3545", fontWeight: 600 }}>
                    가입되지 않은 이메일입니다.
                  </div>
                </div>
              )}
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
              onClick={() => navigate("/reset-password")}
            >
              비밀번호 찾기
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FindEmailPage;
