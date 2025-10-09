"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewMode } from "@/constant";

const COOKIE_KEY = "viewMode";

export function SelectView({
  defaultValue,
}: {
  defaultValue: keyof typeof ViewMode;
}) {
  const router = useRouter();
  const [view, setView] = useState(defaultValue);

  // Update when defaultValue changes
  useEffect(() => {
    setView(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: string) => {
    const upper = value.toUpperCase() as keyof typeof ViewMode;
    setView(upper);
    document.cookie = `${COOKIE_KEY}=${upper}; path=/; max-age=31536000`;
    router.refresh(); // 🔥 tells Next.js to re-render with new cookie
  };
  return (
    <Select value={view} onValueChange={handleChange}>
      <SelectTrigger className="max-w-96">
        <SelectValue placeholder="Display mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TABLE">ตาราง</SelectItem>
        <SelectItem value="CARD">การ์ด</SelectItem>
      </SelectContent>
    </Select>
  );
}
