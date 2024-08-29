import Transaction, { ITransaction } from "../models/transaction.model";

class Transactions {
  async generateTransactionId() {
    const length = 27; // Desired length of the transactionId
    let transactionId = "";

    for (let i = 0; i < length; i++) {
      // Generate a random digit (0-9)
      const randomDigit = Math.floor(Math.random() * 10);
      transactionId += randomDigit;
    }

    return transactionId;
  }

  async create(data: ITransaction) {
    try {
      const {
        service,
        amount,
        totalAmount,
        account,
        status,
        paymentMethod,
        date,
        userId,
      } = data;

      // Data validation
      if (
        !service ||
        !amount ||
        !totalAmount ||
        !account ||
        !status ||
        !paymentMethod ||
        !userId
      ) {
        throw new Error("All fields are required.");
      }
      const transaction = await this.generateTransactionId();

      const newTransaction = new Transaction({
        service,
        amount,
        totalAmount,
        account,
        status,
        paymentMethod,
        transactionId: transaction,
        date: date ? new Date(date) : new Date(),
        userId,
      });

      // Save the transaction to the database
      const savedTransaction = await newTransaction.save();

      return {
        message: "Transaction created successfully",
        transaction: savedTransaction,
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          "An error occured during transaction creation:",
          err.message
        );
        throw new Error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }
  }

  async getTransactionHistory(data: { userId: string }) {
    try {
      const { userId } = data;

      const transactions = await Transaction.find({ userId });
      return transactions;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching transaction history:", err.message);
        throw new Error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }
  }
}

export default Transactions;
