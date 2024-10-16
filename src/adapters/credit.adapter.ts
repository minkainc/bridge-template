import { nanoid } from 'nanoid'
import {
  AbortResult,
  CommitResult,
  CoreAdapter,
  PrepareResult,
  ResultStatus,
  TransactionContext,
} from '@minka/bridge-sdk'
import { LedgerSdk } from '@minka/ledger-sdk'

export class CreditAdapter extends CoreAdapter {
  constructor(protected readonly ledgerSdk: LedgerSdk) {
    super()
  }

  async prepare(context: TransactionContext): Promise<PrepareResult> {
    // Prepares the incoming operation without performing any validations
    return {
      status: ResultStatus.Prepared,
    }
  }

  async commit(context: TransactionContext): Promise<CommitResult> {
    // Commits the incoming operation without performing any validations
    // and generates a random coreId with the mint bank prefix
    return {
      status: ResultStatus.Committed,
      coreId: `mint.${nanoid(8)}`,
    }
  }

  async abort(context: TransactionContext): Promise<AbortResult> {
    // Aborts the incoming operation without performing any validations
    return {
      status: ResultStatus.Aborted,
    }
  }
}
