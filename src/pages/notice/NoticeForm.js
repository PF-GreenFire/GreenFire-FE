// pages/notice/NoticeForm.js
import React, { useEffect, useMemo, useState } from 'react';
import { Container, Form, Button, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaSave, FaTimes, FaImage, FaPaperclip, FaEye } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { createNotice, updateNotice, getNoticeDetail } from '../../apis/noticeAPI';
import AppBar from '../../components/common/AppBar';

const API_URL = process.env.REACT_APP_API_URL;

const NoticeForm = ({ mode }) => {
  const navigate = useNavigate();
  const { noticeCode } = useParams();

  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({
    noticeTitle: '',
    noticeCategory: 'NOTICE',
    isImportant: false,
    startDate: '',
    endDate: '',
    noticeContent: '',
  });

  const [newFiles, setNewFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit && noticeCode) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, noticeCode]);

  // 새 파일 선택 시 미리보기 URL 생성
  useEffect(() => {
    const previews = newFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      isImage: /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name),
      url: /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name) ? URL.createObjectURL(file) : null,
    }));
    setFilePreviews(previews);

    return () => {
      previews.forEach((p) => { if (p.url) URL.revokeObjectURL(p.url); });
    };
  }, [newFiles]);

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
      setExistingImages(data.images || []);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
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

    const noticeData = {
      noticeTitle: form.noticeTitle,
      noticeCategory: form.noticeCategory,
      noticeContent: form.noticeContent,
      isImportant: form.isImportant,
    };

    if (form.noticeCategory === 'EVENT') {
      noticeData.startDate = form.startDate;
      noticeData.endDate = form.endDate;
    }

    fd.append('notice', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));

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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'EVENT': return { bg: '#FFF4E5', color: '#F57C00' };
      case 'SYSTEM': return { bg: '#E3F2FD', color: '#1976D2' };
      default: return { bg: '#E8F5E9', color: '#1E9E57' };
    }
  };

  const getCategoryName = (cat) => {
    switch (cat) {
      case 'EVENT': return '이벤트';
      case 'SYSTEM': return '시스템';
      default: return '공지';
    }
  };

  const isImageFile = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  const getImageUrl = (path) => `${API_URL}/uploads/${path}`;

  const catStyle = getCategoryStyle(form.noticeCategory);

  // 미리보기에서 보여줄 모든 이미지
  const previewExistingImages = existingImages.filter((img) => isImageFile(img.originName));
  const previewNewImages = filePreviews.filter((p) => p.isImage);

  return (
    <>
      <Container style={{ maxWidth: '600px', padding: '0', paddingBottom: '90px', background: '#F8F9FA', minHeight: '100vh' }}>
        {/* 상단바 */}
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 10,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            variant="link"
            className="p-0"
            style={{ color: '#222', textDecoration: 'none' }}
            onClick={() => (isEdit ? navigate(`/notices/${noticeCode}`) : navigate('/notices'))}
            disabled={loading}
          >
            <FaChevronLeft size={18} />
          </Button>

          <div style={{ fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>
            {isEdit ? '공지사항 수정' : '공지사항 등록'}
          </div>

          <div style={{ width: 18 }} />
        </div>

        <div style={{ padding: '20px' }}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} style={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* 입력 폼 */}
          <Card className="border-0" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <Card.Body style={{ padding: '24px 20px' }}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>제목</Form.Label>
                <Form.Control
                  value={form.noticeTitle}
                  onChange={(e) => handleChange('noticeTitle', e.target.value)}
                  placeholder="제목을 입력하세요"
                  disabled={loading}
                  style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #E0E0E0' }}
                />
              </Form.Group>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <Form.Group style={{ flex: 1 }}>
                  <Form.Label style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>카테고리</Form.Label>
                  <Form.Select
                    value={form.noticeCategory}
                    onChange={(e) => handleChange('noticeCategory', e.target.value)}
                    disabled={loading}
                    style={{ borderRadius: '12px', padding: '12px 16px', border: '1px solid #E0E0E0' }}
                  >
                    <option value="NOTICE">공지</option>
                    <option value="EVENT">이벤트</option>
                    <option value="SYSTEM">시스템</option>
                  </Form.Select>
                </Form.Group>

                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                  <Form.Check
                    type="switch"
                    id="important-switch"
                    label={<span style={{ fontSize: '13px', fontWeight: 600, color: '#DC3545' }}>중요</span>}
                    checked={form.isImportant}
                    onChange={(e) => handleChange('isImportant', e.target.checked)}
                    disabled={loading}
                  />
                </div>
              </div>

              {form.noticeCategory === 'EVENT' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <Form.Group style={{ flex: 1 }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>시작일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      disabled={loading}
                      style={{ borderRadius: '12px', border: '1px solid #E0E0E0' }}
                    />
                  </Form.Group>
                  <Form.Group style={{ flex: 1 }}>
                    <Form.Label style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>종료일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      disabled={loading}
                      style={{ borderRadius: '12px', border: '1px solid #E0E0E0' }}
                    />
                  </Form.Group>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '13px', fontWeight: 700, color: '#555' }}>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={form.noticeContent}
                  onChange={(e) => handleChange('noticeContent', e.target.value)}
                  placeholder="내용을 입력하세요 (HTML 지원)"
                  disabled={loading}
                  style={{
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                />
              </Form.Group>

              {/* 기존 이미지 (수정 시) */}
              {isEdit && existingImages.length > 0 && (
                <div style={{
                  background: '#FAFAFA',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaImage size={12} />
                    <span>기존 첨부파일 ({existingImages.length})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {existingImages.map((img) => (
                      <div key={img.imageCode} style={{ position: 'relative' }}>
                        {isImageFile(img.originName) ? (
                          <img
                            src={getImageUrl(img.path)}
                            alt={img.originName}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              border: '1px solid #E0E0E0',
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '10px',
                            border: '1px solid #E0E0E0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fff',
                          }}>
                            <FaPaperclip size={16} color="#999" />
                            <span style={{ fontSize: '9px', color: '#999', marginTop: '4px', textAlign: 'center', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                              {img.originName}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새 파일 첨부 */}
              <div style={{
                background: '#FAFAFA',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px dashed #D0D0D0',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '12px' }}>
                  파일 첨부
                </div>

                <label
                  htmlFor="file-input"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    color: '#666',
                    transition: 'all 0.2s',
                    marginBottom: newFiles.length > 0 ? '14px' : 0,
                  }}
                >
                  <FaImage size={14} color="#1E9E57" />
                  <span>파일 선택하기</span>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />

                {/* 선택된 파일 미리보기 */}
                {filePreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {filePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          width: '80px',
                        }}
                      >
                        {preview.isImage ? (
                          <img
                            src={preview.url}
                            alt={preview.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '10px',
                              border: '1px solid #E0E0E0',
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '10px',
                            border: '1px solid #E0E0E0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fff',
                          }}>
                            <FaPaperclip size={16} color="#999" />
                            <span style={{ fontSize: '9px', color: '#999', marginTop: '4px', textAlign: 'center', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                              {preview.name}
                            </span>
                          </div>
                        )}
                        {/* 삭제 버튼 */}
                        <div
                          onClick={() => removeNewFile(idx)}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '20px',
                            height: '20px',
                            background: '#DC3545',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          <FaTimes size={10} color="#fff" />
                        </div>
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', textAlign: 'center' }}>
                          {formatFileSize(preview.size)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 등록/수정 버튼 */}
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
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

              {/* 미리보기 버튼 */}
              <Button
                variant="outline-secondary"
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  width: '100%',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginTop: '10px',
                  border: '1.5px solid #D0D0D0',
                  color: '#666',
                }}
              >
                <FaEye className="me-2" size={14} />
                {showPreview ? '미리보기 닫기' : '미리보기'}
              </Button>
            </Card.Body>
          </Card>

          {/* 미리보기 */}
          {showPreview && (
            <Card className="border-0 mt-3" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                background: '#1E9E57',
                color: '#fff',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>미리보기</span>
                <FaTimes
                  size={14}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPreview(false)}
                />
              </div>
              <Card.Body style={{ padding: '24px 20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <span style={{
                    background: catStyle.bg,
                    color: catStyle.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {getCategoryName(form.noticeCategory)}
                  </span>
                  {form.isImportant && (
                    <span style={{
                      background: '#FFEBEE',
                      color: '#DC3545',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      중요
                    </span>
                  )}
                </div>

                <h5 style={{
                  fontWeight: 700,
                  color: '#111',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                  fontSize: '20px',
                  letterSpacing: '-0.3px',
                }}>
                  {form.noticeTitle || '제목 없음'}
                </h5>

                <div style={{
                  fontSize: '15px',
                  lineHeight: 1.85,
                  color: '#333',
                  marginBottom: '20px',
                  wordBreak: 'keep-all',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #F0F0F0',
                }}
                  dangerouslySetInnerHTML={{ __html: form.noticeContent || '<span style="color:#bbb">내용이 없습니다.</span>' }}
                />

                {/* 기존 이미지 미리보기 */}
                {previewExistingImages.map((img) => (
                  <div key={img.imageCode} style={{
                    background: '#F8F8F8',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}>
                    <img
                      src={getImageUrl(img.path)}
                      alt={img.originName}
                      style={{ width: '100%', display: 'block', borderRadius: '12px' }}
                    />
                  </div>
                ))}

                {/* 새 이미지 미리보기 */}
                {previewNewImages.map((p, idx) => (
                  <div key={idx} style={{
                    background: '#F8F8F8',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}>
                    <img
                      src={p.url}
                      alt={p.name}
                      style={{ width: '100%', display: 'block', borderRadius: '12px' }}
                    />
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
      </Container>

      <AppBar />
    </>
  );
};

export default NoticeForm;
