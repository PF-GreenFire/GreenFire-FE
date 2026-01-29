// pages/notice/NoticeForm.js
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { createNotice, updateNotice, getNoticeDetail, getAttachmentDownloadUrl } from '../../apis/noticeAPI';
import AppBar from '../../components/common/AppBar';

const NoticeForm = ({ mode }) => {
  const navigate = useNavigate();
  const { noticeCode } = useParams();

  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    noticeTitle: '',
    noticeCategory: 'NOTICE',
    isImportant: false,
    startDate: '',
    endDate: '',
    noticeContent: '',
  });

  const [newFiles, setNewFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    if (isEdit && noticeCode) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, noticeCode]);

  const toDatetimeLocalValue = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNoticeDetail(noticeCode);
      setForm({
        noticeTitle: data.noticeTitle || '',
        noticeCategory: data.noticeCategory || 'NOTICE',
        isImportant: Boolean(data.isImportant),
        startDate: toDatetimeLocalValue(data.startDate),
        endDate: toDatetimeLocalValue(data.endDate),
        noticeContent: data.noticeContent || '',
      });
      setExistingAttachments(data.attachments || []);
    } catch (e) {
      console.error(e);
      setError('공지사항 상세를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.noticeTitle.trim()) return '제목은 필수입니다.';
    if (!form.noticeCategory) return '카테고리는 필수입니다.';
    if (!form.noticeContent.trim()) return '내용은 필수입니다.';

    if (form.noticeCategory === 'EVENT') {
      if (!form.startDate || !form.endDate) return '이벤트는 시작/종료일이 필요합니다.';
      if (new Date(form.startDate) > new Date(form.endDate)) return '시작일은 종료일보다 앞서야 합니다.';
    }
    return null;
  };

  const buildFormData = () => {
    const fd = new FormData();
    // ✅ 백엔드에서 받는 key가 다르면 여기만 바꾸면 됨
    fd.append('noticeTitle', form.noticeTitle);
    fd.append('noticeCategory', form.noticeCategory);
    fd.append('noticeContent', form.noticeContent);
    fd.append('isImportant', String(Boolean(form.isImportant)));

    if (form.noticeCategory === 'EVENT') {
      fd.append('startDate', form.startDate);
      fd.append('endDate', form.endDate);
    }

    newFiles.forEach((file) => {
      fd.append('files', file);
    });

    return fd;
  };

  const handleSubmit = async () => {
    const msg = validate();
    if (msg) return alert(msg);

    setLoading(true);
    setError(null);

    try {
      const fd = buildFormData();
      if (isEdit) {
        await updateNotice(noticeCode, fd);
        alert('수정되었습니다.');
        navigate(`/notices/${noticeCode}`);
      } else {
        await createNotice(fd);
        alert('등록되었습니다.');
        navigate('/notices');
      }
    } catch (e) {
      console.error(e);
      setError(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const badgeVariant = (c) => {
    switch (c) {
      case 'NOTICE': return 'success';
      case 'EVENT': return 'primary';
      case 'SYSTEM': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Container style={{ maxWidth: '600px', padding: '20px 15px', paddingBottom: '90px' }}>
        {/* 상단바 */}
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 10,
          }}
        >
          <Button
            variant="link"
            className="p-0"
            style={{ color: '#222', textDecoration: 'none' }}
            onClick={() => (isEdit ? navigate(`/notices/${noticeCode}`) : navigate('/notices'))}
            disabled={loading}
          >
            <FaChevronLeft />
          </Button>

          <div style={{ fontWeight: 700, fontSize: '16px' }}>
            {isEdit ? '공지사항 수정' : '공지사항 등록'}
          </div>

          <div style={{ width: 18 }} />
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Badge bg={badgeVariant(form.noticeCategory)}>{form.noticeCategory}</Badge>
              {form.isImportant && <Badge bg="danger">중요</Badge>}
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">제목</Form.Label>
              <Form.Control
                value={form.noticeTitle}
                onChange={(e) => handleChange('noticeTitle', e.target.value)}
                placeholder="제목을 입력하세요"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">카테고리</Form.Label>
              <Form.Select
                value={form.noticeCategory}
                onChange={(e) => handleChange('noticeCategory', e.target.value)}
                disabled={loading}
              >
                <option value="NOTICE">NOTICE (공지)</option>
                <option value="EVENT">EVENT (이벤트)</option>
                <option value="SYSTEM">SYSTEM (시스템)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="important-switch"
                label="중요 공지"
                checked={form.isImportant}
                onChange={(e) => handleChange('isImportant', e.target.checked)}
                disabled={loading}
              />
            </Form.Group>

            {form.noticeCategory === 'EVENT' && (
              <div className="row g-2 mb-3">
                <div className="col-12 col-sm-6">
                  <Form.Group>
                    <Form.Label className="fw-bold">이벤트 시작</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Group>
                    <Form.Label className="fw-bold">이벤트 종료</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                value={form.noticeContent}
                onChange={(e) => handleChange('noticeContent', e.target.value)}
                placeholder="내용을 입력하세요 (상세 화면은 HTML 렌더링입니다)"
                disabled={loading}
              />
            </Form.Group>

            {/* 기존 첨부파일(수정 시 표시만) */}
            {isEdit && existingAttachments.length > 0 && (
              <div className="mb-3 p-3 bg-light rounded">
                <div className="fw-bold mb-2">기존 첨부파일</div>
                {existingAttachments.map((att) => (
                  <div
                    key={att.attachmentCode}
                    className="d-flex justify-content-between align-items-center p-2 bg-white rounded mb-2"
                  >
                    <div style={{ minWidth: 0 }}>
                      <div className="fw-medium text-truncate">{att.originName}</div>
                      <small className="text-muted">다운로드 {att.downloadCount ?? 0}회</small>
                    </div>
                    <Button
                      variant="outline-success"
                      size="sm"
                      href={getAttachmentDownloadUrl(att.attachmentCode)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">첨부파일 추가</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
                disabled={loading}
              />
              {newFiles.length > 0 && (
                <small className="text-muted">선택됨: {newFiles.length}개</small>
              )}
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="success" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    처리중...
                  </>
                ) : (
                  <>
                    <FaSave className="me-1" />
                    {isEdit ? '수정 저장' : '등록'}
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <AppBar />
    </>
  );
};

export default NoticeForm;
