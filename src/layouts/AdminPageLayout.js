import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaBullhorn, FaUsers, FaFlag } from 'react-icons/fa';
import NavBar from '../components/common/NavBar';
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
    <div style={{ minHeight: '100vh' }}>      
      <NavBar />

      {/* 탭 네비게이션 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 20px',        
        overflowX: 'auto',
        maxWidth: '600px',
        margin: '0 auto',
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
                background: isActive ? '#1E9E57' : '#F5F5F5',
                color: isActive ? '#fff' : '#666',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
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

      {/* 페이지 콘텐츠 */}
      <Container style={{ maxWidth: '600px', padding: '24px 15px' }}>
        <Outlet />
      </Container>
    </div>
  );
}

export default AdminPageLayout;
