import React, { useState, useEffect } from 'react';
import { Spinner, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from '../../apis/bannerAPI';
import { getImageUrl } from '../../utils/imageUtils';

const initialForm = {
  bannerTitle: '',
  linkUrl: '',
  displayOrder: 0,
  isActive: true,
};

const AdminBannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모달
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBanners();
      setBanners(data);
    } catch (err) {
      console.error(err);
      setError('배너를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setForm(initialForm);
    setFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setForm({
      bannerTitle: banner.bannerTitle || '',
      linkUrl: banner.linkUrl || '',
      displayOrder: banner.displayOrder ?? 0,
      isActive: banner.isActive ?? true,
    });
    setFile(null);
    setPreview(banner.imageUrl ? getImageUrl(banner.imageUrl) : null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    if (!form.bannerTitle.trim()) {
      alert('배너 제목을 입력하세요.');
      return;
    }
    if (!editingBanner && !file) {
      alert('배너 이미지를 선택하세요.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      const bannerJson = new Blob([JSON.stringify({
        bannerTitle: form.bannerTitle,
        linkUrl: form.linkUrl || null,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      })], { type: 'application/json' });
      formData.append('banner', bannerJson);

      if (file) {
        formData.append('file', file);
      }

      if (editingBanner) {
        await updateBanner(editingBanner.bannerCode, formData);
        alert('배너가 수정되었습니다.');
      } else {
        await createBanner(formData);
        alert('배너가 등록되었습니다.');
      }

      setShowModal(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(editingBanner ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bannerCode) => {
    const ok = window.confirm('정말 삭제할까요? 삭제 후 복구할 수 없습니다.');
    if (!ok) return;
    try {
      await deleteBanner(bannerCode);
      setBanners(prev => prev.filter(b => b.bannerCode !== bannerCode));
      alert('삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-5">
        <h5 className="font-extrabold m-0 text-lg text-gray-900">
          배너 관리
        </h5>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-admin-green text-white border-none rounded-full py-2 px-5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-admin-green-dark"
        >
          <FaPlus size={12} /> 등록
        </button>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right text-danger font-bold ml-2">&times;</button>
        </div>
      )}

      {/* 배너 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {banners.map((banner) => (
          <div
            key={banner.bannerCode}
            className="bg-white rounded-2xl py-[18px] px-5 shadow-card transition-all duration-200 relative hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="flex gap-4 items-center">
              {/* 이미지 미리보기 */}
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                style={{ width: 120, height: 68 }}
              >
                {banner.imageUrl ? (
                  <img
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.bannerTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`py-0.5 px-2.5 rounded-full text-[11px] font-semibold ${
                    banner.isActive
                      ? 'bg-green-lighter text-admin-green'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {banner.isActive ? '활성' : '비활성'}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    순서: {banner.displayOrder}
                  </span>
                </div>
                <h6 className="text-[14px] font-semibold text-gray-900 mb-0 truncate">
                  {banner.bannerTitle}
                </h6>
                {banner.linkUrl && (
                  <p className="text-[11px] text-gray-400 mb-0 truncate mt-0.5">
                    {banner.linkUrl}
                  </p>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEditModal(banner)}
                  title="수정"
                  className="w-8 h-8 rounded-[10px] border-none bg-green-lighter text-admin-green flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-admin-green hover:text-white"
                >
                  <FaEdit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(banner.bannerCode)}
                  title="삭제"
                  className="w-8 h-8 rounded-[10px] border-none bg-danger-light text-danger flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-danger hover:text-white"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      {!loading && banners.length === 0 && (
        <div className="text-center py-[60px] px-5 text-gray-400">
          <div className="text-[48px] mb-4">
            <span role="img" aria-label="empty">🖼️</span>
          </div>
          <p className="m-0 text-sm">등록된 배너가 없습니다.</p>
        </div>
      )}

      {/* 등록/수정 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: 700 }}>
            {editingBanner ? '배너 수정' : '배너 등록'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 이미지 */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              배너 이미지 {!editingBanner && <span className="text-danger">*</span>}
            </label>
            {preview && (
              <div className="mb-2 rounded-lg overflow-hidden" style={{ maxHeight: 160 }}>
                <img
                  src={preview}
                  alt="미리보기"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-lighter file:text-admin-green hover:file:bg-green-100"
            />
          </div>

          {/* 제목 */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              제목 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.bannerTitle}
              onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })}
              placeholder="배너 제목"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-admin-green"
            />
          </div>

          {/* 링크 URL */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              링크 URL
            </label>
            <input
              type="text"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="https://example.com (선택)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-admin-green"
            />
          </div>

          {/* 순서 + 활성 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                표시 순서
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-admin-green"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                활성 여부
              </label>
              <select
                value={form.isActive ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-admin-green"
              >
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', padding: '12px 20px 20px' }}>
          <button
            onClick={() => setShowModal(false)}
            className="border border-gray-200 bg-white text-gray-600 rounded-full py-2 px-5 text-[13px] font-semibold cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-admin-green text-white border-none rounded-full py-2 px-5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-admin-green-dark disabled:opacity-50"
          >
            {submitting ? '저장 중...' : editingBanner ? '수정' : '등록'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBannerList;
