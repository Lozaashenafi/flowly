import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class GetTransactionById {
  constructor(private repo: TransactionRepository) {}

  async execute(id: string): Promise<Transaction | null> {
    return this.repo.getById(id);
  }
}
