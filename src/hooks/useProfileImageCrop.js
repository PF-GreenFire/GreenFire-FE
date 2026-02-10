import { useState, useCallback } from "react";
import { createCroppedImage, fileToBase64 } from "../utils/imageUtils";

/**
 * 프로필 이미지 크롭 관련 상태와 로직을 관리하는 Custom Hook
 */
const useProfileImageCrop = () => {
  // 크롭 모드 상태
  const [isCropMode, setIsCropMode] = useState(false);
  // 업로드된 원본 이미지
  const [uploadedImage, setUploadedImage] = useState(null);
  // 크롭 위치
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // 줌 레벨
  const [zoom, setZoom] = useState(1);
  // 크롭 영역 픽셀 정보
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /**
   * 파일 업로드 처리 - 크롭 모드 진입
   */
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    const base64 = await fileToBase64(file);
    setUploadedImage(base64);
    setIsCropMode(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  /**
   * 크롭 완료 콜백 (Cropper 컴포넌트용)
   */
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * 크롭 확인 - 크롭된 이미지 반환
   * @returns {Promise<string|null>} 크롭된 이미지 base64 또는 null
   */
  const confirmCrop = useCallback(async () => {
    if (!uploadedImage || !croppedAreaPixels) return null;

    const croppedImage = await createCroppedImage(uploadedImage, croppedAreaPixels);
    setIsCropMode(false);
    return croppedImage;
  }, [uploadedImage, croppedAreaPixels]);

  /**
   * 크롭 취소 - 크롭 모드 종료
   */
  const cancelCrop = useCallback(() => {
    setIsCropMode(false);
    setUploadedImage(null);
  }, []);

  /**
   * 상태 초기화
   */
  const resetCrop = useCallback(() => {
    setIsCropMode(false);
    setUploadedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  return {
    // 상태
    isCropMode,
    uploadedImage,
    crop,
    zoom,
    croppedAreaPixels,

    // 상태 setter
    setCrop,
    setZoom,

    // 핸들러
    handleFileUpload,
    onCropComplete,
    confirmCrop,
    cancelCrop,
    resetCrop,
  };
};

export default useProfileImageCrop;
