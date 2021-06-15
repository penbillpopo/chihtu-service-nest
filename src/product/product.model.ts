import * as mongoose from 'mongoose';

export const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firstCategory: { type: String, required: true },
    secondCategory: { type: String, required: true },
    detail: { type: String, required: true },
    hasSpec: { type: Number, required: true },
    firstSpec: { type: String, required: false },
    secondSpec: { type: String, required: false },
    price: { type: Number, required: false },
    count: { type: Number, required: false },
    number: { type: String, required: false },
    status: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface ProductModel extends mongoose.Document {
  id: string;
  name: string;
  firstCategory: string;
  secondCategory: string;
  detail: string;
  hasSpec: number;
  firstSpec: string;
  secondSpec: string;
  price: number;
  count: number;
  number: string;
  status: number;
  createdAt: number;
  updatedAt: number;
}

export const ProductName = 'Product';
