import { useEffect, useState } from "react";

/**
 * Detects a real desktop/PC session: fine pointer, hover support, wide viewport
 * and no mobile/tablet user agent. Tablets and phones report false, so the app
 * layout stays locked to the mobile experience for them.
 */
export const useDesktopDevice = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

    const evaluate = () => {
      const ua = navigator.userAgent;
      const isMobileUa = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|Opera Mini/i.test(ua);
      const isIpadOs =
        navigator.maxTouchPoints > 1 && /Macintosh/.test(ua) && "ontouchend" in document;
      setIsDesktop(query.matches && !isMobileUa && !isIpadOs);
    };

    evaluate();
    query.addEventListener("change", evaluate);
    window.addEventListener("resize", evaluate);
    return () => {
      query.removeEventListener("change", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return isDesktop;
};
