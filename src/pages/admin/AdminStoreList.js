import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import {
  getStoresByStatusAPI,
  updateStoreStatusAPI,
  getStoreDetailAPI,
} from "../../apis/storeAPI";
import { useSelector } from "react-redux";

const STATUS_TABS = [
  { value: "WAITING", label: "대기중" },
  { value: "APPROVE", label: "승인됨" },
  { value: "REJECT", label: "반려됨" },
];

const STATUS_BADGE = {
  WAITING: "text-yellow-700 bg-yellow-50",
  APPROVE: "text-green-700 bg-green-50",
  REJECT: "text-red-700 bg-red-50",
  DELETE: "text-gray-500 bg-gray-100",
};

const AdminStoreList = () => {
  const dispatch = useDispatch();
  const { storeDetail } = useSelector((s) => s.storeReducer);

  const [statusFilter, setStatusFilter] = useState("WAITING");
  const [storeList, setStoreList] = useState([]);
  const [paging, setPaging] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStoreCode, setSelectedStoreCode] = useState(null);
  const [updating, setUpdating] = useState(false);

  const PAGE_SIZE = 10;

  const fetchList = () => {
    setLoading(true);
    setError(null);
    dispatch(
      getStoresByStatusAPI({ status: statusFilter, page, limit: PAGE_SIZE })
    )
      .then((data) => {
        setStoreList(data?.storeList || []);
        setPaging(data?.paging || null);
      })
      .catch((err) => {
        console.error(err);
        setError("매장 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  const handleSelect = (storeCode) => {
    setSelectedStoreCode(storeCode);
    dispatch(getStoreDetailAPI(storeCode));
  };

  const handleClose = () => {
    setSelectedStoreCode(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedStoreCode) return;
    const ok = window.confirm(
      `이 매장 신청을 ${
        newStatus === "APPROVE"
          ? "승인"
          : newStatus === "REJECT"
            ? "반려"
            : "삭제"
      }하시겠습니까?`
    );
    if (!ok) return;

    setUpdating(true);
    try {
      await dispatch(updateStoreStatusAPI(selectedStoreCode, newStatus));
      alert("상태가 변경되었습니다.");
      handleClose();
      fetchList();
    } catch (err) {
      console.error(err);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">매장 신청 관리</h2>

      {/* 상태 탭 */}
      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              statusFilter === tab.value
                ? "bg-admin-green text-white border-admin-green"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading && (
        <div className="text-center py-10">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      {!loading && error && (
        <p className="text-center text-sm text-red-500 py-10">{error}</p>
      )}
      {!loading && !error && storeList.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-10">
          해당 상태의 매장이 없습니다.
        </p>
      )}

      <ul className="divide-y divide-gray-100">
        {storeList.map((store) => (
          <li
            key={store.storeCode}
            className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
            onClick={() => handleSelect(store.storeCode)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {store.storeName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {store.areaName || "지역 정보 없음"}
                </p>
                {store.createdAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    신청일 {String(store.createdAt).slice(0, 10)}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                  STATUS_BADGE[store.storeStatus] || "text-gray-700 bg-gray-100"
                }`}
              >
                {store.storeStatus}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      {paging && paging.maxPage > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: paging.maxPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded-full ${
                p === page
                  ? "bg-admin-green text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* 상세 + 상태 변경 모달 */}
      <Modal
        show={!!selectedStoreCode}
        onHide={handleClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-base">매장 신청 상세</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!storeDetail ? (
            <div className="text-center py-6">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <Row label="매장명" value={storeDetail.storeName} />
              <Row
                label="카테고리"
                value={storeDetail.storeCategoryName || "-"}
              />
              <Row
                label="음식 종류"
                value={storeDetail.storeFoodType || "-"}
              />
              <Row
                label="주소"
                value={`${storeDetail.address || ""}${storeDetail.detailAddress ? ` ${storeDetail.detailAddress}` : ""}`}
              />
              <Row
                label="좌표"
                value={`${storeDetail.latitude}, ${storeDetail.longitude}`}
              />
              <Row
                label="영업시간"
                value={storeDetail.storeBusinessHours || "-"}
              />
              <Row
                label="브레이크타임"
                value={storeDetail.storeBreaktimeHours || "-"}
              />
              <Row label="전화" value={storeDetail.storePhone || "-"} />
              <Row label="웹사이트" value={storeDetail.storeLink || "-"} />
              <Row label="설명" value={storeDetail.description || "-"} />
              <Row
                label="현재 상태"
                value={
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      STATUS_BADGE[storeDetail.storeStatus] ||
                      "text-gray-700 bg-gray-100"
                    }`}
                  >
                    {storeDetail.storeStatus}
                  </span>
                }
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex gap-2">
          <button
            disabled={updating || storeDetail?.storeStatus === "APPROVE"}
            onClick={() => handleStatusChange("APPROVE")}
            className="px-4 py-1.5 rounded-full bg-green-700 text-white text-xs font-semibold disabled:opacity-50 hover:bg-green-800"
          >
            승인
          </button>
          <button
            disabled={updating || storeDetail?.storeStatus === "REJECT"}
            onClick={() => handleStatusChange("REJECT")}
            className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold disabled:opacity-50 hover:bg-red-700"
          >
            반려
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-white text-gray-700 border border-gray-300 text-xs font-semibold"
          >
            닫기
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex gap-3">
    <span className="w-24 shrink-0 text-xs text-gray-500">{label}</span>
    <span className="flex-1 text-gray-800 break-words">{value}</span>
  </div>
);

export default AdminStoreList;
