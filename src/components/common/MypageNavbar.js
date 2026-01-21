import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';
import './MypageNavbar.css';

const MypageNavbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMailClick = () => {
    // 우편함 클릭 핸들러
    navigate('/mypage/mailbox');
  };

  const handleMenuClick = () => {
    // 메뉴 클릭 핸들러
    // TODO: 사이드 메뉴 열기
  };

  return (
    <nav className="mypage-navbar">
      <div className="mypage-navbar-container">
        <div className="mypage-navbar-logo" onClick={handleLogoClick}>
          GREEN FIRE
        </div>
        <div className="mypage-navbar-icons">
          <button className="navbar-icon-btn" onClick={handleMailClick}>
            <HiOutlineMail size={24} />
          </button>
          <button className="navbar-icon-btn" onClick={handleMenuClick}>
            <RxHamburgerMenu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MypageNavbar;
