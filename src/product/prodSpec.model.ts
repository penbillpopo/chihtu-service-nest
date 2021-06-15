import * as mongoose from 'mongoose';

export const prodSpecSchema = new mongoose.Schema(
  {
    firstSpec: { type: String, required: true },
    secondSpec: { type: String, required: false },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    number: { type: String, required: true },
    specId: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface ProdSpecModel extends mongoose.Document {
  id: string;
  firstSpec: string;
  secondSpec: string|null;
  price: number;
  count: number;
  number: string;
  specId: string;
  createdAt: number;
  updatedAt: number;
}

export const ProdSpecName = 'ProdSpec';
