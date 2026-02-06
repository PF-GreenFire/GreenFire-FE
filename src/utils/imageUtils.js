/**
 * 크롭된 이미지를 canvas로 추출하는 유틸리티 함수
 * @param {string} imageSrc - 원본 이미지 소스 (base64 또는 URL)
 * @param {Object} pixelCrop - 크롭 영역 픽셀 정보 { x, y, width, height }
 * @param {number} quality - JPEG 품질 (0-1, 기본값 0.9)
 * @returns {Promise<string>} - 크롭된 이미지의 base64 문자열
 */
export const createCroppedImage = async (
  imageSrc,
  pixelCrop,
  quality = 0.9,
) => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/jpeg", quality);
};

/**
 * 파일을 base64 문자열로 변환
 * @param {File} file - 변환할 파일
 * @returns {Promise<string>} - base64 문자열
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * base64 문자열을 File 객체로 변환
 * @param {string} base64 - base64 문자열
 * @param {string} filename - 파일명
 * @returns {File} - File 객체
 */
export const base64ToFile = (base64, filename = "image.jpg") => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * 이미지 경로를 절대 URL로 변환
 * @param {string} path - 이미지 경로 (상대 경로, base64, 또는 절대 URL)
 * @returns {string|null} - 절대 URL 또는 null
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${process.env.REACT_APP_API_URL}/${path}`;
};
