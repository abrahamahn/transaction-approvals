import { useCallback, useState } from "react";
import { RequestByEmployeeParams, Transaction } from "../utils/types";
import { TransactionsByEmployeeResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [ transactionsByEmployee, setTransactionsByEmployee ] = useState<Transaction[] | null>(null);
  const [ isEndOfList, setIsEndOfList ] = useState<boolean>(false);

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      );

      if (data) {
        setTransactionsByEmployee(data);
        setIsEndOfList(data.length === 0); 
      }
    },
    [fetchWithCache]
  );

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null);
    setIsEndOfList(false);
  }, []);

  return { data: transactionsByEmployee, loading, fetchById, isEndOfList, invalidateData };
}
