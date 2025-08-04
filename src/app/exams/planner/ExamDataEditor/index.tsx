"use client";

import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  ChevronRightIcon,
  Pencil2Icon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { BadgeSectionCode } from "@/components/BadgeSectionCode";
import { cn } from "@/lib/utils";
import { sectionTypeTranslator } from "@/utils/section";
import dynamic from "next/dynamic";
import { useDesktop } from "@/components/useDesktop";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { resetUpdate } from "./reset";
import { toast } from "sonner";
import { UserPlannerData } from "@/types/userExamPlanner.types";
const FormEditor = dynamic(() => import("./editor").then((x) => x.FormEditor), {
  ssr: false,
});

interface Props {
  data: UserPlannerData[];
}
export function ExamDataEditor({ data }: Props) {
  const [open, setOpen] = useState(false); // for sheet
  const [mounted, setMounted] = useState(false);
  const isDesktop = useDesktop();
  const [selected, setSelected] = useState<UserPlannerData | null>(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  const onDelete = async (id: string) => {
    const v = confirm("คุณต้องการรีเซ็ตข้อมูลนี้?");
    if (v) {
      const res = await resetUpdate(id);
      if (res.code === "SUCCESS") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }
  };
  return (
    <div className="grid xl:grid-cols-2 gap-5 xl:gap-0">
      <div className="space-y-1 max-h-[70vh] overflow-y-scroll max-w-md">
        {mounted &&
          isDesktop &&
          data.map((x) =>
            renderListingCard(x, selected, setSelected, undefined, onDelete)
          )}
      </div>
      {mounted && !isDesktop && (
        <ExamDataSheet
          data={data}
          selected={selected}
          setSelected={setSelected}
          open={open}
          setOpen={setOpen}
          onDelete={onDelete}
        />
      )}
      {selected && <FormEditor data={selected} setSelected={setSelected} />}
    </div>
  );
}
function ExamDataSheet({
  data,
  selected,
  setSelected,
  open,
  setOpen,
  onDelete,
}: {
  data: UserPlannerData[];
  selected: UserPlannerData | null;
  setSelected: (x: UserPlannerData | null) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <ChevronRightIcon />
          รายวิชาทั้งหมด
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>รายวิชาทั้งหมด</SheetTitle>
          <SheetDescription>
            สามารถแก้ไขกำหนดการสอบได้เฉพาะรายวิชาที่ไม่ได้ออกประกาศโดยส่วนกลาง
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-scroll p-2.5 space-y-1 max-h-screen">
          {data.map((x) =>
            renderListingCard(x, selected, setSelected, setOpen, onDelete)
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function renderListingCard(
  x: UserPlannerData,
  selected: UserPlannerData | null,
  setSelected: (x: UserPlannerData | null) => void,
  setOpen?: (value: boolean) => void,
  onDelete?: (id: string) => void
) {
  return (
    <div
      key={x.sectionId}
      className={cn("border bg-muted rounded overflow-hidden")}
    >
      <div className="flex">
        {/* Vertical color bar */}
        <div
          className={cn(x.schedule ? "bg-green-500" : "bg-red-500", "w-1")}
        ></div>

        {/* Detail content */}
        <div className="p-2 space-y-1 flex-1">
          {process.env.NODE_ENV === "development" && <div>#{x.sectionId}</div>}
          <div>
            รหัสวิชา: <span className="font-medium">{x.subjectCode} </span>
          </div>
          <div className="font-medium">{x.subjectNameTh}</div>
          <div className="flex flex-wrap items-start gap-1">
            หมู่เรียน: <BadgeSectionCode sectionCode={x.sectionCode} />
          </div>
          <div>
            คาบ:{" "}
            <span className="font-medium">
              {sectionTypeTranslator(x.sectionType)}
            </span>
          </div>
          <div>
            ผู้สอน:{" "}
            <span className="font-medium text-nowrap">
              {x.teacherName?.replace(",", ", ") || "???"}
            </span>
          </div>
          <div className="border-t pt-1"></div>
          <div className="font-medium">ห้องสอบ: {x.schedule?.room || "-"}</div>
          <div className="font-medium">วันสอบ: {x.schedule?.dateTh || "-"}</div>
          <div className="font-medium">เวลา: {x.schedule?.time || "-"}</div>
          <div className="flex gap-1 justify-end">
            {x.schedule && (
              <Button
                variant={"destructive"}
                size={"icon"}
                onClick={() => {
                  if (onDelete) {
                    onDelete(x.id);
                  }
                }}
              >
                <ResetIcon />
              </Button>
            )}
            <Button
              variant={
                selected?.sectionId === x.sectionId ? "outline" : "default"
              }
              size={"icon"}
              onClick={() => {
                setSelected(null);
                setTimeout(() => setSelected(x), 0);
                if (setOpen) {
                  setOpen(false);
                }
              }}
              disabled={selected?.sectionId === x.sectionId}
            >
              {selected?.sectionId === x.sectionId ? (
                <CheckIcon />
              ) : (
                <Pencil2Icon />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
