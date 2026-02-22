import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaBullhorn, FaUsers, FaFlag, FaNewspaper, FaImage } from 'react-icons/fa';
import NavBar from '../components/common/NavBar';
import AppBar from '../components/common/AppBar';
import { getAccessiblePages } from '../apis/adminAPI';

const TAB_ICONS = {
  '/admin/dashboard': <FaChartPie size={14} />,
  '/admin/notices': <FaBullhorn size={14} />,
  '/admin/members': <FaUsers size={14} />,
  '/admin/reports': <FaFlag size={14} />,
  '/admin/feed': <FaNewspaper size={14} />,
  '/admin/banners': <FaImage size={14} />,
};

const defaultTabs = [
  { pageName: '대시보드', pageUrl: '/admin/dashboard' },
  { pageName: '공지사항 관리', pageUrl: '/admin/notices' },
  { pageName: '회원 관리', pageUrl: '/admin/members' },
  { pageName: '신고 관리', pageUrl: '/admin/reports' },
  { pageName: '피드 관리', pageUrl: '/admin/feed' },
  { pageName: '배너 관리', pageUrl: '/admin/banners' },
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
    <div className="min-h-screen">
      <NavBar />

      {/* 탭 네비게이션 */}
      <div className="flex gap-1.5 py-4 px-[15px] max-w-[600px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeKey === tab.pageUrl;
          return (
            <button
              key={tab.pageUrl}
              onClick={() => navigate(tab.pageUrl)}
              className={`flex items-center gap-1 border-none py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-admin-green text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {TAB_ICONS[tab.pageUrl] || null}
              {tab.pageName}
            </button>
          );
        })}
      </div>
      <AppBar />

      {/* 페이지 콘텐츠 */}
      <div className="max-w-[600px] mx-auto py-6 px-[15px]">
        <Outlet />
      </div>
    </div>
    
  );
}

export default AdminPageLayout;
