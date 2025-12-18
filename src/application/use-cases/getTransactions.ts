import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class GetTransactions {
  constructor(private repository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.repository.getAll();
  }
}
