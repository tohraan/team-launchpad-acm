import { useEffect, useState } from "react";

export const useIdleDetection = (timeoutMs: number = 30000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [idleTriggered, setIdleTriggered] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      if (!idleTriggered) {
        setIsIdle(false);
        timeout = setTimeout(() => {
          setIsIdle(true);
          setIdleTriggered(true);
        }, timeoutMs);
      }
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMs, idleTriggered]);

  return { isIdle, idleTriggered };
};
