import { Request, Response } from "express";
import Transaction from "../service/Transaction.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export async function createTransaction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const {
      service,
      amount,
      totalAmount,
      account,
      status,
      paymentMethod,
      transactionId,
      date,
    } = req.body;

    const transaction = await Transaction.create({
      service,
      amount,
      totalAmount,
      account,
      status,
      paymentMethod,
      transactionId,
      date,
      userId,
    });

    res
      .status(200)
      .json({ message: "Transaction created successfully", transaction });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "An error occurred" });
  }
}

export async function transactionHistory(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;
    const transactions = await Transaction.history({ userId });

    res.status(200).json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "An error occurred" });
  }
}
