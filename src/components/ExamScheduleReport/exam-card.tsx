import { ExamScheduleDataType } from "@/types/schedule.types";
import NoteEditor from "./NoteEditor";
import { BadgeSectionCode } from "../BadgeSectionCode";
import { sectionTypeTranslator } from "@/utils/section";
import { formatTimeRange } from "@/utils/date";
import { cn } from "@/lib/utils";
import { envClient } from "@/env/client";

interface Props {
  data: ExamScheduleDataType & { groupId: number | null; isOverlap: boolean };
  activeGroup: number | null;
  setActiveGroup: (value: number | null) => void;
}
export function ExamCard({ data, activeGroup, setActiveGroup }: Props) {
  return (
    <div
      className={cn(
        "space-y-2.5 border rounded p-4 bg-muted mb-2 relative w-full xl:min-w-lg transition",
        activeGroup && data.groupId === activeGroup
          ? "bg-destructive/10 border-destructive"
          : data.isOverlap && "bg-yellow-50 border-yellow-500"
      )}
      onMouseEnter={() => data.groupId && setActiveGroup(data.groupId)}
      onMouseLeave={() => setActiveGroup(null)}
    >
      {envClient.NODE_ENV === "development" && <div>#{data.sectionId}</div>}
      <div>
        เวลา:{" "}
        <span className="font-semibold">
          {formatTimeRange(data.timeFrom, data.timeTo)}
        </span>
      </div>
      <div>
        ห้องสอบ: <span className="font-semibold">{data.room}</span>
      </div>
      <div>
        รหัสวิชา: <span className="font-semibold">{data.subjectCode}</span>
      </div>
      <div className="font-medium">วิชา: {data.subjectNameTh}</div>
      <div className="flex items-start gap-1">
        <h1>หมู่เรียน: </h1>
        <BadgeSectionCode sectionCode={data.sectionCode} />
      </div>
      <div>
        รูปแบบการสอบ:{" "}
        <span className="font-medium">
          {sectionTypeTranslator(data.sectionType, true)}
        </span>
      </div>
      <div className="border-1"></div>
      <div className="">
        <div className="w-full">
          <div className="font-medium">Note:</div>
          <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
            {data.note || "-"}
          </p>
        </div>
        <div className="flex justify-end flex-shrink-0 space-x-1">
          <NoteEditor data={data} />
        </div>
      </div>
    </div>
  );
}
