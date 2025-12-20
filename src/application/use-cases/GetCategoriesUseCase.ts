// src/application/use-cases/GetCategoriesUseCase.ts
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export class GetCategoriesUseCase {
  constructor(private categoryRepo: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepo.getAll();
  }
}
