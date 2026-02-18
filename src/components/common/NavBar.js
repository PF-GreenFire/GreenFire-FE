import { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../../pages/auth/LoginPopup';
import { useAuth } from '../../hooks/useAuth';

function NavBar() {
    const [show, setShow] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, isLoading: checking, role, onLoginSuccess, onLogout } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogin = () => {
    setShowLoginPopup(true);
    handleClose();
  };

    const handleLogout = async () => {
        await onLogout();
        handleClose();
    };

    const navLinkClass = "cursor-pointer font-medium py-2 px-3 border-b border-gray-200 block";

    return (
        <>
            {/* 전체 배경 div */}
            <div className="w-full">
                <div className="max-w-[600px] mx-auto border-b border-gray-200">
                    <div className="flex justify-between items-center py-2 px-4">
                        <div>
                            <h5 className="font-bold text-admin-green mb-0 cursor-pointer" onClick={() => navigate('/')}>GREEN FIRE</h5>
                        </div>
                        <div className="flex">
                            <button className="text-admin-green p-1 bg-transparent border-none" onClick={handleShow}>
                                <IoMdMenu size={25} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offcanvas Sidebar */}
            <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-light">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="font-bold text-gray-900">메뉴</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav className="flex flex-col">
                        {/* 세션 체크 중이면 깜빡임 방지용 표시 */}
                        {checking ? (
                        <span className={`${navLinkClass} text-gray-500`}>
                            로그인 상태 확인 중...
                        </span>
                        ) : !isLoggedIn ? (
                        <span
                            onClick={handleLogin}
                            className={`${navLinkClass} text-admin-green font-bold`}
                        >
                            로그인
                        </span>
                        ) : (
                            <>
                                <span
                                    onClick={() => handleNavigation('/mypage/info')}
                                    className={`${navLinkClass} text-gray-900`}
                                >
                                    나의 정보
                                </span>
                                <span
                                    onClick={handleLogout}
                                    className={`${navLinkClass} text-danger`}
                                >
                                    로그아웃
                                </span>
                                {role === 'ADMIN' && (
                                    <span
                                        onClick={() => handleNavigation('/admin')}
                                        className={`${navLinkClass} text-info font-bold`}
                                    >
                                        관리자 페이지
                                    </span>
                                )}
                            </>
                        )}
                        <span
                            onClick={() => handleNavigation('/cs')}
                            className={`${navLinkClass} text-gray-900`}
                        >
                            CS
                        </span>
                        <span
                            onClick={() => handleNavigation('/notices')}
                            className={`${navLinkClass} text-gray-900`}
                        >
                            공지사항
                        </span>
                        <span
                            onClick={() => handleNavigation('/about')}
                            className={`${navLinkClass} text-gray-900`}
                        >
                            About
                        </span>
                        <span
                            onClick={() => handleNavigation('/settings')}
                            className={`${navLinkClass} text-gray-900`}
                        >
                            설정
                        </span>
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Login Popup */}
                <LoginPopup
                    show={showLoginPopup}
                    onHide={() => setShowLoginPopup(false)}
                    onLoginSuccess={() => {
                    setShowLoginPopup(false);
                    onLoginSuccess();
                }}
            />

        </>
    );
}

export default NavBar;
