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
      Error : {error.message}
      <Button onClick={reset}>โปรดลองใหม่อีกครั้ง</Button>
    </div>
  );
}
