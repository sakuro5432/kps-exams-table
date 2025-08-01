import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export const useDesktop = () => {
  const isClient = typeof window !== "undefined";
  const matches = useMediaQuery("(min-width: 768px)");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (isClient) {
      setIsDesktop(matches);
    }
  }, [matches, isClient]);

  return isClient ? isDesktop : false;
};
