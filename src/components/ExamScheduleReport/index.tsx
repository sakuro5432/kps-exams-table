"use client";
import { ExamScheduleType } from "@/types/schedule.types";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { DownloadScreenshotButton } from "../DownloadScreenshotButton";
import { envClient } from "@/env/client";
import { ExamCard } from "./exam-card";
import { Skeleton } from "../ui/skeleton";
const RequestUpdateButton = dynamic(
  () => import("../RequestUpdateButton").then((x) => x.RequestUpdateButton),
  {
    ssr: false,
    loading: () => <Skeleton />,
  }
);

interface Props {
  metadata: {
    name: string;
    stdCode: string;
    facultyNameTh: string;
    majorNameTh: string;
    studentStatusNameTh: string;
  };
  data: {
    label: string;
    items: ExamScheduleType[];
  }[];
  isRequestable: { disabled: boolean; message: string };
}
export function ExamScheduleReport({ metadata, data, isRequestable }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="space-y-5 data-container" ref={contentRef}>
      <div className="flex justify-between">
        <div>
          <div className="xl:flex md:flex gap-5">
            <p>
              ชื่อ-นามสกุล: <span className="font-medium">{metadata.name}</span>
            </p>
            <p>
              รหัสนิสิต: <span className="font-medium">{metadata.stdCode}</span>
            </p>
          </div>
          <div>
            <p>คณะ{metadata.facultyNameTh}</p>
            <p className="font-medium">
              สาขา{metadata.majorNameTh} ภาค
              {metadata.studentStatusNameTh}
            </p>
          </div>
        </div>
      </div>
      <div className="print:hidden export-hidden w-full grid grid-cols-2 xl:flex xl:justify-end gap-1">
        <RequestUpdateButton isRequestable={isRequestable} />
        <DownloadScreenshotButton contentRef={contentRef} />
      </div>
      <div className="space-y-3">
        {data.map(({ label: dateTh, items }) => (
          <div key={dateTh} className="print:break-inside-avoid">
            <h2 className="text-lg font-semibold mb-2">{dateTh}</h2>
            <div className="md:grid xl:grid grid-cols-2 gap-1 print:grid print:break-inside-avoid">
              {items.map((x) => (
                <ExamCard key={x.id} data={x} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="md:flex xl:flex items-center justify-between md:space-y-0 xl:space-y-0 space-y-1">
        <p className="font-medium text-destructive">
          คำเตือน : แนะนำให้ตรวจสอบตารางสอบด้วยตนเองอีกครั้งเพื่อความถูกต้อง!{" "}
        </p>
        <p
          className="text-xs font-medium end-credit"
          style={{ display: "none" }}
        >
          Reported by : {envClient.BASEURL}
        </p>
      </div>
    </div>
  );
}
