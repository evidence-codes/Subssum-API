import { Schema, model } from "mongoose";

interface IUser {
  name: String;
  email: String;
  phone: String;
  password: String;
  secret: String;
  referral: String;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    referral: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
export { IUser };
