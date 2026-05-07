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
    intervalRef.current = setInterval(fetchCount, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [fetchCount, isLoggedIn, intervalMs]);

  return { count, refresh: fetchCount };
};
