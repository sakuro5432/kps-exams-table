"use client";

import { format } from "date-fns";
import { Control, Path } from "react-hook-form";
import { Schema } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { th } from "date-fns/locale";
import { useState } from "react";

interface Props<T, K> {
  label: string;
  name: Path<T>;
  control: Control<T | any>;
  schema?: Schema<T>;
  disabledNavigation?: boolean;
  targetMonth: number; // 1 = Jan, 2 = Feb, ... 12 = Dec
}
export default function FormCalendar<T, K extends keyof T>({
  control,
  name,
  label,
  disabledNavigation = false,
  targetMonth,
}: Props<T, K>) {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);
  const defaultMonth = new Date(2025, targetMonth - 1);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            <FormMessage className="text-xs" />
          </FormLabel>
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal text-xs",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP", {
                      locale: th,
                    })
                  ) : (
                    <span>Pick a date</span>
                  )}
                  {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                month={defaultMonth}
                toDate={new Date()}
                // fromDate={new Date()}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={th}
                initialFocus
                disableNavigation={disabledNavigation}
                disabled={(date) => {
                  {
                    /*
                    (month - 1 เพราะเริ่มนับจาก 0)
                    */
                  }

                  return (
                    date.getMonth() !== targetMonth - 1 ||
                    date.getFullYear() !== 2025
                  );
                }}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
