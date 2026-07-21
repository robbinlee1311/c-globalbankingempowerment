export type UserRole = 'admin' | 'staff' | 'user';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: string;
  created_at: string;
}