import { $Enums } from "@/lib/generated/prisma";
import mongoose, { Document, Model, Schema } from "mongoose";
export interface IUserExamPlannerExam {
  id: string;
  sectionCode: string;
  sectionId: number;
  subjectNameTh: string;
  sectionType: string;
  teacherName: string | null;
  subjectCode: string;
  schedule: {
    date: Date;
    room: string;
    timeFrom: number;
    timeTo: number;
  } | null;
}

export interface IUserExamPlanner extends Document {
  stdCode: string;
  exams: IUserExamPlannerExam[];
  createdAt: Date;
}

// Schema ของ Exam ฝังในอาร์เรย์
const ExamSchema = new Schema<IUserExamPlannerExam>(
  {
    id: {
      type: String,
      required: true,
    },
    sectionCode: { type: String, required: true },
    sectionId: { type: Number, required: true },
    subjectNameTh: { type: String, required: true },
    sectionType: {
      type: String,
      enum: Object.values($Enums.SectionType), // ✅ fix here
      required: true,
    },
    teacherName: { type: String, default: null },
    subjectCode: { type: String, required: true },

    schedule: {
      type: new Schema<IUserExamPlannerExam["schedule"]>(
        {
          date: { type: Date, required: true },
          room: { type: String, required: true },
          timeFrom: { type: Number, required: true },
          timeTo: { type: Number, required: true },
        },
        { _id: false }
      ),
      required: false,
      default: null,
    },
  },
  { _id: false }
);

// Schema หลัก UserExam
const UserExamPlannerSchema = new Schema(
  {
    stdCode: { type: String, required: true },
    exams: { type: [ExamSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "userexamplanners",
    strict: true,
  }
);

UserExamPlannerSchema.index({ createdAt: 1 }, { expires: 15 * 60 });

const UserExamPlannerModel: Model<IUserExamPlanner> =
  mongoose.models.UserExamPlannerSchema ||
  mongoose.model<IUserExamPlanner>(
    "UserExamPlannerSchema",
    UserExamPlannerSchema
  );

export default UserExamPlannerModel;
