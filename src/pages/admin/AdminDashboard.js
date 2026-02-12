import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
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
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          <span role="img" aria-label="error">&#128546;</span>
        </div>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
          통계 데이터를 불러올 수 없습니다.
        </p>
        <Button
          onClick={fetchStats}
          style={{
            background: '#1E9E57',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 24px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  const cards = [
    {
      title: '총 회원 수',
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers size={28} />,
      color: '#1E9E57',
      bg: '#E8F5E9',
      link: '/admin/members',
    },
    {
      title: '신규 신고',
      value: stats?.pendingReports ?? 0,
      icon: <FaExclamationTriangle size={28} />,
      color: '#D32F2F',
      bg: '#FFEBEE',
      link: '/admin/reports?status=PENDING',
      highlight: (stats?.pendingReports ?? 0) > 0,
    },
    {
      title: '처리된 신고',
      value: stats?.handledReports ?? 0,
      icon: <FaCheckCircle size={28} />,
      color: '#1976D2',
      bg: '#E3F2FD',
      link: '/admin/reports',
    },
    {
      title: '오늘 가입',
      value: stats?.todaySignups ?? 0,
      icon: <FaUserPlus size={28} />,
      color: '#7B1FA2',
      bg: '#F3E5F5',
      link: '/admin/members',
    },
    {
      title: '챌린지 참여자',
      value: stats?.challengeParticipants ?? 0,
      icon: <FaTrophy size={28} />,
      color: '#F57C00',
      bg: '#FFF3E0',
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
      <div style={{
        background: 'linear-gradient(135deg, #1E9E57, #16a34a)',
        borderRadius: '20px',
        padding: '28px 24px',
        marginBottom: '24px',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(30, 158, 87, 0.3)',
      }}>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.8)',
          margin: '0 0 4px',
        }}>
          {today}
        </p>
        <h4 style={{
          fontWeight: 800,
          margin: 0,
          fontSize: '22px',
          letterSpacing: '-0.3px',
        }}>
          대시보드
        </h4>
      </div>

      <Row className="g-3">
        {cards.map((card, idx) => (
          <Col xs={6} key={idx}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: '16px',
                cursor: card.link ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: card.highlight
                  ? '0 4px 16px rgba(211, 47, 47, 0.15)'
                  : '0 2px 12px rgba(0,0,0,0.06)',
                border: card.highlight ? '2px solid #D32F2F' : '1px solid transparent',
                background: card.highlight
                  ? 'linear-gradient(135deg, #fff 0%, #FFF5F5 100%)'
                  : '#fff',
              }}
              onClick={() => handleCardClick(card.link)}
              onMouseEnter={(e) => {
                if (card.link) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (card.link) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = card.highlight
                    ? '0 4px 16px rgba(211, 47, 47, 0.15)'
                    : '0 2px 12px rgba(0,0,0,0.06)';
                }
              }}
            >
              <Card.Body style={{ padding: '20px' }}>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: card.bg,
                    color: card.color,
                    marginBottom: '14px',
                  }}
                >
                  {card.icon}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                  {card.title}
                  {card.highlight && (
                    <span
                      className="ms-1"
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#D32F2F',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        animation: 'pulse 2s infinite',
                      }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#222' }}>
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
