import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaUsers, FaBullhorn, FaUserPlus, FaChartLine } from 'react-icons/fa';
import { getDashboardStats } from '../../apis/adminAPI';

const AdminDashboard = () => {
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
    return <Alert variant="danger">{error}</Alert>;
  }

  const cards = [
    {
      title: '총 회원 수',
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers size={24} />,
      color: '#1E9E57',
      bg: '#E8F5E9',
    },
    {
      title: '총 공지사항',
      value: stats?.totalNotices ?? 0,
      icon: <FaBullhorn size={24} />,
      color: '#1976D2',
      bg: '#E3F2FD',
    },
    {
      title: '오늘 가입자',
      value: stats?.todaySignups ?? 0,
      icon: <FaUserPlus size={24} />,
      color: '#F57C00',
      bg: '#FFF3E0',
    },
    {
      title: '최근 활동',
      value: stats?.recentActivities ?? 0,
      icon: <FaChartLine size={24} />,
      color: '#7B1FA2',
      bg: '#F3E5F5',
    },
  ];

  return (
    <div>
      <h5 className="fw-bold mb-4">대시보드</h5>
      <Row className="g-3">
        {cards.map((card, idx) => (
          <Col xs={6} key={idx}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: '12px' }}
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
