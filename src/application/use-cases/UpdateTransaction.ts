import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class UpdateTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(tx: Transaction): Promise<void> {
    return this.repo.update(tx);
  }
}
