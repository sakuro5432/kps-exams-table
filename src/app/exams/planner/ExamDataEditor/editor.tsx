"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { schema } from "./schema";
import { useEffect, useMemo, useState, useTransition } from "react";
import { update } from "./update";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormCalendar from "@/components/FormCalendar";
import { FormTimeRangeInput } from "@/components/FormTimeInput";
import lodash from "lodash";
import { sectionTypeTranslator } from "@/utils/section";
import { minutesRangeToTimeStrings } from "@/utils/date";
import { UserExamPlannerData } from "@/types/userExamPlanner.types";
type FormValue = z.infer<typeof schema>;

interface Props {
  data: UserExamPlannerData;
  setSelected: (data: UserExamPlannerData | null) => void;
}

export function FormEditor({ data, setSelected }: Props) {
  const d = minutesRangeToTimeStrings(data.schedule?.timeFrom, data.schedule?.timeTo);
  const [isDefaultValue, setDefaultValue] = useState({
    id: data.id,
    subjectCode: data.subjectCode,
    room: data.schedule?.room || "",
    date: data.schedule?.date || "",
    timeFrom: d?.from || "09:00",
    timeTo: d?.to || "10:00",
    sectionCode: data.sectionCode,
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isDefaultValue,
  });

  const [isPending, startTransition] = useTransition();

  const formatTime = (date: Date) => date.toTimeString().slice(0, 5); // "HH:mm"
  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const timeFromWatch = form.watch("timeFrom");
  const timeToWatch = form.watch("timeTo");

  const [start, setStart] = useState(parseTime(timeFromWatch));
  const [end, setEnd] = useState(parseTime(timeToWatch));
  const isValueChange = useMemo(() => {
    return lodash.isEqual(isDefaultValue, form.watch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefaultValue, form.watch()]);

  const onSubmit = (data: FormValue) => {
    // แปลงเวลาที่กรอกเป็น Date
    const startDate = parseTime(data.timeFrom);
    const endDate = parseTime(data.timeTo);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes < 60) {
      toast.error("ช่วงเวลาต้องไม่น้อยกว่า 1 ชั่วโมง");
      return; // ไม่ส่งฟอร์ม
    }

    console.log("📦 Submitted:", data);
    startTransition(async () => {
      const res = await update(JSON.stringify(data));
      if (res.code === "SUCCESS") {
        toast.success(res.message);
        form.reset();
        setSelected(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const onReset = () => {
    form.reset();
    setStart(parseTime("09:00"));
    setEnd(parseTime("10:00"));
    setSelected(null);
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
        <Card>
          <CardHeader>
            <CardTitle>วิชา: {data.subjectNameTh}</CardTitle>
            <CardDescription className="font-medium">
              {data.subjectCode} / {sectionTypeTranslator(data.sectionType)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormInput
              control={form.control}
              schema={schema}
              name={"sectionCode"}
              label="หมู่เรียน"
              disabled
            />
            <FormInput
              control={form.control}
              schema={schema}
              name={"room"}
              label="ห้องสอบ"
              placeholder="กรอกห้องสอบ เช่น LH 3-305, LH3-305, KH 80-205 หรือ LH Dept"
            />

            <div className="grid gap-3 border rounded-xl p-2.5">
              <FormCalendar
                control={form.control}
                schema={schema}
                name={"date"}
                label="เลือกวันสอบ"
                targetMonth={10}
                disabledNavigation
              />
              <FormTimeRangeInput
                start={start}
                end={end}
                onChange={(newStart, newEnd) => {
                  setStart(newStart);
                  setEnd(newEnd);
                  form.setValue("timeFrom", formatTime(newStart));
                  form.setValue("timeTo", formatTime(newEnd));
                }}
                minDurationMinutes={60} // 60 minutes
                submitCount={form.formState.submitCount}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-1">
            <Button type="reset" variant={"outline"} disabled={isPending}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isPending || isValueChange}>
              บันทึก
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
