import React from "react";

const UserDetails = ({ user }) => {
  return (
    <div className="flex pt-3 pb-4 gap-3">
      {/* 레벨, 닉네임, 아이디 */}
      <div className="flex-shrink-0 min-w-[90px]">
        <span className="inline-block py-0.5 px-2 bg-green-light rounded-full text-[10px] font-semibold text-green-primary mb-1">
          LEVEL {user.level}
        </span>
        <h2 className="text-base font-bold text-gray-800 my-1 leading-tight">
          {user.nickname}
        </h2>
        <p className="text-xs text-gray-500 m-0">{user.username}</p>
      </div>

      {/* 태그, 자기소개 */}
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {user.tags.map((tag, index) => (
            <span
              key={index}
              className="py-0.5 px-2 bg-green-lighter rounded-full text-[10px] text-green-primary border border-green-light"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 leading-relaxed m-0 line-clamp-3">
          {user.bio}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
