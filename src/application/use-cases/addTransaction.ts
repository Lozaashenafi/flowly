import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class AddTransaction {
  constructor(private repo: TransactionRepository) {}

  execute(tx: Transaction) {
    return this.repo.add(tx);
  }
}
