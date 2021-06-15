import * as mongoose from 'mongoose';

export const prodCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    secondCategory: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface ProdCategoryModel extends mongoose.Document {
  id: string;
  name: string;
  secondCategory: string;
  createdAt: number;
  updatedAt: number;
}

export const ProdCategoryName = 'ProdCategory';
