import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getMembers, changeUserRole } from '../../apis/adminAPI';

const AdminMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchKeyword]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMembers(page, PAGE_SIZE, searchKeyword);
      const memberList = data.members || data.content || [];
      if (page === 1) setMembers(memberList);
      else setMembers(prev => [...prev, ...memberList]);
      setHasMore(data.hasMore ?? (memberList.length >= PAGE_SIZE));
    } catch (err) {
      console.error(err);
      setError('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setPage(1);
    setMembers([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRoleChange = async (userId, newRole) => {
    const ok = window.confirm(`역할을 ${newRole}(으)로 변경하시겠습니까?`);
    if (!ok) return;
    try {
      await changeUserRole(userId, newRole);
      setMembers(prev =>
        prev.map(m => m.userId === userId ? { ...m, role: newRole } : m)
      );
      alert('역할이 변경되었습니다.');
    } catch (err) {
      console.error(err);
      alert('역할 변경에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (member) => {
    if (member.deletedAt) return <Badge bg="danger">탈퇴</Badge>;
    return <Badge bg="success">활성</Badge>;
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <Badge bg="danger">관리자</Badge>;
      case 'MANAGER': return <Badge bg="warning" text="dark">매니저</Badge>;
      default: return <Badge bg="secondary">일반</Badge>;
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">회원 관리</h5>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="이메일 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button variant="outline-success" onClick={handleSearch}>
          <FaSearch />
        </Button>
      </InputGroup>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <div style={{ overflowX: 'auto' }}>
        <Table hover size="sm" style={{ fontSize: '13px' }}>
          <thead>
            <tr className="table-light">
              <th style={{ width: '35%' }}>이메일</th>
              <th style={{ width: '15%' }}>역할</th>
              <th style={{ width: '15%' }}>가입일</th>
              <th style={{ width: '10%' }}>상태</th>
              <th style={{ width: '25%' }}>역할 변경</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.userId}>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {member.email}
                </td>
                <td>{getRoleBadge(member.role)}</td>
                <td className="text-muted">{formatDate(member.createdAt)}</td>
                <td>{getStatusBadge(member)}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                    disabled={!!member.deletedAt}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" variant="success" size="sm" />
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="text-center py-4 text-muted">
          회원이 없습니다.
        </div>
      )}

      {!loading && hasMore && members.length > 0 && (
        <div className="text-center py-2">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setPage(prev => prev + 1)}
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminMemberList;
