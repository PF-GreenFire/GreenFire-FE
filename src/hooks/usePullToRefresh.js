import { useState, useEffect, useRef, useCallback } from "react";

const MAX_PULL = 120;
const THRESHOLD = 60;
const RESISTANCE = 0.4;

const usePullToRefresh = (onRefresh) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);

  const handleRefreshDone = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (isRefreshing) return;
      if (window.scrollY <= 0) {
        startYRef.current = e.touches[0].clientY;
        pullingRef.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pullingRef.current || isRefreshing) return;
      const diff = e.touches[0].clientY - startYRef.current;
      if (diff > 0 && window.scrollY <= 0) {
        const distance = Math.min(diff * RESISTANCE, MAX_PULL);
        setPullDistance(distance);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      if (pullDistance >= THRESHOLD && !isRefreshing) {
        handleRefreshDone();
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, handleRefreshDone]);

  return { pullDistance, isRefreshing };
};

export default usePullToRefresh;
