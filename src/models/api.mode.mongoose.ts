import { Schema, Types } from "mongoose";

export interface API {
  _id: Types.ObjectId;
  api: string;
  method: string;
  date: {
    start: Date;
    end: Date;
  };
}

export const api = new Schema<API>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  api: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  date: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
    },
  },
});
