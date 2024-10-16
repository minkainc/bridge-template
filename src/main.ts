import dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/.env` })

import sleep from 'sleep-promise'
import {
  ContextualLogger,
  DataSourceOptions,
  LedgerClientOptions,
  LogLevel,
  ProcessorBuilder,
  ProcessorOptions,
  ServerBuilder,
  ServerOptions,
} from '@minka/bridge-sdk'
import { CreditBankAdapter } from './adapters/credit.adapter'
import { DebitBankAdapter } from './adapters/debit.adapter'
import { config } from './config'

const logger = new ContextualLogger()
logger.appendInstancePrefix('MAIN')

const dataSource: DataSourceOptions = {
  host: config.TYPEORM_HOST,
  port: config.TYPEORM_PORT,
  database: config.TYPEORM_DATABASE,
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  connectionLimit: config.TYPEORM_CONNECTION_LIMIT,
  migrate: false,
}

const ledger: LedgerClientOptions = {
  bridge: {
    handle: config.BRIDGE_HANDLE,
    signer: {
      format: 'ed25519-raw',
      public: config.BRIDGE_PUBLIC_KEY,
      secret: config.BRIDGE_SECRET_KEY,
    },
  },
  ledger: {
    handle: config.LEDGER_HANDLE,
    signer: {
      format: 'ed25519-raw',
      public: config.LEDGER_PUBLIC_KEY,
    },
  },
  server: config.LEDGER_SERVER,
}

const bootstrapServer = async () => {
  const server = ServerBuilder.init()
    .useDataSource({ ...dataSource, migrate: true })
    .useLogger({
      logLevel: config.LOG_LEVEL as LogLevel,
      useConsoleLogger: config.USE_CONSOLE_LOGGER,
    })
    .useLedger(ledger)
    .build()

  const options: ServerOptions = {
    port: config.SERVER_PORT,
    routePrefix: 'v2',
  }

  await server.start(options)
}

const bootstrapProcessor = async (handle: string) => {
  const processor = ProcessorBuilder.init()
    .useDataSource(dataSource)
    .useLogger({
      logLevel: config.LOG_LEVEL as LogLevel,
      useConsoleLogger: config.USE_CONSOLE_LOGGER,
    })
    .useLedger(ledger)
    .useCreditAdapterClass(CreditBankAdapter)
    .useDebitAdapterClass(DebitBankAdapter)
    .build()

  const options: ProcessorOptions = {
    handle,
  }

  await processor.start(options)
}

const boostrap = async () => {
  await bootstrapServer()

  await sleep(2000) // wait for migrations to execute

  for (const idx of [0]) {
    await bootstrapProcessor(`processor-${idx}`)
  }
}

boostrap().catch((error) => {
  logger.error(error?.message || 'Bootstrap error', { error }, error?.stack)
  process.exit(1)
})
