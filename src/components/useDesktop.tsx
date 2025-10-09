// useDesktop.ts
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/**
 * Mobile-first check
 * Default = true (mobile)
 * Wait for mount before updating to prevent flicker
 */
export const useIsMobile = () => {
  const matches = useMediaQuery("(max-width: 767px)");
  const [isMobile, setIsMobile] = useState(true); // ✅ default mobile
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsMobile(matches);
    }
  }, [matches, mounted]);

  return { isMobile, mounted };
};
