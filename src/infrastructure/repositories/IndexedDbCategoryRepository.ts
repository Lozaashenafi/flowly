// src/infrastructure/repositories/IndexedDbCategoryRepository.ts
import { getDb } from "../db/indexedDb";
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export class IndexedDbCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    const db = await getDb();
    return db.getAll("categories");
  }

  async getById(id: string): Promise<Category | undefined> {
    const db = await getDb();
    return db.get("categories", id);
  }

  async add(category: Category): Promise<void> {
    const db = await getDb();
    await db.add("categories", category);
  }

  async update(category: Category): Promise<void> {
    const db = await getDb();
    await db.put("categories", category); // put = upsert
  }

  async remove(id: string): Promise<void> {
    const db = await getDb();
    await db.delete("categories", id);
  }
}
