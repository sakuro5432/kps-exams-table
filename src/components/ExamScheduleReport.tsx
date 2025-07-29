"use client";
import { MatchedExamType } from "@/types/schedule.types";
import { Badge } from "./ui/badge";
import { useRef } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { DownloadScreenshotButton } from "./DownloadScreenshotButton";
import { envClient } from "@/env/client";
const RequestUpdateButton = dynamic(
  () => import("./RequestUpdateButton").then((x) => x.RequestUpdateButton),
  { ssr: false }
);

interface Props {
  metadata: {
    name: string;
    stdCode: string;
    facultyNameTh: string;
    majorNameTh: string;
    studentStatusNameTh: string;
  };
  data: Record<string, MatchedExamType[]>;
  isRequestable: { disabled: boolean; message: string };
}
export function ExamScheduleReport({ metadata, data, isRequestable }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const logOut = () => {
    const v = confirm("คุณต้องการออกจากระบบ?");
    if (v) {
      signOut();
    }
  };
  return (
    <div className="space-y-5 data-container" ref={contentRef}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">KPS Exams Table ✨</h1>
        <div className="space-x-1 print:hidden export-hidden">
          <Button type="button" variant={"outline"} onClick={logOut}>
            ออกจากระบบ
          </Button>
        </div>
      </div>

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
      <div className="print:hidden export-hidden w-full flex xl:justify-end gap-1">
        <RequestUpdateButton isRequestable={isRequestable} />
        <DownloadScreenshotButton contentRef={contentRef} />
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([dateTh, exams]) => (
          <div key={dateTh} className="print:break-inside-avoid">
            <h2 className="text-lg font-semibold mb-2">{dateTh}</h2>
            <div className="md:grid xl:grid grid-cols-2 gap-1 print:grid print:break-inside-avoid">
              {exams.map((x) => (
                <div
                  key={x.id}
                  className="space-y-2.5 border rounded p-4 bg-muted mb-2 relative w-full xl:min-w-lg"
                >
                  {x.isTimeDuplicate && (
                    <Badge variant={"destructive"} className="absolute -top-3 ">
                      พบเวลาสอบอาจทับซ้อนกัน
                    </Badge>
                  )}
                  <h1>
                    เวลา: <span className="font-semibold">{x.time}</span>
                  </h1>
                  <h1>
                    รหัสวิชา:{" "}
                    <span className="font-semibold">{x.subjectCode}</span>
                  </h1>

                  <div className="flex items-start gap-1">
                    <h1>หมู่เรียน: </h1>
                    {x.sectionCode.includes(",") ? (
                      <div className="space-x-1">
                        {x.sectionCode.split(",").map((k) => (
                          <Badge key={k} className="print:text-black">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge className="print:text-black">
                        {x.sectionCode}
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-medium">วิชา: {x.subjectNameTh}</h1>
                  <h1>
                    ห้องสอบ: <span className="font-semibold">{x.room}</span>
                  </h1>
                </div>
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
