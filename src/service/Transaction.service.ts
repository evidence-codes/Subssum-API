import Transaction from "../classes/Transaction";

class TransactionService {
  private readonly transaction: Transaction;
  constructor() {
    this.transaction = new Transaction();
  }

  create(data: any) {
    return this.transaction.create(data);
  }

  history(data: any) {
    return this.transaction.getTransactionHistory(data);
  }
}

export default new TransactionService();
