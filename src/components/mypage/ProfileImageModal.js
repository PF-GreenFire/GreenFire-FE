import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { BsCamera } from "react-icons/bs";
import Cropper from "react-easy-crop";
import useProfileImageCrop from "../../hooks/useProfileImageCrop";
import { getImageUrl } from "../../utils/imageUtils";

// 기본 제공 프로필 이미지 목록
const DEFAULT_IMAGES = [
  "/profile/profile_1.png",
  "/profile/profile_2.png",
  "/profile/profile_3.png",
];

const IMAGES_PER_PAGE = 10;

const ProfileImageModal = ({
  show,
  onHide,
  nickname,
  currentImage,
  onSave,
}) => {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef(null);

  // 모달이 열릴 때 서버 이미지로 동기화
  useEffect(() => {
    if (show) {
      setSelectedImage(currentImage);
    }
  }, [show, currentImage]);

  // 이미지 미리보기 URL 변환 (서버 경로, 로컬 경로, base64 모두 지원)
  const getPreviewSrc = (image) => {
    if (!image) return "/default_profile.png";
    if (image.startsWith("/")) return image;
    return getImageUrl(image);
  };

  // Custom Hook 사용
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

  const totalPages = Math.ceil((DEFAULT_IMAGES.length + 1) / IMAGES_PER_PAGE);

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

  const handleSave = () => {
    onSave(selectedImage);
    onHide();
  };

  const handleClose = () => {
    setSelectedImage(currentImage);
    resetCrop();
    onHide();
  };

  const getPageImages = () => {
    const startIdx = currentPage * IMAGES_PER_PAGE;
    const allItems = ["camera", ...DEFAULT_IMAGES];
    return allItems.slice(startIdx, startIdx + IMAGES_PER_PAGE);
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
              aspect={1}
              cropShape="round"
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
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-lg font-semibold text-gray-800 m-0">
              {nickname}님,
            </p>
            <p className="text-lg font-semibold text-gray-800 m-0">
              프로필 이미지를 꾸며보세요
            </p>
          </div>
          <button
            className="bg-transparent border-none p-1 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-[140px] h-[140px] rounded-full border-[3px] border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            <img
              src={getPreviewSrc(selectedImage)}
              alt="프로필 미리보기"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {getPageImages().map((item, index) =>
            item === "camera" ? (
              <button
                key="camera"
                className="w-full aspect-square rounded-full border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-green-primary hover:bg-gray-50 transition-all"
                onClick={handleCameraClick}
              >
                <BsCamera size={24} className="text-gray-400" />
              </button>
            ) : (
              <button
                key={index}
                className={`w-full aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all p-0 ${
                  selectedImage === item
                    ? "border-green-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleImageSelect(item)}
              >
                <img
                  src={item}
                  alt={`프로필 ${index}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ),
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all ${
                  currentPage === index
                    ? "bg-green-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all hover:!bg-gray-100"
            onClick={handleClear}
          >
            지우기
          </button>
          <button
            className="flex-1 py-3 border-none rounded-lg bg-green-primary text-sm font-medium text-white cursor-pointer transition-all hover:!bg-green-dark"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileImageModal;
