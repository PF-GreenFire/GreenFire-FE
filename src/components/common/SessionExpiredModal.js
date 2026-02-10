import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoginPopup from '../../pages/auth/LoginPopup';

const SessionExpiredModal = ({ show, onLoginSuccess, onClose }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleConfirm = () => {
    onClose();
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <>
      <Modal show={show} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <span role="img" aria-label="lock">&#128274;</span>
          </div>
          <h5 className="fw-bold mb-3">세션이 만료되었습니다</h5>
          <p className="text-secondary mb-4">
            다시 로그인해주세요.
          </p>
          <Button variant="success" onClick={handleConfirm} className="px-4">
            로그인하기
          </Button>
        </Modal.Body>
      </Modal>

      <LoginPopup
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default SessionExpiredModal;
