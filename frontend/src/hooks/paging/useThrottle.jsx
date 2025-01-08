import { useCallback, useRef } from "react";

export const useThrottle = (callback, delay = 1000) => {
  const lastRun = useRef(Date.now());
  const lastValue = useRef(null);
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      const now = Date.now();
      lastValue.current = args;

      if (now - lastRun.current >= delay) {
        // 딜레이 시간이 지났으면 즉시 실행
        callback(...args);
        lastRun.current = now;

        // 이전 예약된 타임아웃이 있다면 제거
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        // 이전 예약된 타임아웃이 있다면 제거
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // 마지막 변경사항을 위한 새로운 타임아웃 설정
        timeoutRef.current = setTimeout(() => {
          callback(...lastValue.current);
          lastRun.current = Date.now();
          timeoutRef.current = null;
        }, delay);
      }
    },
    [callback, delay]
  );
};
