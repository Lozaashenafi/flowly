import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class AddTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(tx: Transaction) {
    await this.repo.add(tx);
  }
}
