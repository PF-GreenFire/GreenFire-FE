import { useEffect, useState, useRef, useCallback } from "react";
import { getUnreadCountAPI } from "../apis/notificationAPI";
import { useAuth } from "./useAuth";

/**
 * 안 읽은 알림 카운트를 30초 간격으로 폴링.
 * 비로그인이면 0 유지 + 호출 X.
 */
export const useUnreadNotifications = (intervalMs = 30000) => {
  const { isLoggedIn } = useAuth();
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const fetchCount = useCallback(async () => {
    if (!isLoggedIn) {
      setCount(0);
      return;
    }
    try {
      const c = await getUnreadCountAPI();
      setCount(c);
    } catch {
      // 401 등 무시
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCount();
    if (!isLoggedIn) return;

    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(fetchCount, intervalMs);
    };
    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // 탭이 보일 때만 폴링 — 백그라운드 탭은 정지
    const onVisibility = () => {
      if (document.hidden) stop();
      else { fetchCount(); start(); }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchCount, isLoggedIn, intervalMs]);

  return { count, refresh: fetchCount };
};
