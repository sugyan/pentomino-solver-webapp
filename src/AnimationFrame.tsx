import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (
  callback: () => void,
  timeout: number,
  running: boolean
) => {
  const requestId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);
  const loop = useCallback(() => {
    callback();
    requestId.current = requestAnimationFrame(() => {
      timeoutId.current = setTimeout(loop, timeout);
    });
  }, [callback, timeout]);
  useEffect(() => {
    if (running) {
      requestId.current = requestAnimationFrame(() => {
        timeoutId.current = setTimeout(loop, timeout);
      });
    }
    return () => {
      if (requestId.current !== null) {
        cancelAnimationFrame(requestId.current);
      }
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [loop, timeout, running]);
};
