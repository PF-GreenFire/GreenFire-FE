// pages/notice/NoticeForm.js
import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
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
      case 'EVENT': return 'bg-warning-light text-warning';
      case 'SYSTEM': return 'bg-info-light text-info';
      default: return 'bg-green-lighter text-admin-green';
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

  // 미리보기에서 보여줄 모든 이미지
  const previewExistingImages = existingImages.filter((img) => isImageFile(img.originName));
  const previewNewImages = filePreviews.filter((p) => p.isImage);

  return (
    <>
      <div className="max-w-[600px] mx-auto pb-[90px] bg-gray-50 min-h-screen">
        {/* 상단바 */}
        <div className="h-14 flex items-center justify-between px-5 sticky top-0 bg-white z-10 border-b border-gray-100">
          <button
            className="p-0 text-gray-900 bg-transparent border-none"
            onClick={() => (isEdit ? navigate(`/notices/${noticeCode}`) : navigate('/notices'))}
            disabled={loading}
          >
            <FaChevronLeft size={18} />
          </button>

          <div className="font-bold text-[17px] tracking-tight">
            {isEdit ? '공지사항 수정' : '공지사항 등록'}
          </div>

          <div className="w-[18px]" />
        </div>

        <div className="p-5">
          {error && (
            <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-4">
              {error}
              <button onClick={() => setError(null)} className="float-right text-danger font-bold ml-2">&times;</button>
            </div>
          )}

          {/* 입력 폼 */}
          <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="py-6 px-5">
              <div className="mb-3">
                <label className="text-[13px] font-bold text-gray-600 block mb-1">제목</label>
                <input
                  value={form.noticeTitle}
                  onChange={(e) => handleChange('noticeTitle', e.target.value)}
                  placeholder="제목을 입력하세요"
                  disabled={loading}
                  className="w-full rounded-xl py-3 px-4 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green focus:border-admin-green"
                />
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-[13px] font-bold text-gray-600 block mb-1">카테고리</label>
                  <select
                    value={form.noticeCategory}
                    onChange={(e) => handleChange('noticeCategory', e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl py-3 px-4 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                  >
                    <option value="NOTICE">공지</option>
                    <option value="EVENT">이벤트</option>
                    <option value="SYSTEM">시스템</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isImportant}
                      onChange={(e) => handleChange('isImportant', e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4 accent-danger"
                    />
                    <span className="text-[13px] font-semibold text-danger">중요</span>
                  </label>
                </div>
              </div>

              {form.noticeCategory === 'EVENT' && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="text-[13px] font-bold text-gray-600 block mb-1">시작일</label>
                    <input
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl py-2.5 px-4 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[13px] font-bold text-gray-600 block mb-1">종료일</label>
                    <input
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl py-2.5 px-4 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="text-[13px] font-bold text-gray-600 block mb-1">내용</label>
                <textarea
                  rows={10}
                  value={form.noticeContent}
                  onChange={(e) => handleChange('noticeContent', e.target.value)}
                  placeholder="내용을 입력하세요 (HTML 지원)"
                  disabled={loading}
                  className="w-full rounded-xl py-3.5 px-4 border border-gray-200 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-admin-green"
                />
              </div>

              {/* 기존 이미지 (수정 시) */}
              {isEdit && existingImages.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                  <div className="text-[13px] font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                    <FaImage size={12} />
                    <span>기존 첨부파일 ({existingImages.length})</span>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {existingImages.map((img) => (
                      <div key={img.imageCode} className="relative">
                        {isImageFile(img.originName) ? (
                          <img
                            src={getImageUrl(img.path)}
                            alt={img.originName}
                            className="w-20 h-20 object-cover rounded-[10px] border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-[10px] border border-gray-200 flex flex-col items-center justify-center bg-white">
                            <FaPaperclip size={16} className="text-gray-400" />
                            <span className="text-[9px] text-gray-400 mt-1 text-center px-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">
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
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-dashed border-gray-300">
                <div className="text-[13px] font-bold text-gray-600 mb-3">
                  파일 첨부
                </div>

                <label
                  htmlFor="file-input"
                  className={`flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-200 text-[13px] text-gray-500 transition-all duration-200 ${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'} ${newFiles.length > 0 ? 'mb-3.5' : ''}`}
                >
                  <FaImage size={14} className="text-admin-green" />
                  <span>파일 선택하기</span>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />

                {/* 선택된 파일 미리보기 */}
                {filePreviews.length > 0 && (
                  <div className="flex gap-2.5 flex-wrap">
                    {filePreviews.map((preview, idx) => (
                      <div key={idx} className="relative w-20">
                        {preview.isImage ? (
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-20 h-20 object-cover rounded-[10px] border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-[10px] border border-gray-200 flex flex-col items-center justify-center bg-white">
                            <FaPaperclip size={16} className="text-gray-400" />
                            <span className="text-[9px] text-gray-400 mt-1 text-center px-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                              {preview.name}
                            </span>
                          </div>
                        )}
                        {/* 삭제 버튼 */}
                        <div
                          onClick={() => removeNewFile(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger rounded-full flex items-center justify-center cursor-pointer shadow"
                        >
                          <FaTimes size={10} className="text-white" />
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 text-center">
                          {formatFileSize(preview.size)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 등록/수정 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-[14px] py-3.5 text-[15px] font-bold bg-admin-green text-white hover:bg-admin-green-dark transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    처리중...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaSave className="mr-1" />
                    {isEdit ? '수정 저장' : '등록'}
                  </span>
                )}
              </button>

              {/* 미리보기 버튼 */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full rounded-[14px] py-3 text-sm font-semibold mt-2.5 border-[1.5px] border-gray-300 text-gray-500 bg-white hover:bg-gray-50 transition-all"
              >
                <FaEye className="inline mr-2" size={14} />
                {showPreview ? '미리보기 닫기' : '미리보기'}
              </button>
            </div>
          </div>

          {/* 미리보기 */}
          {showPreview && (
            <div className="bg-white rounded-[20px] overflow-hidden mt-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="bg-admin-green text-white py-3 px-5 text-[13px] font-semibold flex justify-between items-center">
                <span>미리보기</span>
                <FaTimes
                  size={14}
                  className="cursor-pointer"
                  onClick={() => setShowPreview(false)}
                />
              </div>
              <div className="py-6 px-5">
                <div className="flex gap-2 mb-3.5">
                  <span className={`py-1 px-3 rounded-full text-[11px] font-semibold ${getCategoryStyle(form.noticeCategory)}`}>
                    {getCategoryName(form.noticeCategory)}
                  </span>
                  {form.isImportant && (
                    <span className="bg-danger-light text-danger py-1 px-3 rounded-full text-[11px] font-semibold">
                      중요
                    </span>
                  )}
                </div>

                <h5 className="font-bold text-gray-900 mb-4 leading-relaxed text-xl tracking-tight">
                  {form.noticeTitle || '제목 없음'}
                </h5>

                <div
                  className="text-[15px] leading-[1.85] text-gray-800 mb-5 break-keep pb-4 border-b border-gray-100"
                  dangerouslySetInnerHTML={{ __html: form.noticeContent || '<span class="text-gray-300">내용이 없습니다.</span>' }}
                />

                {/* 기존 이미지 미리보기 */}
                {previewExistingImages.map((img) => (
                  <div key={img.imageCode} className="bg-gray-50 rounded-xl overflow-hidden mb-2.5">
                    <img
                      src={getImageUrl(img.path)}
                      alt={img.originName}
                      className="w-full block rounded-xl"
                    />
                  </div>
                ))}

                {/* 새 이미지 미리보기 */}
                {previewNewImages.map((p, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden mb-2.5">
                    <img
                      src={p.url}
                      alt={p.name}
                      className="w-full block rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AppBar />
    </>
  );
};

export default NoticeForm;
