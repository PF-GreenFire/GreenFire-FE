import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { BsCamera } from "react-icons/bs";
import Cropper from "react-easy-crop";
import useProfileImageCrop from "../../hooks/useProfileImageCrop";
import { getImageUrl } from "../../utils/imageUtils";

// 기본 제공 커버 이미지 목록
const DEFAULT_COVERS = [
  "/images/covers/cover_1.png",
  "/images/covers/cover_2.png",
  "/images/covers/cover_3.png",
  "/images/covers/cover_4.png",
  "/images/covers/cover_5.png",
  "/images/covers/cover_6.png",
];

const CoverImageModal = ({ show, onHide, currentImage, onSave }) => {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // 모달이 열릴 때 서버 이미지로 동기화
  useEffect(() => {
    if (show) {
      setSelectedImage(currentImage);
    }
  }, [show, currentImage]);

  // 이미지 미리보기 URL 변환
  const getPreviewSrc = (image) => {
    if (!image) return null;
    if (image.startsWith("/") || image.startsWith("data:")) return image;
    return getImageUrl(image);
  };

  // 크롭 훅
  const {
    isCropMode,
    uploadedImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    handleFileUpload,
    onCropComplete,
    confirmCrop,
    cancelCrop,
    resetCrop,
  } = useProfileImageCrop();

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
    e.target.value = "";
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedImage(null);
    resetCrop();
  };

  const handleCropConfirm = async () => {
    const croppedImage = await confirmCrop();
    if (croppedImage) {
      setSelectedImage(croppedImage);
    }
  };

  const handleCropCancel = () => {
    cancelCrop();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(selectedImage);
    setIsSaving(false);
    onHide();
  };

  const handleClose = () => {
    setSelectedImage(currentImage);
    resetCrop();
    onHide();
  };

  // 크롭 모드 UI
  if (isCropMode && uploadedImage) {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered
        contentClassName="border-0 rounded-2xl overflow-hidden"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-lg font-semibold text-gray-800 m-0">
                이미지 위치 조정
              </p>
              <p className="text-sm text-gray-500 m-0">
                드래그하여 위치를 조정하세요
              </p>
            </div>
            <button
              className="bg-transparent border-none p-1 cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={handleClose}
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="relative w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden mb-4">
            <Cropper
              image={uploadedImage}
              crop={crop}
              zoom={zoom}
              aspect={16 / 5}
              cropSize={{ width: 400, height: 125 }}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-600">축소</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-primary"
            />
            <span className="text-sm text-gray-600">확대</span>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all hover:!bg-gray-100"
              onClick={handleCropCancel}
            >
              취소
            </button>
            <button
              className="flex-1 py-3 border-none rounded-lg bg-green-primary text-sm font-medium text-white cursor-pointer transition-all hover:!bg-green-dark"
              onClick={handleCropConfirm}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // 기본 모드 UI
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 rounded-2xl overflow-hidden"
    >
      <div className="p-5">
        {/* 헤더 */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-lg font-semibold text-gray-800 m-0">
              커버 이미지 변경
            </p>
            <p className="text-sm text-gray-500 m-0 mt-1">
              나만의 커버 이미지를 설정해보세요
            </p>
          </div>
          <button
            className="bg-transparent border-none p-1 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* 미리보기 */}
        <div className="mb-5 rounded-xl overflow-hidden">
          <div className="w-full h-[120px] bg-gray-100 flex items-center justify-center">
            {selectedImage ? (
              <img
                src={getPreviewSrc(selectedImage)}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-primary to-[#6B9B7A]" />
            )}
          </div>
        </div>

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {/* 카메라 버튼 */}
          <button
            className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-green-primary hover:bg-gray-50 transition-all"
            onClick={handleCameraClick}
          >
            <BsCamera size={20} className="text-gray-400" />
          </button>

          {/* 기본 이미지들 */}
          {DEFAULT_COVERS.map((image, index) => (
            <button
              key={index}
              className={`w-full aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all p-0 ${
                selectedImage === image
                  ? "border-green-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <img
                src={image}
                alt={`커버 ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/200/100?random=${index}`;
                }}
              />
            </button>
          ))}
        </div>

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all hover:!bg-gray-100"
            onClick={handleClear}
          >
            기본으로
          </button>
          <button
            className="flex-1 py-3 border-none rounded-lg bg-green-primary text-sm font-medium text-white cursor-pointer transition-all hover:!bg-green-dark"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CoverImageModal;
