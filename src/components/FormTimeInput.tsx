"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

interface Props {
  start?: Date;
  end?: Date;
  onChange: (start: Date, end: Date) => void;
  disabled?: boolean;
  className?: string;
  minDurationMinutes?: number;
  submitCount?: number;
}

interface TimeParts {
  hours: number;
  minutes: number;
}

function parseTime(date?: Date): TimeParts {
  const d = date ? new Date(date) : new Date();
  return { hours: d.getHours(), minutes: d.getMinutes() };
}

function formatTimeValue(value: number): string {
  return value.toString().padStart(2, "0");
}

function setTime(base: Date, parts: TimeParts): Date {
  const newDate = new Date(base);
  newDate.setHours(parts.hours);
  newDate.setMinutes(parts.minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

export function FormTimeRangeInput({
  start,
  end,
  onChange,
  disabled = false,
  className,
  minDurationMinutes = 0,
  submitCount = 0,
}: Props) {
  const [startTime, setStartTime] = React.useState<TimeParts>(() =>
    parseTime(start)
  );
  const [endTime, setEndTime] = React.useState<TimeParts>(() => parseTime(end));
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const updatedStart = setTime(start ?? new Date(), startTime);
    const updatedEnd = setTime(end ?? new Date(), endTime);
    const diffMinutes =
      (updatedEnd.getTime() - updatedStart.getTime()) / 1000 / 60;
    setHasError(diffMinutes < minDurationMinutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  const updateStart = (newTime: TimeParts) => {
    if (disabled) return;
    const updatedStart = setTime(start ?? new Date(), newTime);
    const updatedEnd = setTime(end ?? new Date(), endTime);
    const diffMinutes =
      (updatedEnd.getTime() - updatedStart.getTime()) / 1000 / 60;

    const isValid = diffMinutes >= minDurationMinutes;
    setHasError(!isValid); // ✅

    if (!isValid) return;

    onChange(updatedStart, updatedEnd);
    setStartTime(newTime);
  };

  const updateEnd = (newTime: TimeParts) => {
    if (disabled) return;
    const updatedEnd = setTime(end ?? new Date(), newTime);
    const updatedStart = setTime(start ?? new Date(), startTime);
    const diffMinutes =
      (updatedEnd.getTime() - updatedStart.getTime()) / 1000 / 60;

    const isValid = diffMinutes >= minDurationMinutes;
    setHasError(!isValid); // ✅

    if (!isValid) return;

    onChange(updatedStart, updatedEnd);
    setEndTime(newTime);
  };

  const handleChange =
    (
      field: keyof TimeParts,
      updater: (val: TimeParts) => void,
      current: TimeParts
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const raw = e.target.value.replace(/\D/g, "");
      if (!raw) return;
      const num = parseInt(raw, 10);

      let validated = num;
      if (field === "hours") {
        if (num < 0) validated = 0;
        else if (num > 23) validated = 23;
      } else {
        if (num < 0) validated = 0;
        else if (num > 59) validated = 59;
      }

      updater({ ...current, [field]: validated });
    };

  const buildTimeInput = (
    label: string,
    time: TimeParts,
    updateFn: (t: TimeParts) => void
  ) => (
    <div>
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <div className="flex flex-col">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={() => updateFn({ ...time, hours: (time.hours + 1) % 24 })}
            disabled={disabled}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Input
            type="text"
            inputMode="numeric"
            value={formatTimeValue(time.hours)}
            onChange={handleChange("hours", updateFn, time)}
            className={cn(
              "w-9 text-center p-0 border focus:outline-none focus:ring-0 disabled:opacity-50",
              hasError && "border border-destructive"
            )}
            disabled={disabled}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={() =>
              updateFn({ ...time, hours: (time.hours - 1 + 24) % 24 })
            }
            disabled={disabled}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        <span className="text-sm font-medium">:</span>
        <div className="flex flex-col">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={() =>
              updateFn({ ...time, minutes: (time.minutes + 1) % 60 })
            }
            disabled={disabled}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Input
            type="text"
            inputMode="numeric"
            value={formatTimeValue(time.minutes)}
            onChange={handleChange("minutes", updateFn, time)}
            className={cn(
              "w-9 text-center p-0 border focus:outline-none focus:ring-0 disabled:opacity-50"
              //   hasError && "border border-destructive"
            )}
            disabled={disabled}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={() =>
              updateFn({ ...time, minutes: (time.minutes - 1 + 60) % 60 })
            }
            disabled={disabled}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex space-x-10 items-center">
        {buildTimeInput("เริ่มเวลา", startTime, updateStart)}
        {buildTimeInput("สิ้นสุดเวลา", endTime, updateEnd)}
      </div>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          ช่วงเวลาต้องไม่น้อยกว่า {minDurationMinutes / 60} ชั่วโมง
        </p>
      )}
    </div>
  );
}
