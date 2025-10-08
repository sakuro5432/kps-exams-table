import { ExamScheduleDataType } from "@/types/schedule.types";
import mongoose, { Model } from "mongoose";

export interface IUserExam extends Document {
  stdCode: string;
  exams: ExamScheduleDataType[];
  createdAt: Date;
}

const ExamSchema = new mongoose.Schema<ExamScheduleDataType>(
  {
    id: {
      type: String,
      required: true,
    },
    room: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectNameTh: { type: String, required: true },
    date: { type: Date, required: true },
    timeFrom: { type: Number, required: true },
    timeTo: { type: Number, required: true },
    sectionCode: { type: String, required: true },
    sectionId: { type: Number, required: true },
    // studentIdRange: { type: String, default: null },
    note: { type: String, default: null },
    sectionType: { type: String, required: true },
  },
  { _id: false }
);
// const GroupedExamScheduleSchema = new mongoose.Schema<GroupedExamSchedules>({
//   date: { type: String, required: true },
//   exams: { type: [ExamSchema], required: true },
// });
const UserExamSchema = new mongoose.Schema<IUserExam>(
  {
    stdCode: {
      type: String,
      required: true,
    },
    exams: {
      type: [ExamSchema],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false, collection: "userexams", strict: true }
);

UserExamSchema.index({ createdAt: 1 }, { expires: 15 * 60 });

// STEP 3: สร้าง model แบบมี type และไม่ซ้ำซ้อน
const UserExamModel: Model<IUserExam> =
  mongoose.models.UserExamSchema ||
  mongoose.model<IUserExam>("UserExamSchema", UserExamSchema);
export default UserExamModel;
