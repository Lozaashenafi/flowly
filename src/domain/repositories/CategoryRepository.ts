import { Category } from "../entities/Category";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | undefined>;
  add(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  remove(id: string): Promise<void>;
}
