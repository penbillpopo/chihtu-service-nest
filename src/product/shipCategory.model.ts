import * as mongoose from 'mongoose';

export const shipCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface ShipCategoryModel extends mongoose.Document {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export const ShipCategoryName = 'ShipCategory';
