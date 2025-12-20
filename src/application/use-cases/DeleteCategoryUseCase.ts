// src/application/use-cases/AddCategoryUseCase.ts
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export class DeleteCategoryUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(category: Category): Promise<void> {
    await this.categoryRepo.remove(category.id);
  }
}
