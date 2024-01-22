import { ErrorDescription, TransactionDescription } from "@ethersproject/abi/lib/interface";
import { DecodedLogs, Logs } from "./logs";

export interface TransactionError {
  data: string;
}

export interface RawTransaction {
  to: string
  input?: string
  value?: string
  logs?: Logs
  error?: TransactionError
}

export type DecodedTransaction = {
  transaction?: TransactionDescription
  logs?: DecodedLogs
  error?: ErrorDescription
}
