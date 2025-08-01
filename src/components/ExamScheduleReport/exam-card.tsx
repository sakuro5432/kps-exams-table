import { ExamScheduleType } from "@/types/schedule.types";
import { Badge } from "../ui/badge";
import NoteEditor from "./NoteEditor";
import { BadgeSectionCode } from "./badge-sectionCode";
// import DeleteButton from "./DeleteButton";

interface Props {
  data: ExamScheduleType;
}
export function ExamCard({ data }: Props) {
  return (
    <div className="space-y-2.5 border rounded p-4 bg-muted mb-2 relative w-full xl:min-w-lg">
      {data.isTimeDuplicate && (
        <Badge variant={"destructive"} className="absolute -top-3 ">
          พบเวลาสอบอาจทับซ้อนกัน
        </Badge>
      )}
      <div>
        เวลา: <span className="font-semibold">{data.time}</span>
      </div>
      <div>
        รหัสวิชา: <span className="font-semibold">{data.subjectCode}</span>
      </div>

      <div className="flex items-start gap-1">
        <h1>หมู่เรียน: </h1>
        <BadgeSectionCode sectionCode={data.sectionCode} />
      </div>
      <div className="font-medium">วิชา: {data.subjectNameTh}</div>
      <div>
        ห้องสอบ: <span className="font-semibold">{data.room}</span>
      </div>
      <div className="">
        <div className="w-full">
          <div className="font-medium">Note:</div>
          <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
            {data.note || "-"}
          </p>
        </div>
        <div className="flex justify-end flex-shrink-0 space-x-1">
          {/* <DeleteButton data={data} /> */}
          <NoteEditor data={data} />
        </div>
      </div>
    </div>
  );
}
