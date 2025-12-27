export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: number; // 0-11
  year: number;
}
