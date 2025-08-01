"use client";

import { Button } from "@/components/ui/button";

export default function error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <div>
        Error : {error.message}
      </div>
      <Button onClick={reset}>โปรดลองใหม่อีกครั้ง</Button>
    </div>
  );
}
