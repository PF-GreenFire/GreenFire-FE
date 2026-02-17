import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaTrophy, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../apis/adminAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-[60px] px-5 text-gray-400">
        <div className="text-[48px] mb-4">
          <span role="img" aria-label="error">&#128546;</span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          통계 데이터를 불러올 수 없습니다.
        </p>
        <button
          onClick={fetchStats}
          className="bg-admin-green text-white border-none rounded-full py-2 px-6 text-[13px] font-semibold hover:bg-admin-green-dark transition-all"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: '총 회원 수',
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers size={28} />,
      color: 'text-admin-green',
      bg: 'bg-green-lighter',
      link: '/admin/members',
    },
    {
      title: '신규 신고',
      value: stats?.pendingReports ?? 0,
      icon: <FaExclamationTriangle size={28} />,
      color: 'text-danger',
      bg: 'bg-danger-light',
      link: '/admin/reports?status=PENDING',
      highlight: (stats?.pendingReports ?? 0) > 0,
    },
    {
      title: '처리된 신고',
      value: stats?.handledReports ?? 0,
      icon: <FaCheckCircle size={28} />,
      color: 'text-info',
      bg: 'bg-info-light',
      link: '/admin/reports',
    },
    {
      title: '오늘 가입',
      value: stats?.todaySignups ?? 0,
      icon: <FaUserPlus size={28} />,
      color: 'text-purple',
      bg: 'bg-purple-light',
      link: '/admin/members',
    },
    {
      title: '챌린지 참여자',
      value: stats?.challengeParticipants ?? 0,
      icon: <FaTrophy size={28} />,
      color: 'text-warning',
      bg: 'bg-warning-light',
      link: null,
    },
  ];

  const handleCardClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div>
      {/* 환영 배너 */}
      <div
        className="rounded-[20px] py-7 px-6 mb-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #1E9E57, #16a34a)',
          boxShadow: '0 4px 20px rgba(30, 158, 87, 0.3)',
        }}
      >
        <p className="text-[13px] text-white/80 mb-1">
          {today}
        </p>
        <h4 className="font-extrabold text-[22px] tracking-tight m-0">
          대시보드
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 transition-all duration-200 ${
              card.link ? 'cursor-pointer hover:-translate-y-1 hover:shadow-card-hover' : ''
            } ${card.highlight ? 'border-2 border-danger shadow-card-highlight' : 'shadow-card'}`}
            style={card.highlight ? { background: 'linear-gradient(135deg, #fff 0%, #FFF5F5 100%)' } : undefined}
            onClick={() => handleCardClick(card.link)}
          >
            <div className={`flex items-center justify-center w-[52px] h-[52px] rounded-[14px] mb-3.5 ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-[13px] text-gray-400 mb-1.5">
              {card.title}
              {card.highlight && (
                <span className="ml-1 text-[10px] bg-danger text-white py-0.5 px-2 rounded-full font-semibold animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <div className="text-[28px] font-extrabold text-gray-900">
              {card.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
