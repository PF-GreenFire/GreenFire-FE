// 두 좌표 간 거리(km). 입력값 누락 시 null.
export const haversineKm = (lat1, lng1, lat2, lng2) => {
  if (
    lat1 == null ||
    lng1 == null ||
    lat2 == null ||
    lng2 == null ||
    Number.isNaN(lat1) ||
    Number.isNaN(lng1) ||
    Number.isNaN(lat2) ||
    Number.isNaN(lng2)
  ) {
    return null;
  }
  const R = 6371; // 지구 반지름 (km)
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 사용자 표시용 거리 포맷
export const formatDistance = (km) => {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
};

// localStorage 캐시된 사용자 위치 읽기 (LocationMap이 저장한 것과 동일한 키)
export const getCachedLocation = () => {
  try {
    const saved = localStorage.getItem("lastKnownLocation");
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};
