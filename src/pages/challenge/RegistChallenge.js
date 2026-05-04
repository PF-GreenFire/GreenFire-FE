import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import {
  createChallengeAPI,
  getChallengeDetailAPI,
  updateChallengeAPI,
} from '../../apis/challengeAPI';

// ChallengeMain 과 동일한 매핑 (BE category 테이블과 실제 일치 여부 실테스트 필요)
const CATEGORIES = [
  { code: 1, label: '플로깅' },
  { code: 2, label: '비건식' },
  { code: 3, label: '제로웨이스트' },
  { code: 4, label: '동물보호' },
  { code: 5, label: '독서모임' },
  { code: 6, label: '봉사' },
];

const initialForm = {
  challengeTitle: '',
  challengeContent: '',
  recruitmentNum: 10,
  startDate: '',
  endDate: '',
  xp: 100,
  thumbnailUrl: '',
  challengeCategoryCode: 1,
  challengeStatus: 'RECRUITING',
};

const RegistChallenge = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoading(true);
    dispatch(getChallengeDetailAPI(id))
      .then((data) => {
        if (cancelled || !data) return;
        setForm({
          challengeTitle: data.challengeTitle || '',
          challengeContent: data.challengeContent || '',
          recruitmentNum: data.recruitmentNum ?? 10,
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          xp: data.xp ?? 100,
          thumbnailUrl: data.thumbnailUrl || '',
          challengeCategoryCode: data.challengeCategoryCode ?? 1,
          challengeStatus: data.challengeStatus || 'RECRUITING',
        });
      })
      .catch(() => {
        if (!cancelled) alert('챌린지 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, id, isEdit]);

  const onChange = (key) => (e) => {
    const v =
      e.target.type === 'number'
        ? e.target.value === ''
          ? ''
          : Number(e.target.value)
        : e.target.value;
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.challengeTitle.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!form.challengeContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      alert('기간을 선택해주세요.');
      return;
    }
    if (form.startDate > form.endDate) {
      alert('시작일이 종료일보다 늦을 수 없습니다.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const payload = {
          challengeTitle: form.challengeTitle,
          challengeContent: form.challengeContent,
          recruitmentNum: Number(form.recruitmentNum),
          startDate: form.startDate,
          endDate: form.endDate,
          xp: Number(form.xp),
          thumbnailUrl: form.thumbnailUrl || null,
          challengeCategoryCode: Number(form.challengeCategoryCode),
        };
        await dispatch(updateChallengeAPI(id, payload));
        alert('수정되었습니다.');
        navigate(`/challenges/${id}`);
      } else {
        const { challengeCode } = await dispatch(createChallengeAPI(form));
        if (challengeCode) {
          navigate(`/challenges/${challengeCode}`);
        } else {
          navigate('/challenges');
        }
      }
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          (isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '563px', padding: '24px 16px' }}>
      <h3 className="mb-4">{isEdit ? '챌린지 수정' : '새 챌린지 등록'}</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            value={form.challengeTitle}
            onChange={onChange('challengeTitle')}
            maxLength={100}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={form.challengeContent}
            onChange={onChange('challengeContent')}
            required
          />
        </Form.Group>

        <div className="row g-2">
          <Form.Group className="col mb-3">
            <Form.Label>시작일</Form.Label>
            <Form.Control
              type="date"
              value={form.startDate}
              onChange={onChange('startDate')}
              required
            />
          </Form.Group>
          <Form.Group className="col mb-3">
            <Form.Label>종료일</Form.Label>
            <Form.Control
              type="date"
              value={form.endDate}
              onChange={onChange('endDate')}
              required
            />
          </Form.Group>
        </div>

        <div className="row g-2">
          <Form.Group className="col mb-3">
            <Form.Label>모집 인원</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.recruitmentNum}
              onChange={onChange('recruitmentNum')}
              required
            />
          </Form.Group>
          <Form.Group className="col mb-3">
            <Form.Label>보상 불씨</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={500}
              value={form.xp}
              onChange={onChange('xp')}
              required
            />
            <Form.Text className="text-muted">최대 500까지</Form.Text>
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>카테고리</Form.Label>
          <Form.Select
            value={form.challengeCategoryCode}
            onChange={onChange('challengeCategoryCode')}
          >
            {CATEGORIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>썸네일 URL (선택)</Form.Label>
          <Form.Control
            value={form.thumbnailUrl}
            onChange={onChange('thumbnailUrl')}
            placeholder="https://..."
          />
        </Form.Group>

        <Button type="submit" variant="success" disabled={submitting} className="w-100">
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {isEdit ? '수정 중...' : '등록 중...'}
            </>
          ) : isEdit ? (
            '수정 저장'
          ) : (
            '등록하기'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default RegistChallenge;
