import React, { useState } from 'react';
import { Modal, Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPopup = ({ show, onHide }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="login-modal"
      style={{ maxWidth: '100%', margin: '1rem' }}
    >
      <Modal.Header closeButton className="border-0">
      </Modal.Header>
      <Modal.Body className="px-4 pt-0 pb-4" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <div className="mb-3" style={{ marginTop: '-20px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>초록불을</h2>
                <h2 style={{ 
                  fontSize: '24px',
                  fontWeight: '600'
                }}>밝혀보세요!</h2>
              </div>
              
              <img 
                src="/logo.svg" 
                alt="Green Fire Logo" 
                style={{ width: '140px', marginBottom: '2.5rem' }}
              />

              {/* 로그인 폼 */}
              <Form className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="아이디를 입력하세요"
                    style={{ 
                      height: '48px', 
                      fontSize: '14px',
                      borderColor: '#dee2e6'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      style={{ 
                        height: '48px', 
                        fontSize: '14px',
                        borderColor: '#dee2e6'
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="success"
                  className="w-100"
                  style={{ 
                    height: '48px',
                    fontSize: '16px',
                    marginBottom: '1rem',
                    backgroundColor: '#198754',
                    fontWeight: '600'
                  }}
                >
                  로그인
                </Button>

                <div className="d-flex justify-content-center gap-3 text-secondary mb-4" style={{ fontSize: '14px' }}>
                  <span style={{ cursor: 'pointer' }}>회원가입</span>
                  <span style={{ color: '#dee2e6' }}>|</span>
                  <span style={{ cursor: 'pointer' }}>아이디 찾기</span>
                  <span style={{ color: '#dee2e6' }}>|</span>
                  <span style={{ cursor: 'pointer' }}>비밀번호 찾기</span>
                </div>
              </Form>

              {/* 구분선 */}
              <div className="position-relative mb-4">
                <hr style={{ borderColor: '#dee2e6' }} />
                <span 
                  className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-secondary"
                  style={{ fontSize: '14px' }}
                >
                  간편 로그인
                </span>
              </div>

              {/* 소셜 로그인 버튼 */}
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
                  <img 
                    src="/kakao-icon.png" 
                    alt="Kakao" 
                    style={{ width: '24px', height: '24px' }}
                  />
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
                  <img 
                    src="/naver-icon.png" 
                    alt="Naver" 
                    style={{ width: '24px', height: '24px' }}
                  />
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
