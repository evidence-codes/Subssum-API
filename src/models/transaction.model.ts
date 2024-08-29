import { Schema, model } from "mongoose";

interface ITransaction {
  service: string;
  amount: string;
  totalAmount: string;
  account: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
  date: Date;
  userId: string;
}

const transactionSchema = new Schema({
  service: { type: String, required: true },
  amount: { type: String, required: true },
  totalAmount: { type: String, required: true },
  account: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Initiated", "Successful", "Failed"],
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Transfer", "Wallet", "Card Payment"],
  },
  transactionId: { type: String, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
export { ITransaction };
