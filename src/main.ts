// eslint-disable-next-line import/order
import dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/.env` })

import {
  BridgeSdkBuilder,
  DataSourceOptions,
  ServerBuilder,
  TransactionProcessorBuilder,
} from '@minka/bridge-sdk'
import { LedgerSdk } from '@minka/ledger-sdk'
import { CreditAdapter } from './adapters/credit.adapter'
import { DebitAdapter } from './adapters/debit.adapter'
import { config } from './config'

const dataSourceOptions: DataSourceOptions = {
  host: config.TYPEORM_HOST,
  port: config.TYPEORM_PORT,
  database: config.TYPEORM_DATABASE,
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  connectionLimit: config.TYPEORM_CONNECTION_LIMIT,
  migrate: true,
}

const bridgeKeyPair = {
  format: 'ed25519-raw' as const,
  public: config.BRIDGE_PUBLIC_KEY,
  secret: config.BRIDGE_SECRET_KEY,
}

const ledgerSdk = new LedgerSdk({
  ledger: config.LEDGER_HANDLE,
  server: config.LEDGER_SERVER,
  signer: {
    format: 'ed25519-raw',
    public: config.LEDGER_PUBLIC_KEY,
  },
  secure: {
    aud: config.LEDGER_HANDLE,
    iss: config.BRIDGE_HANDLE,
    keyPair: bridgeKeyPair,
    sub: `bridge:${config.BRIDGE_HANDLE}`,
    exp: 3600,
  },
})

// Global bridge SDK configuration
const { container } = BridgeSdkBuilder.init()
  .useKeyPair(bridgeKeyPair)
  .useLedgerSdk(ledgerSdk)
  .useConsoleLogger(config.USE_CONSOLE_LOGGER)
  .useDataSourceOptions(dataSourceOptions)
  .build()

// Server is exposing REST API endpoints
const bootstrapServer = async () => {
  const server = ServerBuilder.init().build(container)

  await server.start({ port: config.SERVER_PORT })
}

// Transaction processors are async workers which
// are used to process debits and credits
const bootstrapProcessor = async (handle: string) => {
  const processor = TransactionProcessorBuilder.init()
    .useCreditAdapter(new CreditAdapter(ledgerSdk))
    .useDebitAdapter(new DebitAdapter(ledgerSdk))
    .build(container)

  await processor.start({ handle })
}

const bootstrap = async () => {
  await bootstrapServer()

  // You can run multiple processors on a single server
  // to better utilize available hardware resources
  for (let i = 0; i < 1; i++) {
    await bootstrapProcessor(`processor-${i}`)
  }
}

bootstrap().catch((error) => {
  console.error(error?.stack || 'Bootstrap error!')
  process.exit(1)
})
