import React from 'react';
import { Row } from 'react-bootstrap';

const ProfileBanner = () => {
  return (
    <Row className="profile-banner-row">
      <div className="profile-banner">
        <img
          src="/images/profile-banner.png"
          alt="프로필 배너"
          className="banner-image"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/600/200?random=banner';
          }}
        />
      </div>
    </Row>
  );
};

export default ProfileBanner;
