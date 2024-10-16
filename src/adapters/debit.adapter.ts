import { injectable } from 'inversify'
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

@injectable()
export class DebitAdapter extends CoreAdapter {
  constructor(protected readonly ledgerSdk: LedgerSdk) {
    super()
  }

  async prepare(context: TransactionContext): Promise<PrepareResult> {
    // Prepares the incoming operation without performing any validations
    // and genrates a random coreId with the mint bank prefix
    return {
      status: ResultStatus.Prepared,
      coreId: `mint.${nanoid(8)}`,
    }
  }

  async commit(context: TransactionContext): Promise<CommitResult> {
    // Commits the incoming operation without performing any validations
    return {
      status: ResultStatus.Committed,
    }
  }

  async abort(context: TransactionContext): Promise<AbortResult> {
    // Aborts the incoming operation without performing any validations
    // and generates a random coreId for the reverse operation
    return {
      status: ResultStatus.Aborted,
      coreId: `mint.${nanoid(8)}`,
    }
  }
}
