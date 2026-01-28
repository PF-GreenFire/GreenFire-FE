import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';

const MypageNavbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMailClick = () => {
    navigate('/mypage/mailbox');
  };

  const handleMenuClick = () => {
    // TODO: 사이드 메뉴 열기
  };

  return (
    <nav className="w-full bg-white top-0 z-[100]">
      <div className="max-w-[563px] mx-auto flex justify-between items-center py-3 px-4 border-b border-gray-100">
        <div
          className="text-xl font-bold text-green-primary cursor-pointer tracking-tight"
          onClick={handleLogoClick}
        >
          GREEN FIRE
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-transparent border-none p-1 cursor-pointer text-gray-800 flex items-center justify-center hover:text-green-primary"
            onClick={handleMailClick}
          >
            <HiOutlineMail size={24} />
          </button>
          <button
            className="bg-transparent border-none p-1 cursor-pointer text-gray-800 flex items-center justify-center hover:text-green-primary"
            onClick={handleMenuClick}
          >
            <RxHamburgerMenu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MypageNavbar;
