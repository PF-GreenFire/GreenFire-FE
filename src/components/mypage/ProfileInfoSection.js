import React from 'react';
import { Row } from 'react-bootstrap';
import { IoSettingsOutline, IoMailOutline } from 'react-icons/io5';

const ProfileInfoSection = ({ user }) => {
  return (
    <Row className="profile-info-row">
      <div className="profile-info-section">
        {/* 프로필 이미지 */}
        <div className="profile-avatar-wrapper">
          {user.profileImage ? (
            <img src={user.profileImage} alt="프로필" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              <img
                src="/images/default-profile.png"
                alt="기본 프로필"
                className="profile-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="avatar-emoji">👤</span>';
                }}
              />
            </div>
          )}
        </div>

        {/* 통계 및 버튼 */}
        <div className="profile-stats-area">
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{user.stats.posts}</span>
              <span className="stat-label">게시물</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.stats.followers}</span>
              <span className="stat-label">팔로워</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.stats.following}</span>
              <span className="stat-label">팔로잉</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="action-btn">
              <IoSettingsOutline /> 설정
            </button>
            <button className="action-btn">
              <IoMailOutline /> 우체통
            </button>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default ProfileInfoSection;
