import React from 'react';
import { Row } from 'react-bootstrap';

const ProfileBanner = () => {
  return (
    <Row className="m-0 p-0">
      <div className="w-full h-[180px] overflow-hidden">
        <img
          src="/images/profile-banner.png"
          alt="프로필 배너"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/600/200?random=banner';
          }}
        />
      </div>
    </Row>
  );
};

export default ProfileBanner;
