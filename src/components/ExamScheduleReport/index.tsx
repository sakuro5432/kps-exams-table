"use client";
import {
  ExamScheduleDataType,
  // GroupedExamSchedules,
} from "@/types/schedule.types";
import React, { useRef, useState } from "react";
// import dynamic from "next/dynamic";
import { DownloadScreenshotButton } from "../DownloadScreenshotButton";
import { envClient } from "@/env/client";
import { CardView } from "./card-view";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
// import { Skeleton } from "../ui/skeleton";
import { FrameIcon } from "@radix-ui/react-icons";
import { formatThaiDate } from "@/utils/date";
import { groupByDate } from "@/lib/filter";
import { cn } from "@/lib/utils";
import { SelectView } from "./SelectView";
import { ViewMode } from "@/constant";
import { TableView } from "./table-view";
import { useIsMobile } from "../useDesktop";
import { useAtomValue } from "jotai";
import { viewModeAtom } from "@/atoms/viewModeAtom";
// const RequestUpdateButton = dynamic(
//   () => import("../RequestUpdateButton").then((x) => x.RequestUpdateButton),
//   {
//     ssr: false,
//     loading: () => <Skeleton />,
//   }
// );

interface Props {
  metadata: {
    name: string;
    stdCode: string;
    facultyNameTh: string;
    majorNameTh: string;
    studentStatusNameTh: string;
  };
  data: ExamScheduleDataType[];
  // isRequestable: { disabled: boolean; message: string };
}
export function ExamScheduleReport({ metadata, data }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const { isMobile, mounted } = useIsMobile();
  const viewMode = useAtomValue(viewModeAtom);
  return (
    <div ref={contentRef} className="data-container space-y-5">
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
      {mounted && (
        <>
          <div className="print:hidden export-hidden w-full flex flex-col xl:flex-row xl:justify-end gap-2">
            <SelectView />
            <div className="flex w-full gap-2 xl:w-auto">
              {/* <div className="w-1/2 xl:w-auto">
            <RequestUpdateButton isRequestable={isRequestable} />
          </div> */}
              <Link
                href="/exams/planner"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                <FrameIcon className="mr-2" />
                จัดตารางสอบ
              </Link>
            </div>
            <div className="w-full xl:w-fit">
              <DownloadScreenshotButton contentRef={contentRef} />
            </div>
          </div>
          {data.length === 0 && (
            <div className="text-center space-y-1">
              <p className="text-xl font-medium">
                ไม่พบรายวิชาที่มีต้องสอบในขณะนี้
              </p>
              <p className="text-destructive">
                หากสาขาของคุณมีการจัดสอบ
                <br />
                สามารถจัดตารางสอบได้ด้วยตนเองที่ปุ่ม{" "}
                <span className="font-semibold">“จัดตารางสอบ”</span>
              </p>
            </div>
          )}
          {data.length > 0 && (
            <div className={"space-y-5"}>
              {viewMode === "TABLE" ? (
                <TableView
                  data={groupByDate(data)}
                  activeGroup={activeGroup}
                  setActiveGroup={setActiveGroup}
                  isMobile={isMobile}
                />
              ) : (
                <div className="space-y-3">
                  {groupByDate(data).map(({ date, exams }) => (
                    <div
                      key={date.toString()}
                      className="print:break-inside-avoid"
                    >
                      <h2 className="text-lg font-semibold mb-2">
                        {formatThaiDate(date)}
                      </h2>
                      <div className="md:grid xl:grid grid-cols-2 gap-1 print:grid print:break-inside-avoid">
                        {exams.map((x) => (
                          <div key={x.id}>
                            <CardView
                              key={x.id}
                              data={x}
                              activeGroup={activeGroup}
                              setActiveGroup={setActiveGroup}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="md:flex xl:flex items-center justify-between md:space-y-0 xl:space-y-0 space-y-1">
                <p className="font-medium text-destructive">
                  คำเตือน :
                  แนะนำให้ตรวจสอบตารางสอบด้วยตนเองอีกครั้งเพื่อความถูกต้อง!{" "}
                </p>
                <p
                  className="text-xs font-medium end-credit"
                  style={{ display: "none" }}
                >
                  Reported by : {envClient.BASEURL}
                </p>
              </div>
              <div className="export-hidden">
                <Link
                  href={
                    "https://ead.kps.ku.ac.th/2025/index.php/nisit-m/exam-menu/5-first-exam/73-prakas-mk-kphs-reuxng-tarang-sxbli-praca-phakh-tn-pi-kar-suksa-2568-lng-wan-thi-22-kanyayn-2568?tmpl=component"
                  }
                  target="_blank"
                  className="underline"
                >
                  ตารางกลาง
                </Link>
                ,
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
