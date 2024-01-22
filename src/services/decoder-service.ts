import {logger} from "../config/logger";
import {ethers} from "ethers";
import {ErrorDescription, Interface} from "@ethersproject/abi/src.ts/interface";
import type {DecodedTransaction, RawTransaction} from "../domain/transaction";
import { TransactionDescription } from "ethers/lib/utils";
import type { DecodedLogs, Logs } from "../domain/logs";
import {ContractAbis, ContractsAbis} from "../api/internal/decoderRoutes";

export class DecoderService {
  private logger = logger.registerLogger(DecoderService.name);

  constructor() {}

  public async decode(abis: ContractAbis, transaction: RawTransaction): Promise<DecodedTransaction | undefined> {
    const res = this.decodeWholeTransaction(abis.contractAbi, transaction)
    if (res) return res

    return this.decodeWholeTransaction(abis.proxyAbi, transaction);
  }

  public async decodeLogs(abis: ContractsAbis, logs: Logs): Promise<DecodedLogs | undefined> {
    const logsPerContract: { [contract: string]: Logs } = {}
    for (const log of logs) {
      (logsPerContract[log.address] ||= []).push(log);
    }

    const allDecodedLogs: DecodedLogs = []
    for (const [address, contractLogs] of Object.entries(logsPerContract)) {
      if (!abis[address]) continue

      const abi = abis[address]
      try {
        const _interface: Interface = new ethers.utils.Interface(abi.contractAbi);
        const decodedLogs = this.decodeLogsForContract(_interface, contractLogs)
        if (decodedLogs?.length) allDecodedLogs.push(...decodedLogs)
      } catch (e) {
        const _interface: Interface = new ethers.utils.Interface(abi.proxyAbi);
        const decodedLogs = this.decodeLogsForContract(_interface, contractLogs)
        if (decodedLogs?.length) allDecodedLogs.push(...decodedLogs)
      }
    }
    this.logger.debug(`Tried to decode ${logs.length} logs and successfully decoded ${allDecodedLogs.length}`)
    return allDecodedLogs
  }

  public decodeWholeTransaction(abi: string, rawTransaction: RawTransaction): DecodedTransaction | undefined {
    try {
      const _interface: Interface = new ethers.utils.Interface(abi);
      const transaction = this.decodeTransaction(_interface, rawTransaction)
      const logs = this.decodeLogsForContract(_interface, rawTransaction.logs);
      const error = this.decodeError(_interface, rawTransaction.error);
      if (!transaction && !logs && !error) return
      return { transaction, logs, error }
    } catch (e) {
      this.logger.error(`Failed to decode transaction ${rawTransaction}`, e)
    }
  }

  public decodeTransaction(_interface: Interface, transaction: RawTransaction): TransactionDescription | undefined {
    try {
      if (transaction.input && transaction.value) {
        return _interface.parseTransaction({
          data: transaction.input,
          value: transaction.value
        });
      }
    } catch (e) {
      this.logger.error(`❌ Failed to decode a transaction for contract ${transaction.to}`, e);
    }
  }

  private decodeLogsForContract(_interface: Interface, logs: Logs): DecodedLogs | undefined {
    if (!logs?.length) return

    const decodedLogs: DecodedLogs = [];
    logs.forEach(log => {
      try {
        const decodedLog = _interface.parseLog(log);
        decodedLogs.push({ ...decodedLog, address: log.address, ordinal: log.ordinal });
      } catch (e) {
        this.logger.warn(`⚠️ Unable to parse log with address ${log.address}, error:`, e);
      }
    });
    return decodedLogs?.length ? decodedLogs : undefined
  }

  private decodeError(_interface: Interface, error: any): ErrorDescription | undefined {
    try {
      if (error?.data) return _interface.parseError(error.data);
    } catch (e) {
      this.logger.warn("⚠️ Unable to parse error, using fallback, error:", e);
      return this.decodeErrorFallback(error.data)
    }
  }

  private decodeErrorFallback(errorData: string): ErrorDescription | undefined {
    try {
      // cuts 0x and function signature (4 bytes) from the beginning
      const encodedErrorString = `0x${errorData.substring(10)}`;
      const decoded = ethers.utils.defaultAbiCoder.decode(['string'], encodedErrorString);
      return { signature: decoded[0], name: decoded[0], args: [], sighash: '', errorFragment: null }
    } catch (e) {
      this.logger.warn("⚠️ Parse error fallback failed, error:", e)
    }
  }
}

export const decoderService = new DecoderService();
