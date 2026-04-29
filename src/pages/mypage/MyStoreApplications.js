import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import { getMyApplyStoresAPI } from "../../apis/storeAPI";

const STATUS_LABEL = {
  WAITING: { text: "대기중", color: "text-yellow-700 bg-yellow-50" },
  APPROVE: { text: "승인됨", color: "text-green-700 bg-green-50" },
  REJECT: { text: "반려됨", color: "text-red-700 bg-red-50" },
  DELETE: { text: "삭제됨", color: "text-gray-500 bg-gray-100" },
};

const MyStoreApplications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [storeList, setStoreList] = useState([]);
  const [paging, setPaging] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    dispatch(getMyApplyStoresAPI({ page, limit: 10 }))
      .then((data) => {
        if (cancelled) return;
        setStoreList(data?.storeList || []);
        setPaging(data?.paging || null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, page]);

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
          내가 신청한 매장
        </h1>
      </div>

      {/* 새 신청 버튼 */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate("/store/apply")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          <FiPlus size={16} />
          새 매장 제보하기
        </button>
      </div>

      {/* 목록 */}
      <div className="px-4 pt-4">
        {loading && (
          <p className="text-center text-sm text-gray-400 py-10">
            불러오는 중...
          </p>
        )}
        {!loading && error && (
          <p className="text-center text-sm text-red-500 py-10">
            목록을 불러오지 못했습니다.
          </p>
        )}
        {!loading && !error && storeList.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">
            아직 신청한 매장이 없습니다.
          </p>
        )}

        <ul className="divide-y divide-gray-100">
          {storeList.map((store) => {
            const status = STATUS_LABEL[store.storeStatus] || {
              text: store.storeStatus,
              color: "text-gray-700 bg-gray-100",
            };
            return (
              <li
                key={store.storeCode}
                className="py-4 cursor-pointer"
                onClick={() => navigate(`/store/${store.storeCode}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {store.storeName}
                    </p>
                    {store.areaName && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {store.areaName}
                      </p>
                    )}
                    {store.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        신청일 {String(store.createdAt).slice(0, 10)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 페이지네이션 */}
      {paging && paging.maxPage > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: paging.maxPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded-full ${
                p === page
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStoreApplications;
