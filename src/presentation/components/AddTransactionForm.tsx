"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { IndexedDbTransactionRepository } from "../../infrastructure/repositories/IndexedDbTransactionRepository";
import { AddTransaction } from "../../application/use-cases/addTransaction";

export function AddTransactionForm() {
  const repo = new IndexedDbTransactionRepository();
  const addTx = new AddTransaction(repo);

  const [amount, setAmount] = useState("");

  const submit = async () => {
    await addTx.execute({
      id: uuid(),
      amount: Number(amount),
      type: "expense",
      category: "General",
      date: new Date().toISOString(),
      createdAt: Date.now(),
    });
  };

  return <button onClick={submit}>Add</button>;
}
