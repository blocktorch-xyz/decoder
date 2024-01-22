import {Request, Response} from 'express'
import Joi from 'joi';
import {router} from "../../app";
import {decoderService} from "../../services/decoder-service";
import type {DecodedTransaction, RawTransaction, TransactionError} from '../../domain/transaction';
import type {DecodedLogs, Logs} from '../../domain/logs';
import {logger} from '../../config/logger';

type DecodeTransactionPayload = {
  transaction: {
    input?: string
    value?: string
    to: string
    logs?: Logs
    error?: TransactionError
  }
}

type DecodeLogsPayload = {
  logs: Logs
}

type ErrorResponse = {
  error: string
}

export type ContractsAbis = {
  [key: string] : ContractAbis
}

export type ContractAbis = {
  contractAbi: string
  proxyAbi: string
}

const abiSchema = Joi.object({
  contractAbi: Joi.alternatives().try(
    Joi.string(),
    Joi.object().unknown(),
    Joi.array()
  ).required(),
  proxyAbi: Joi.alternatives(
    Joi.string(),
    Joi.object().unknown(),
    Joi.array()
  )
});

const logSchema = Joi.object({
  address: Joi.string().required(),
  topics: Joi.array().items(Joi.string()).required(),
  data: Joi.string().default('0x'),
  ordinal: Joi.string()
}).unknown()

const decodeTransactionSchema = Joi.object({
  abis: Joi.object().pattern(/^0x[a-fA-F0-9]{40}$/, abiSchema),
  transaction: Joi.object({
    input: Joi.string(),
    value: Joi.string(),
    to: Joi.string().required(),
    logs: Joi.array().items(logSchema),
    error: Joi.object({
      data: Joi.string().required()
    })
  }).required()
});

const decodeLogsSchema = Joi.object({
  abis: Joi.object().pattern(/^0x[a-fA-F0-9]{40}$/, abiSchema),
  logs: Joi.array().items(logSchema).required()
})

router.post("/api/internal/transaction/decode", async (req: Request<DecodeTransactionPayload>, res: Response<DecodedTransaction | ErrorResponse>) => {
  const {error, value} = decodeTransactionSchema.validate(req.body)
  if (error) {
    return res.status(400).json({error: error?.details?.[0]?.message});
  }

  const {abis, transaction} = value
  const contractAbis: ContractAbis = abis[(transaction as RawTransaction).to]
  const decodedTransaction = await decoderService.decode(contractAbis, transaction)
  if (decodedTransaction) {
    return res.status(200).json(decodedTransaction || {})
  } else {
    return res.status(500).json({error: "Failed to decode transaction"});
  }
});

router.post("/api/internal/logs/decode", async (req: Request<DecodeLogsPayload>, res: Response<{
  logs: DecodedLogs
} | ErrorResponse>) => {
  const {error, value} = decodeLogsSchema.validate(req.body)
  if (error) {
    return res.status(400).json({error: error?.details?.[0]?.message})
  }

  try {
    const {abis, logs} = value
    const decodedLogs = await decoderService.decodeLogs(abis, logs)
    if (!decodedLogs?.length) {
      logger.mainLogger.debug(`Unable to decode any logs,  body: ${JSON.stringify(value)}`)
    }
    return res.status(200).json({logs: decodedLogs})
  } catch (e) {
    return res.status(500).json({error: e})
  }
})
