import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
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
          <div className="text-[48px] mb-4">
            <span role="img" aria-label="lock">&#128274;</span>
          </div>
          <h5 className="font-bold mb-3">세션이 만료되었습니다</h5>
          <p className="text-gray-500 mb-4">
            다시 로그인해주세요.
          </p>
          <button onClick={handleConfirm} className="bg-admin-green text-white rounded-full px-6 py-2 font-semibold hover:bg-admin-green-dark transition-all">
            로그인하기
          </button>
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
