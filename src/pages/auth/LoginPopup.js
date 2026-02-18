import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/authAPI';

const LoginPopup = ({ show, onHide, initialEmail = '', onLoginSuccess }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      if (onLoginSuccess) await onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;

      if (status === 401) {
        setError(serverMessage || '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 403) {
        setError(serverMessage || '접근이 제한된 계정입니다.');
      } else if (status >= 500) {
        setError('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (!err?.response) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError(serverMessage || '로그인에 실패했습니다.');
      }
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

      <Modal.Body className="px-4 pt-0 pb-4">
        <div className="max-w-[400px] mx-auto">
          <div className="text-center">
            <div className="mb-3 -mt-5">
              <h2 className="text-2xl font-semibold mb-2">초록불을</h2>
              <h2 className="text-2xl font-semibold">밝혀보세요!</h2>
            </div>

            <img
              src="/logo.svg"
              alt="Green Fire Logo"
              className="w-[140px] mb-10"
            />

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="mb-4">
              {error && (
                <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-3">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  className="w-full h-12 text-sm border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="mb-3">
                <div className="flex">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                    className="flex-1 h-12 text-sm border border-gray-300 rounded-l-xl px-4 focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-12 px-3 border border-l-0 border-gray-300 rounded-r-xl bg-white text-gray-500 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-admin-green text-white rounded-xl mb-4 hover:bg-admin-green-dark transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>

              <div className="flex justify-center gap-3 text-gray-500 mb-4 text-sm">
                <span
                  className="cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    onHide();
                    navigate('/signup');
                  }}
                >
                  회원가입
                </span>
                <span className="text-gray-300">|</span>
                <span
                  className="cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    onHide();
                    navigate('/find-email');
                  }}
                >
                  아이디 찾기
                </span>
                <span className="text-gray-300">|</span>
                <span
                  className="cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    onHide();
                    navigate('/reset-password');
                  }}
                >
                  비밀번호 찾기
                </span>
              </div>
            </form>

            {/* 소셜 로그인 영역 */}
            <div className="relative mb-4">
              <hr className="border-gray-200" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500 text-sm">
                간편 로그인
              </span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="w-12 h-12 rounded-full flex items-center justify-center border-none p-0"
                style={{ backgroundColor: '#FEE500' }}
              >
                <img src="/kakao-icon.svg" alt="Kakao" className="w-6 h-6" />
              </button>

              <button
                type="button"
                className="w-12 h-12 rounded-full flex items-center justify-center border-none p-0"
                style={{ backgroundColor: '#03C75A' }}
              >
                <img src="/naver-icon.svg" alt="Naver" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginPopup;
