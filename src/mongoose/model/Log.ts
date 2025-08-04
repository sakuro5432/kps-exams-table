import mongoose, { Schema, Document, Model } from "mongoose";
import { TableSource } from "../enum/TableSource";

export enum LogAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  UPDATE_EXAM = "UPDATE_EXAM",
  DELETE_EXAM = "DELETE_EXAM",
  CREATE_EXAM = "CREATE_EXAM",
  SYSTEM_ERROR = "SYSTEM_ERROR",
  USER_EXAM_NOTE_UPDATE = "USER_EXAM_NOTE_UPDATE",
  REQUEST_UPDATE_DATA = "REQUEST_UPDATE_DATA",
}

export interface ILogDocument extends Document {
  stdCode: string;
  action: LogAction;
  detail?: string;
  dataJson?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;

  pkid: string;
  tableSource: TableSource;
}

const LogSchema = new Schema<ILogDocument>(
  {
    stdCode: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: Object.values(LogAction), // บังคับให้ตรงกับ enum
    },
    pkid: { type: String },
    tableSource: {
      type: String,
      enum: Object.values(TableSource),
    },
    dataJson: { type: String },
    detail: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "logs", strict: true }
);
const LogModel: Model<ILogDocument> =
  mongoose.models.Log || mongoose.model<ILogDocument>("Log", LogSchema);
export default LogModel;
