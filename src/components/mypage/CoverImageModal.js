import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { BsCamera } from "react-icons/bs";

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
  const fileInputRef = useRef(null);

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
                src={selectedImage}
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
          onChange={handleFileUpload}
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
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CoverImageModal;
