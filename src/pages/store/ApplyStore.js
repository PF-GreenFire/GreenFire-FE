import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { FiChevronLeft } from "react-icons/fi";
import {
  getStoreCategoriesAPI,
  registApplyStoreAPI,
} from "../../apis/storeAPI";

const FOOD_TYPES = [
  { value: "", label: "선택 안 함" },
  { value: "KOREAN_FOOD", label: "한식" },
  { value: "WESTERN_FOOD", label: "양식" },
  { value: "CHINESE_FOOD", label: "중식" },
  { value: "JAPANESE_FOOD", label: "일식" },
];

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const ApplyStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeCategories } = useSelector((s) => s.storeReducer);

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [pin, setPin] = useState(null);
  const [address, setAddress] = useState("");
  const [form, setForm] = useState({
    storeName: "",
    storeCategoryCode: "",
    storeFoodType: "",
    storeBusinessHours: "",
    storeBreaktimeHours: "",
    storePhone: "",
    storeLink: "",
    detailAddress: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!storeCategories || storeCategories.length === 0) {
      dispatch(getStoreCategoriesAPI());
    }
  }, [dispatch, storeCategories]);

  // 진입 시 내 위치로 지도 중심 이동
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const reverseGeocode = (lat, lng) => {
    const { kakao } = window;
    if (!kakao?.maps?.services) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const road = result[0].road_address?.address_name;
        const lot = result[0].address?.address_name;
        setAddress(road || lot || "");
      }
    });
  };

  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat();
    const lng = latlng.getLng();
    setPin({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!pin) return "지도를 클릭해서 매장 위치를 선택해주세요.";
    if (!form.storeName.trim()) return "매장명을 입력해주세요.";
    if (!form.storeCategoryCode) return "카테고리를 선택해주세요.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const payload = {
      storeName: form.storeName.trim(),
      storeStatus: "WAITING",
      storePhone: form.storePhone.trim() || null,
      storeLink: form.storeLink.trim() || null,
      storeBusinessHours: form.storeBusinessHours.trim() || null,
      storeBreaktimeHours: form.storeBreaktimeHours.trim() || null,
      storeCategoryCode: Number(form.storeCategoryCode),
      storeFoodType: form.storeFoodType || null,
      detailAddress: form.detailAddress.trim() || null,
      description: form.description.trim() || null,
      location: {
        address,
        latitude: pin.lat,
        longitude: pin.lng,
      },
    };

    setSubmitting(true);
    try {
      await dispatch(registApplyStoreAPI(payload));
      alert("매장 신청이 접수되었습니다. 관리자 승인 후 지도에 표시됩니다.");
      navigate("/mypage/store-applications");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "신청 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none p-1 cursor-pointer"
        >
          <FiChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold flex-1 text-center pr-7">
          초록불 매장 제보
        </h1>
      </div>

      {/* 지도 - 위치 선택 */}
      <div className="px-4 pt-4">
        <p className="text-sm font-semibold mb-2">
          1. 지도에서 매장 위치를 선택해주세요
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <Map
            center={pin || center}
            style={{ width: "100%", height: "240px" }}
            level={4}
            onClick={handleMapClick}
          >
            {pin && (
              <MapMarker
                position={pin}
                title="신청 위치"
              />
            )}
          </Map>
        </div>
        {address && (
          <p className="text-xs text-gray-600 mt-2">
            <span className="text-green-700 font-semibold">선택된 주소: </span>
            {address}
          </p>
        )}
      </div>

      {/* 폼 */}
      <div className="px-4 pt-6 space-y-4">
        <p className="text-sm font-semibold">2. 매장 정보를 입력해주세요</p>

        <Field label="매장명 *">
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            placeholder="예: 초록 카페"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="카테고리 *">
          <select
            name="storeCategoryCode"
            value={form.storeCategoryCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-green-700"
          >
            <option value="">선택해주세요</option>
            {(storeCategories || []).map((c) => (
              <option key={c.categoryCode} value={c.categoryCode}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="음식 종류 (해당 시)">
          <select
            name="storeFoodType"
            value={form.storeFoodType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-green-700"
          >
            {FOOD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="상세 주소 (동/호수 등)">
          <input
            name="detailAddress"
            value={form.detailAddress}
            onChange={handleChange}
            placeholder="예: 2층"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="영업시간">
          <input
            name="storeBusinessHours"
            value={form.storeBusinessHours}
            onChange={handleChange}
            placeholder="예: 매일 09:00 - 21:00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="브레이크타임">
          <input
            name="storeBreaktimeHours"
            value={form.storeBreaktimeHours}
            onChange={handleChange}
            placeholder="예: 15:00 - 17:00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="전화번호">
          <input
            name="storePhone"
            value={form.storePhone}
            onChange={handleChange}
            placeholder="02-1234-5678"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="웹사이트">
          <input
            name="storeLink"
            value={form.storeLink}
            onChange={handleChange}
            placeholder="https://"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700"
          />
        </Field>

        <Field label="설명">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="이 매장이 친환경적으로 운영되는 점을 알려주세요."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-green-700"
          />
        </Field>
      </div>

      {/* 제출 */}
      <div className="px-4 mt-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-green-700 text-white rounded-full py-3 text-sm font-semibold disabled:opacity-50 hover:bg-green-800 transition-colors"
        >
          {submitting ? "제출 중..." : "신청하기"}
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          관리자 승인 후 지도에 표시됩니다.
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default ApplyStore;
