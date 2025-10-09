"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { viewModeAtom, ViewMode } from "@/atoms/viewModeAtom";

export function SelectView() {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const handleChange = (value: string) => {
    const upper = value.toUpperCase() as ViewMode;
    setViewMode(upper);
  };

  return (
    <div className="flex items-center">
      <Select value={viewMode} onValueChange={handleChange}>
        <SelectTrigger className="max-w-96">
          แสดงผล:
          <SelectValue placeholder="โหมดการแสดงผล" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TABLE">ตาราง</SelectItem>
          <SelectItem value="CARD">การ์ด</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
