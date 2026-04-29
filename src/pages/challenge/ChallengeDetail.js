import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Card, Container, Image, Spinner } from 'react-bootstrap';
import { Tag } from 'antd';
import {
  applyChallengeAPI,
  cancelChallengeApplyAPI,
  deleteChallengeAPI,
  getChallengeDetailAPI,
  getChallengePostsAPI,
} from '../../apis/challengeAPI';
import { useAuth } from '../../hooks/useAuth';

const STATUS_LABEL = {
  RECRUITING: '모집중',
  ONGOING: '진행중',
  CLOSED: '종료',
  CANCELLED: '취소됨',
  PAUSED: '일시중지',
};

const statusColor = (status) => {
  switch (status) {
    case 'RECRUITING': return 'green';
    case 'ONGOING': return 'blue';
    case 'CLOSED': return 'red';
    default: return 'default';
  }
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(getChallengeDetailAPI(id));
      setChallenge(data);
      setError(null);
    } catch (e) {
      setError(
        e?.response?.status === 404
          ? '챌린지를 찾을 수 없습니다.'
          : '챌린지 조회에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    load();
  }, [load]);

  // 인증 피드 로드
  useEffect(() => {
    let cancelled = false;
    setPostsLoading(true);
    dispatch(getChallengePostsAPI(id))
      .then((data) => {
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setPostsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, id]);

  const handleApply = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    setBusy(true);
    try {
      await dispatch(applyChallengeAPI(id));
      alert('챌린지 참여 신청이 완료되었습니다.');
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || '참여 신청에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('챌린지 참여를 취소하시겠습니까?')) return;
    setBusy(true);
    try {
      await dispatch(cancelChallengeApplyAPI(id));
      alert('참여가 취소되었습니다.');
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || '참여 취소에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('이 챌린지를 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
    setBusy(true);
    try {
      await dispatch(deleteChallengeAPI(id));
      alert('삭제되었습니다.');
      navigate('/challenges');
    } catch (e) {
      alert(e?.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (error || !challenge) {
    return (
      <Container className="text-center py-5 text-muted">
        {error || '데이터가 없습니다.'}
      </Container>
    );
  }

  const isHost = user?.userId && challenge.hostUser && user.userId === challenge.hostUser;
  const canApply = challenge.challengeStatus === 'RECRUITING';
  const canCertify =
    isLoggedIn &&
    (challenge.challengeStatus === 'RECRUITING' ||
      challenge.challengeStatus === 'ONGOING');
  const canEdit =
    isHost &&
    challenge.challengeStatus !== 'CLOSED' &&
    challenge.challengeStatus !== 'CANCELLED';

  return (
    <Container style={{ maxWidth: '563px', padding: '24px 16px' }}>
      {challenge.thumbnailUrl && (
        <Image
          src={challenge.thumbnailUrl}
          alt={challenge.challengeTitle}
          fluid
          rounded
          className="mb-3"
          style={{ maxHeight: 260, objectFit: 'cover', width: '100%' }}
        />
      )}

      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
        <h3 className="m-0">{challenge.challengeTitle}</h3>
        <Tag color={statusColor(challenge.challengeStatus)}>
          {STATUS_LABEL[challenge.challengeStatus] || challenge.challengeStatus}
        </Tag>
      </div>

      <div className="text-muted small mb-3">
        기간 {challenge.startDate} ~ {challenge.endDate} · 정원 {challenge.recruitmentNum}명 · XP {challenge.xp}
      </div>

      <Card className="mb-4">
        <Card.Body style={{ whiteSpace: 'pre-wrap' }}>
          {challenge.challengeContent}
        </Card.Body>
      </Card>

      <div className="d-flex gap-2 flex-wrap">
        {canApply && (
          <Button variant="success" disabled={busy} onClick={handleApply}>
            참여 신청
          </Button>
        )}
        {canCertify && (
          <Button
            variant="outline-success"
            onClick={() => navigate(`/feed/create?challengeCode=${id}`)}
          >
            인증글 작성
          </Button>
        )}
        <Button variant="outline-secondary" disabled={busy} onClick={handleCancel}>
          참여 취소
        </Button>
        {canEdit && (
          <Button
            variant="outline-primary"
            onClick={() => navigate(`/challenges/${id}/edit`)}
          >
            수정
          </Button>
        )}
        {isHost && (
          <Button variant="outline-danger" disabled={busy} onClick={handleDelete}>
            삭제
          </Button>
        )}
      </div>

      {/* 인증 피드 */}
      <h5 className="mt-5 mb-3">
        인증 피드 <span className="text-muted small">({posts.length})</span>
      </h5>
      {postsLoading ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" variant="success" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-4 text-muted small">
          아직 인증글이 없습니다.
          {canCertify && ' 첫 번째로 인증해보세요!'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
          }}
        >
          {posts.map((post) => (
            <div
              key={post.postCode}
              onClick={() => navigate(`/feed/${post.postCode}`)}
              style={{
                aspectRatio: '1',
                cursor: 'pointer',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden',
                borderRadius: '4px',
                position: 'relative',
              }}
              title={post.writer ? `by ${post.writer}` : ''}
            >
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center w-100 h-100 text-muted"
                  style={{ fontSize: 24 }}
                >
                  📷
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ChallengeDetail;
