import React from 'react';
import { Link } from 'react-router-dom';

const MyPageMain = () => {
  return (
    <div>
      마이페이지

      <div style={{ marginTop: 80, textAlign: 'center' }}>
        <Link
          to="/account/delete"
          style={{
            fontSize: 12,
            color: '#adb5bd',
            textDecoration: 'none',
          }}
        >
          회원 탈퇴
        </Link>
      </div>
    </div>
  );
};

export default MyPageMain;