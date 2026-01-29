import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/authAPI';

const LoginPopup = ({ show, onHide, initialEmail = '', onLoginSuccess }) => {
  const navigate = useNavigate(); // ✅ 컴포넌트 내부에서 호출해야 함

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 팝업이 열릴 때 initialEmail이 있으면 email 자동 세팅
  useEffect(() => {
    if (show && initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [show, initialEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      onHide();
      
      // ✅ 여기서 부모에게 로그인 성공 알려서 네비 변경
      if (onLoginSuccess) await onLoginSuccess();
      // window.location.reload(); // ❌ 필요 없게 됨
    } catch (error) {
      console.error('Login error:', error);
      setError(error?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="login-modal"
      style={{ maxWidth: '100%', margin: '1rem' }}
    >
      <Modal.Header closeButton className="border-0"></Modal.Header>

      <Modal.Body className="px-4 pt-0 pb-4" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <div className="mb-3" style={{ marginTop: '-20px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '0.5rem', fontWeight: '600' }}>초록불을</h2>
                <h2 style={{ fontSize: '24px', fontWeight: '600' }}>밝혀보세요!</h2>
              </div>

              <img
                src="/logo.svg"
                alt="Green Fire Logo"
                style={{ width: '140px', marginBottom: '2.5rem' }}
              />

              {/* 로그인 폼 */}
              <Form onSubmit={handleSubmit} className="mb-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                    style={{ height: '48px', fontSize: '14px', borderColor: '#dee2e6' }}
                    disabled={isLoading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호를 입력하세요"
                      style={{ height: '48px', fontSize: '14px', borderColor: '#dee2e6' }}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderColor: '#dee2e6' }}
                      disabled={isLoading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    marginBottom: '1rem',
                    backgroundColor: '#198754',
                    fontWeight: '600'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>

                <div className="d-flex justify-content-center gap-3 text-secondary mb-4" style={{ fontSize: '14px' }}>
                  {/* ✅ 여기서 회원가입 이동 */}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      onHide();
                      navigate('/signup');
                    }}
                  >
                    회원가입
                  </span>
                  <span style={{ color: '#dee2e6' }}>|</span>
                  <span style={{ cursor: 'pointer' }}>아이디 찾기</span>
                  <span style={{ color: '#dee2e6' }}>|</span>
                  <span style={{ cursor: 'pointer' }}>비밀번호 찾기</span>
                </div>
              </Form>

              {/* 이하 소셜 로그인 영역은 기존 그대로 */}
              <div className="position-relative mb-4">
                <hr style={{ borderColor: '#dee2e6' }} />
                <span
                  className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-secondary"
                  style={{ fontSize: '14px' }}
                >
                  간편 로그인
                </span>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="light"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE500',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src="/kakao-icon.png" alt="Kakao" style={{ width: '24px', height: '24px' }} />
                </Button>

                <Button
                  variant="success"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#03C75A',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src="/naver-icon.png" alt="Naver" style={{ width: '24px', height: '24px' }} />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginPopup;
