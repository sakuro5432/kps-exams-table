import { ExamScheduleType } from "@/types/schedule.types";
import mongoose, { Model } from "mongoose";

export interface UserExam extends Document {
  stdCode: string;
  exams: ExamScheduleType[];
}

const ExamSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  room: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectNameTh: { type: String, required: true },
  dateTh: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  sectionCode: { type: String, required: true },
  sectionId: { type: Number, required: true },
  studentIdRange: { type: String, default: null },
  isTimeDuplicate: { type: Boolean, default: false },
}, { _id: false });

const UserExamSchema = new mongoose.Schema({
  stdCode: {
    type: String,
  },
  exams: {
    type: [ExamSchema], // อาร์เรย์ของ exam schedule
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

UserExamSchema.index({ createdAt: 1 }, { expires: 15 * 60 });

// STEP 3: สร้าง model แบบมี type และไม่ซ้ำซ้อน
const UserExamModel: Model<UserExam> =
  mongoose.models.UserExamSchema ||
  mongoose.model<UserExam>("UserExamSchema", UserExamSchema);
export default UserExamModel;
