import React, { useState, useRef, useCallback } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../apis/authAPI";
import { useAuth } from "../../hooks/useAuth";

const TERMS = [
  "모든 개인정보 및 활동 기록이 삭제됩니다.",
  "탈퇴 후 30일간 동일 이메일로 재가입할 수 없습니다.",
  "진행 중인 챌린지 참여가 취소됩니다.",
];

const REASONS = [
  "서비스 불만족",
  "사용 빈도 낮음",
  "개인정보 우려",
  "다른 서비스 이용",
  "기타",
];

const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "회원 탈퇴에 실패했습니다."
  );
};

const DeleteAccountPage = () => {
  const navigate = useNavigate();
  const { onLogout } = useAuth();

  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState([false, false, false]);
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const termsBoxRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const el = termsBoxRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    if (atBottom) setScrolledToBottom(true);
  }, []);

  const allAgreed = agreed.every(Boolean);

  const handleToggleAgreed = (index) => {
    setAgreed((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount(password, reason);
      await onLogout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete account error:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 500 }}>
      <Row className="justify-content-center">
        <Col xs={12}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            회원 탈퇴
          </h2>
          <div className="text-secondary mb-4" style={{ fontSize: 14 }}>
            탈퇴 전 아래 내용을 반드시 확인해 주세요.
          </div>

          {/* 진행 표시 */}
          <div className="d-flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: step >= s ? "#dc3545" : "#dee2e6",
                }}
              />
            ))}
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Step 1: 약관 확인 */}
          {step === 1 && (
            <div>
              <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                1단계: 주의사항 확인
              </h5>

              <div
                ref={termsBoxRef}
                onScroll={handleScroll}
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: 8,
                  padding: 16,
                  maxHeight: 200,
                  overflowY: "auto",
                  marginBottom: 16,
                  fontSize: 14,
                  lineHeight: 1.8,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <p style={{ fontWeight: 600 }}>회원 탈퇴 시 주의사항</p>
                <p>
                  회원 탈퇴를 진행하시면 계정에 저장된 모든 정보가 삭제되며,
                  이 작업은 되돌릴 수 없습니다.
                </p>
                <ul>
                  <li>작성한 게시글, 댓글, 챌린지 기록이 모두 삭제됩니다.</li>
                  <li>탈퇴 후 30일간 동일 이메일로 재가입이 제한됩니다.</li>
                  <li>진행 중인 챌린지에 참여가 자동으로 취소됩니다.</li>
                  <li>삭제된 데이터는 복구할 수 없습니다.</li>
                </ul>
                <p>
                  위 내용을 충분히 확인하신 후, 아래 체크박스에 동의해 주세요.
                </p>
              </div>

              {!scrolledToBottom && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#6c757d",
                    marginBottom: 12,
                  }}
                >
                  주의사항을 끝까지 읽어주세요.
                </div>
              )}

              {TERMS.map((term, i) => (
                <Form.Check
                  key={i}
                  type="checkbox"
                  id={`term-${i}`}
                  label={term}
                  checked={agreed[i]}
                  onChange={() => handleToggleAgreed(i)}
                  disabled={!scrolledToBottom}
                  style={{ fontSize: 14, marginBottom: 8 }}
                />
              ))}

              <Button
                variant="outline-danger"
                className="w-100 mt-3"
                style={{ height: 44, fontWeight: 600 }}
                disabled={!allAgreed}
                onClick={() => setStep(2)}
              >
                다음
              </Button>
            </div>
          )}

          {/* Step 2: 탈퇴 사유 */}
          {step === 2 && (
            <div>
              <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                2단계: 탈퇴 사유 선택
              </h5>
              <p style={{ fontSize: 14, color: "#6c757d", marginBottom: 16 }}>
                서비스 개선을 위해 탈퇴 사유를 선택해 주세요.
              </p>

              <Form.Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ height: 44, fontSize: 14, marginBottom: 16 }}
              >
                <option value="">탈퇴 사유를 선택해 주세요</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Select>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="flex-fill"
                  style={{ height: 44, fontWeight: 600 }}
                  onClick={() => setStep(1)}
                >
                  이전
                </Button>
                <Button
                  variant="outline-danger"
                  className="flex-fill"
                  style={{ height: 44, fontWeight: 600 }}
                  disabled={!reason}
                  onClick={() => setStep(3)}
                >
                  다음
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: 비밀번호 확인 */}
          {step === 3 && (
            <Form onSubmit={handleDelete}>
              <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                3단계: 비밀번호 확인
              </h5>
              <p style={{ fontSize: 14, color: "#6c757d", marginBottom: 16 }}>
                본인 확인을 위해 현재 비밀번호를 입력해 주세요.
              </p>

              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호"
                style={{ height: 48, fontSize: 14, marginBottom: 16 }}
                disabled={isLoading}
                required
              />

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="flex-fill"
                  style={{ height: 44, fontWeight: 600 }}
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-fill"
                  style={{ height: 44, fontWeight: 600 }}
                  disabled={isLoading || !password}
                >
                  {isLoading ? "처리 중..." : "회원 탈퇴"}
                </Button>
              </div>
            </Form>
          )}

          <div className="text-center mt-4">
            <span
              style={{ cursor: "pointer", color: "#6c757d", fontSize: 14 }}
              onClick={() => navigate(-1)}
            >
              돌아가기
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DeleteAccountPage;
