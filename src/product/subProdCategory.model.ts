import * as mongoose from 'mongoose';

export const subProdCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface SubProdCategoryModel extends mongoose.Document {
  id: string;
  name: string;
  parentId:string
  createdAt: number;
  updatedAt: number;
}

export const SubProdCategoryName = 'SubProdCategory';
