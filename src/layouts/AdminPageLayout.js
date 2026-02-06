import React, { useState, useEffect } from 'react';
import { Container, Nav, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { getAccessiblePages } from '../apis/adminAPI';

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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* 상단 헤더 */}
      <div style={{ backgroundColor: '#1E9E57', padding: '12px 0' }}>
        <Container style={{ maxWidth: '800px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-white mb-0">관리자</h5>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => navigate('/')}
            >
              <FaHome className="me-1" /> 홈으로
            </Button>
          </div>
        </Container>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6' }}>
        <Container style={{ maxWidth: '800px' }}>
          <Nav variant="tabs" activeKey={activeKey} style={{ border: 'none' }}>
            {tabs.map((tab) => (
              <Nav.Item key={tab.pageUrl}>
                <Nav.Link
                  eventKey={tab.pageUrl}
                  onClick={() => navigate(tab.pageUrl)}
                  style={{
                    fontSize: '14px',
                    fontWeight: activeKey === tab.pageUrl ? 700 : 400,
                    color: activeKey === tab.pageUrl ? '#1E9E57' : '#666',
                    borderBottom: activeKey === tab.pageUrl ? '2px solid #1E9E57' : 'none',
                  }}
                >
                  {tab.pageName}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </div>

      {/* 페이지 콘텐츠 */}
      <Container style={{ maxWidth: '800px', padding: '20px 15px' }}>
        <Outlet />
      </Container>
    </div>
  );
}

export default AdminPageLayout;
