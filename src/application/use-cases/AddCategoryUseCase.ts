// src/application/use-cases/AddCategoryUseCase.ts
import { defaultOffset } from "framer-motion";
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export  class AddCategoryUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(category: Category): Promise<void> {
    await this.categoryRepo.add(category);
  }
}
