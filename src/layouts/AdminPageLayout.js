import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartPie, FaBullhorn, FaUsers, FaFlag } from 'react-icons/fa';
import { getAccessiblePages } from '../apis/adminAPI';

const TAB_ICONS = {
  '/admin/dashboard': <FaChartPie size={14} />,
  '/admin/notices': <FaBullhorn size={14} />,
  '/admin/members': <FaUsers size={14} />,
  '/admin/reports': <FaFlag size={14} />,
};

const defaultTabs = [
  { pageName: '대시보드', pageUrl: '/admin/dashboard' },
  { pageName: '공지사항 관리', pageUrl: '/admin/notices' },
  { pageName: '회원 관리', pageUrl: '/admin/members' },
  { pageName: '신고 관리', pageUrl: '/admin/reports' },
];

function AdminPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTabs] = useState(defaultTabs);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages = await getAccessiblePages();
        if (Array.isArray(pages) && pages.length > 0) {
          setTabs(pages.map(p => ({
            pageName: p.pageName,
            pageUrl: p.pageUrl,
          })));
        }
      } catch {
        // API 미구현 시 기본 탭 사용
      }
    };
    fetchPages();
  }, []);

  const activeKey = location.pathname;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 상단 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #1E9E57, #16a34a)',
        padding: '20px 0 16px',
      }}>
        <Container style={{ maxWidth: '800px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 style={{
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                fontSize: '20px',
                letterSpacing: '-0.3px',
              }}>
                관리자 센터
              </h5>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                margin: '4px 0 0',
              }}>
                GreenFire Admin
              </p>
            </div>
            <Button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <FaHome className="me-1" /> 홈으로
            </Button>
          </div>
        </Container>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <Container style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {tabs.map((tab) => {
              const isActive = activeKey === tab.pageUrl;
              return (
                <button
                  key={tab.pageUrl}
                  onClick={() => navigate(tab.pageUrl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: isActive ? '#1E9E57' : '#f5f5f5',
                    color: isActive ? '#fff' : '#666',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {TAB_ICONS[tab.pageUrl] || null}
                  {tab.pageName}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* 페이지 콘텐츠 */}
      <Container style={{ maxWidth: '800px', padding: '24px 15px' }}>
        <Outlet />
      </Container>
    </div>
  );
}

export default AdminPageLayout;
