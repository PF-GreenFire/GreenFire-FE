import React from 'react';
import { Nav } from 'react-bootstrap';
import "../../AppBar.css";

const AppBar = () => {
    // 현재 경로 확인
    const path = window.location.pathname;

    return (
        <Nav
            className="justify-content-around bottom-nav"
            style={{
                width: '600px',
                height: '84px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0 15px'
            }}
        >
            <Nav.Link
                href="/nearby"
                className="nav-item text-center"
                style={{ width: '120px' }}
            >
                <div className="d-flex flex-column align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="small mt-1 text-nowrap">내 주변 초록불</span>
                </div>
            </Nav.Link>
            <Nav.Link
                href="/challenges"
                className="nav-item text-center"
                style={{ width: '80px' }}
            >
                <div className="d-flex flex-column align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <span className="small mt-1 text-nowrap">챌린지</span>
                </div>
            </Nav.Link>
            <Nav.Link
                href="/"
                className="nav-item active text-center"
                style={{ marginTop: '-20px', width: '90px' }}
            >
                <div
                    className="active-circle d-flex justify-content-center align-items-center"
                    style={{ width: '70px', height: '70px' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                </div>
                <span className="small mt-2 text-nowrap">홈</span>
            </Nav.Link>
            <Nav.Link
                href="/feed"
                className="nav-item text-center"
                style={{ width: '80px' }}
            >
                <div className="d-flex flex-column align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    </svg>
                    <span className="small mt-1 text-nowrap">피드</span>
                </div>
            </Nav.Link>
            <Nav.Link
                href="/mypage"
                className="nav-item text-center"
                style={{ width: '80px' }}
            >
                <div className="d-flex flex-column align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="small mt-1 text-nowrap">마이페이지</span>
                </div>
            </Nav.Link>
        </Nav>
    );
};

export default AppBar;