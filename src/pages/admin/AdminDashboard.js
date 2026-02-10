import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaFire, FaChartLine } from 'react-icons/fa';
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted">
        <p style={{ fontSize: '14px' }}>통계 데이터를 불러올 수 없습니다.</p>
        <Button variant="outline-success" size="sm" onClick={fetchStats}>
          다시 시도
        </Button>
      </div>
    );
  }

  const cards = [
    {
      title: '총 회원 수',
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers size={24} />,
      color: '#1E9E57',
      bg: '#E8F5E9',
      link: '/admin/members',
    },
    {
      title: '신규 신고',
      value: stats?.pendingReports ?? 0,
      icon: <FaExclamationTriangle size={24} />,
      color: '#D32F2F',
      bg: '#FFEBEE',
      link: '/admin/reports?status=PENDING',
      highlight: (stats?.pendingReports ?? 0) > 0,
    },
    {
      title: '처리된 신고',
      value: stats?.handledReports ?? 0,
      icon: <FaCheckCircle size={24} />,
      color: '#1976D2',
      bg: '#E3F2FD',
      link: '/admin/reports',
    },
    {
      title: '활성 챌린지',
      value: stats?.activeChallenges ?? 0,
      icon: <FaFire size={24} />,
      color: '#F57C00',
      bg: '#FFF3E0',
      link: null,
    },
    {
      title: '최근 활동',
      value: stats?.recentActivities ?? 0,
      icon: <FaChartLine size={24} />,
      color: '#7B1FA2',
      bg: '#F3E5F5',
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
      <h5 className="fw-bold mb-4">대시보드</h5>
      <Row className="g-3">
        {cards.map((card, idx) => (
          <Col xs={6} key={idx}>
            <Card
              className={`border-0 shadow-sm h-100 ${card.link ? 'cursor-pointer' : ''}`}
              style={{
                borderRadius: '12px',
                cursor: card.link ? 'pointer' : 'default',
                border: card.highlight ? '2px solid #D32F2F' : 'none',
                transition: 'transform 0.2s',
              }}
              onClick={() => handleCardClick(card.link)}
              onMouseEnter={(e) => card.link && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => card.link && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Card.Body className="p-3">
                <div
                  className="d-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: card.bg,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>
                  {card.title}
                  {card.highlight && (
                    <span
                      className="ms-1"
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#D32F2F',
                        color: '#fff',
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#222' }}>
                  {card.value.toLocaleString()}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
