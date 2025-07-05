import axios from "axios";
import { Transaction } from "../types/finance";

const BASE_URL = "https://finance-backend-0rb2.onrender.com/api"; // Your backend URL

export const transactionService = {
  async addTransaction(transaction: Omit<Transaction, "_id">): Promise<Transaction> {
    try {
      const response = await axios.post(`${BASE_URL}/transactions`, transaction);
      console.log("✅ Transaction added:", response.data);
      return response.data; // This should be a Transaction with _id
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
      throw error;
    }
  },

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get<Transaction[]>(`${BASE_URL}/transactions`);
      console.log("✅ Transactions fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
      throw new Error("Failed to fetch transactions");
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/transactions/${id}`);
      console.log(`🗑️ Transaction ${id} deleted.`);
    } catch (error) {
      console.error(`❌ Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await axios.put(`${BASE_URL}/transactions/${id}`, updates);
      console.log(`✏️ Transaction ${id} updated:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating transaction with id ${id}:`, error);
      throw error;
    }
  }
};
