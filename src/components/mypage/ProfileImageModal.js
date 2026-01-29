import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { BsCamera } from "react-icons/bs";

// 기본 제공 프로필 이미지 목록
const DEFAULT_IMAGES = [
  "/profile/profile_1.png",
  "/profile/profile_2.png",
  "/profile/profile_3.png",
  "/profile/profile_4.png",
  "/profile/profile_5.png",
  "/profile/profile_6.png",
  "/profile/profile_7.png",
  "/profile/profile_8.png",
  "/profile/profile_9.png",
  "/profile/profile_10.png",
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

  const totalPages = Math.ceil((DEFAULT_IMAGES.length + 1) / IMAGES_PER_PAGE);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedImage(null);
  };

  const handleSave = () => {
    onSave(selectedImage);
    onHide();
  };

  const handleClose = () => {
    setSelectedImage(currentImage);
    onHide();
  };

  // 현재 페이지에 표시할 이미지들
  const getPageImages = () => {
    const startIdx = currentPage * IMAGES_PER_PAGE;
    const allItems = ["camera", ...DEFAULT_IMAGES];
    return allItems.slice(startIdx, startIdx + IMAGES_PER_PAGE);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="border-0 rounded-2xl overflow-hidden"
    >
      <div className="p-5">
        {/* 헤더 */}
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

        {/* 미리보기 */}
        <div className="flex justify-center mb-6">
          <div className="w-[140px] h-[140px] rounded-full border-[3px] border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/default_profile.png"
                alt="기본 프로필"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-5 gap-2 mb-4">
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
            )
          )}
        </div>

        {/* 페이지네이션 */}
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

        {/* 숨겨진 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* 버튼 영역 */}
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
