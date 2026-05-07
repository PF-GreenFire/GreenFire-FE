import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FiChevronLeft } from "react-icons/fi";
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
} from "../../apis/notificationAPI";

// type → 클릭 시 이동할 경로 빌더
const navTargetByType = (n) => {
  switch (n.type) {
    case "POST_LIKED":
    case "POST_COMMENTED":
      return n.resourceCode ? `/feed/${n.resourceCode}` : null;
    case "FOLLOWED":
      return n.actorCode ? `/user/${n.actorCode}` : null;
    case "CHALLENGE_REWARDED":
      return n.resourceCode ? `/challenges/${n.resourceCode}` : null;
    case "TIER_REACHED":
    case "BADGE_EARNED":
      return "/mypage/achievements";
    default:
      return null;
  }
};

const formatTime = (s) => {
  if (!s) return "";
  const d = new Date(s);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return d.toLocaleDateString("ko-KR");
};

const NotificationListPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNotificationsAPI({ size: 50 });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = async (n) => {
    if (!n.read) {
      markNotificationReadAPI(n.notificationCode).catch(() => {});
      setItems((prev) =>
        prev.map((x) =>
          x.notificationCode === n.notificationCode ? { ...x, read: true } : x
        )
      );
    }
    const target = navTargetByType(n);
    if (target) navigate(target);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsReadAPI();
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch {}
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-3 py-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none p-1 cursor-pointer"
        >
          <FiChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold flex-1 text-center pr-7">알림</h1>
        <button
          onClick={handleMarkAll}
          className="text-xs text-green-700 bg-transparent border-none cursor-pointer"
        >
          모두 읽음
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spinner animation="border" size="sm" variant="success" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-sm m-0">아직 알림이 없어요</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((n) => (
            <li
              key={n.notificationCode}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                !n.read ? "bg-emerald-50/40" : ""
              }`}
            >
              <span className="text-2xl flex-shrink-0">{n.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 m-0 leading-snug">
                  {n.title}
                </p>
                <p className="text-[11px] text-gray-400 m-0 mt-0.5">
                  {formatTime(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationListPage;
