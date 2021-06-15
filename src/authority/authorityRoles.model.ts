import * as mongoose from 'mongoose';

export const AuthorityRolesSchema = new mongoose.Schema(
  {
    roles: { type: String, required: true },
    name: { type: String, required: true },
    roleLevel: { type: Number,default: 0, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export interface AuthorityRoles extends mongoose.Document {
  id: string;
  roles: string;
  name: string;
  roleLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export const RolesName = 'AuthorityRoles';
