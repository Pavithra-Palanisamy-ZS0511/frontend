export interface TransactionHistoryInterface {
  transactionId?: number;
  date: string;
  amount: number;
  program: string;
  taxReceipt: string | null;
}

export interface MyGivingInterface {
  ytdGiving: number;
  totalGiving: number;
  supporterInYear: number;
  transactions: TransactionHistoryInterface[];
}

export interface TransactionsPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface MonthlyCommitmentResponse {
  id: string;
  lookup_id: string;
  name: string;
  transaction_type: string;
  amount: number;
  payment_method: string;
  date: string;
  details: string;
  revenue_lookup_id: string;
  revenue_type: string;
  transaction_currency_id: string;
  sort_constituent_name: string;
}

export interface MonthlyCommitmentInterface {
  isSuccess: boolean;
  message: string;
  data: {
    count: number;
    value: MonthlyCommitmentResponse[];
  };
}
