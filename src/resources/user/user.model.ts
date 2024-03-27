import { generateAlphanumeric, log } from "@/utils/index";
import argon2 from "argon2";
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  verificationCode: string;
  verified: boolean;
  recoveryCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userType: "admin" | "user";
  validatePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verificationCode: { type: String, default: () => generateAlphanumeric(16) },
    recoveryCode: { type: String },
    verified: { type: Boolean, default: false },
    userType: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (e: any) {
    log.error(e, "Could not validate password");
    return false;
  }
};

const User = model<IUser>("User", UserSchema);

export default User;
