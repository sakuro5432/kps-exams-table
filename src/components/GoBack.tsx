"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  params?: { pageIndex?: string; pageSize?: string };
  showText?: boolean;
  text?: string;
}

export default function GoBack({
  params,
  showText = false,
  text = "กลับหน้าก่อนหน้า",
}: Props) {
  // const router = useRouter();
  const pathname = usePathname();

  function getPreviousPath(url: string) {
    const parts = url.split("/").filter(Boolean);
    const basePath =
      parts.length > 1 ? "/" + parts.slice(0, -1).join("/") : "/";
    const queryParams = new URLSearchParams(params).toString();
    return queryParams ? `${basePath}?${queryParams}` : basePath;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={!showText ? "icon" : "default"}
      onClick={() => (window.location.href = getPreviousPath(pathname))}
    >
      <ChevronLeftIcon className={cn(showText && "mr-2")} />
      {showText ? text : null}
    </Button>
  );
}
