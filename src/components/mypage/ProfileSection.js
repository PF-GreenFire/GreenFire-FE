import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProfileSection = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-section-wrapper">
      {/* 배너 이미지 */}
      <div className="profile-banner">
        <img
          src="/images/mypage-banner.png"
          alt="배너"
          className="banner-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #4A7C59 0%, #6B9B7A 100%)';
          }}
        />
      </div>

      {/* 프로필 정보 */}
      <div className="profile-section">
        <div className="profile-image-wrapper">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">
              <img
                src="/images/default-profile.png"
                alt="기본 프로필"
                className="profile-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span>🐱</span>';
                }}
              />
            </div>
          )}
        </div>
        <h2 className="profile-nickname">{user.nickname}</h2>
        <Button
          variant="success"
          className="edit-profile-btn"
          onClick={() => navigate('/mypage/edit')}
        >
          내 정보 수정
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;
