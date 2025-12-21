import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class DeleteTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    return this.repo.remove(id);
  }
}
