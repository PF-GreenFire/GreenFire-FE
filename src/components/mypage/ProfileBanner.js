import React from "react";

const ProfileBanner = ({ coverImage }) => {
  return (
    <div className="w-full h-[160px] overflow-hidden">
      {coverImage ? (
        <img
          src={coverImage}
          alt="커버 이미지"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-green-primary to-[#6B9B7A]">
          <img
            src="/images/profile-banner.png"
            alt="기본 커버"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileBanner;
