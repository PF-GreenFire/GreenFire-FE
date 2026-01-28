import React from 'react';
import { Row } from 'react-bootstrap';

const UserDetails = ({ user }) => {
  return (
    <Row className="m-0 p-0">
      <div className="flex p-4 gap-4">
        <div className="flex-shrink-0 text-center min-w-[100px]">
          <span className="inline-block py-0.5 px-2.5 bg-green-light rounded-xl text-[10px] font-semibold text-green-primary mb-1">
            LEVEL {user.level}
          </span>
          <h2 className="text-base font-bold text-gray-800 my-1">{user.nickname}</h2>
          <p className="text-xs text-gray-500 m-0">{user.username}</p>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {user.tags.map((tag, index) => (
              <span
                key={index}
                className="py-1 px-2.5 bg-green-lighter rounded-xl text-[11px] text-green-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed m-0">{user.bio}</p>
        </div>
      </div>
    </Row>
  );
};

export default UserDetails;
