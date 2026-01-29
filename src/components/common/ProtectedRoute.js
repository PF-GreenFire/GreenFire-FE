import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import LoginPopup from '../../pages/auth/LoginPopup';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, isLoading, role, onLoginSuccess } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginPopup
          show={true}
          onHide={() => setShowLogin(false)}
          onLoginSuccess={onLoginSuccess}
        />
        <Navigate to="/" state={{ from: location }} replace />
      </>
    );
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
