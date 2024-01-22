import { LogDescription } from "ethers/lib/utils"

export type DecodedLog = LogDescription & { address: string, ordinal?: string }

export type DecodedLogs = DecodedLog[]

export type Log = {
  address: string
  topics: string[]
  data: string
  ordinal?: string
}

export type Logs = Log[]
