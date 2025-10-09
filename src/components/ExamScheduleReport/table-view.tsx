"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GroupedExamSchedules } from "@/types/schedule.types";
import { formatThaiDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { sectionTypeTranslator } from "@/utils/section";

interface Props {
  data: GroupedExamSchedules[];
  activeGroup: number | null;
  setActiveGroup: (value: number | null) => void;
  isMobile: boolean;
}

export function TableView({
  data,
  activeGroup,
  setActiveGroup,
  isMobile,
}: Props) {
  if (isMobile) {
    return (
      <div className="border rounded flex flex-col gap-3 p-2.5">
        {data.map(({ date, exams }) => (
          <div key={date}>
            {/* 🗓 Date header */}
            <div className="text-center text-xs font-semibold text-muted-foreground mb-1">
              {formatThaiDate(date)}
            </div>

            {/* Exams for this date */}
            <div className="flex flex-col gap-2">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  onMouseEnter={() =>
                    exam.groupId && setActiveGroup(exam.groupId)
                  }
                  onMouseLeave={() => setActiveGroup(null)}
                  className={cn(
                    "border rounded-lg p-3 bg-white shadow-sm text-xs transition-colors",
                    exam.isOverlap && "bg-yellow-50",
                    activeGroup &&
                      exam.groupId === activeGroup &&
                      "bg-destructive/10",
                    !exam.isOverlap &&
                      activeGroup !== exam.groupId &&
                      "hover:bg-accent/20"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">
                      {exam.subjectCode}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {sectionTypeTranslator(exam.sectionType, true)}
                    </span>
                  </div>

                  <div className="text-gray-600 mb-1">{exam.subjectNameTh}</div>

                  <div className="grid grid-cols-2 text-[11px] text-gray-700">
                    <span>
                      🕒{" "}
                      {`${String(Math.floor(exam.timeFrom / 60)).padStart(
                        2,
                        "0"
                      )}:${String(exam.timeFrom % 60).padStart(
                        2,
                        "0"
                      )} - ${String(Math.floor(exam.timeTo / 60)).padStart(
                        2,
                        "0"
                      )}:${String(exam.timeTo % 60).padStart(2, "0")}`}
                    </span>
                    <span className="text-right">
                      🏫 {exam.room || "ไม่ระบุ"}
                    </span>
                    <span>หมู่ {exam.sectionCode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={"border rounded overflow-x-auto"}>
      <Table className="text-xs min-w-[650px] sm:min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">เวลา</TableHead>
            <TableHead className="w-[100px]">รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead className="w-[60px] text-center">หมู่</TableHead>
            <TableHead className="w-[100px] text-center">ห้อง</TableHead>
            <TableHead className="w-[60px] text-center">ประเภท</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map(({ date, exams }) => (
            <React.Fragment key={date}>
              {/* 🗓 วันที่แต่ละวัน */}
              <TableRow className="bg-muted h-7 border-y">
                <TableCell
                  colSpan={7}
                  className="font-semibold text-sm text-center text-muted-foreground uppercase tracking-wide align-middle"
                >
                  {formatThaiDate(date)}
                </TableCell>
              </TableRow>

              {/* รายการสอบ */}
              {exams.map((exam) => (
                <TableRow
                  key={exam.id}
                  onMouseEnter={() =>
                    exam.groupId && setActiveGroup(exam.groupId)
                  }
                  onMouseLeave={() => setActiveGroup(null)}
                  className={cn(
                    "transition-colors duration-200 cursor-pointer",
                    exam.isOverlap && "bg-yellow-50 hover:bg-yellow-500",
                    activeGroup &&
                      exam.groupId === activeGroup &&
                      "bg-destructive/10 hover:bg-destructive/20",
                    !exam.isOverlap &&
                      activeGroup !== exam.groupId &&
                      "hover:bg-accent/20"
                  )}
                >
                  <TableCell className="whitespace-nowrap w-[100px]">
                    {`${String(Math.floor(exam.timeFrom / 60)).padStart(
                      2,
                      "0"
                    )}:${String(exam.timeFrom % 60).padStart(
                      2,
                      "0"
                    )} - ${String(Math.floor(exam.timeTo / 60)).padStart(
                      2,
                      "0"
                    )}:${String(exam.timeTo % 60).padStart(2, "0")}`}
                  </TableCell>

                  <TableCell className="w-[100px]">
                    {exam.subjectCode}
                  </TableCell>

                  <TableCell className="truncate max-w-[180px]">
                    {exam.subjectNameTh}
                  </TableCell>

                  <TableCell className="text-center w-[60px]">
                    {exam.sectionCode}
                  </TableCell>

                  <TableCell className="text-center w-[100px]">
                    {exam.room}
                  </TableCell>

                  <TableCell className="text-center text-sm font-medium w-[60px]">
                    {sectionTypeTranslator(exam.sectionType, true)}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
    // <div className="data-container border rounded w-full">
    //   {/* 🖥 Desktop Table */}
    //   {isMobile ? (

    //   ) : (
    //     /* 📱 Mobile Flat List with Date Separator */

    //   )}
    // </div>
  );
}
