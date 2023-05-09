import { FunctionComponent } from "react";
import { Transaction } from "../../utils/types";

export type SetTransactionApprovalFunction = (params: {
  transactionId: string
  newValue: boolean
}) => Promise<void>;

type TransactionsProps = { transactions: Transaction[] | null };

type TransactionPanelProps = {
  transaction: Transaction
  loading: boolean
  approved?: boolean
  setTransactionApproval: SetTransactionApprovalFunction
};

export type TransactionsComponent = React.FC<{
  transactions: Transaction[] | null;
  onTransactionApprovalChange: (transactionId: string, newValue: boolean) => void;
}>;

export type TransactionPanelComponent = FunctionComponent<TransactionPanelProps>;
