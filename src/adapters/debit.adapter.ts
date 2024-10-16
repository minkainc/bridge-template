import { injectable } from 'inversify'
import { nanoid } from 'nanoid'
import {
  AbortResult,
  CommitResult,
  IBankAdapter,
  PrepareResult,
  ResultStatus,
  TransactionContext,
  ContextualLogger,
} from '@minka/bridge-sdk'

/**
 * Demo implementation of sync debit bank adapter.
 * Methods will log incoming transaction context and
 * return successful results.
 */
@injectable()
export class DebitBankAdapter extends IBankAdapter {
  protected logger: ContextualLogger

  constructor() {
    super()
    this.logger = new ContextualLogger({ prefixes: [this.constructor.name] })
  }

  async prepare(context: TransactionContext): Promise<PrepareResult> {
    return {
      status: ResultStatus.Prepared,
      coreId: `${nanoid(8)}`,
    }
  }

  async abort(context: TransactionContext): Promise<AbortResult> {
    return {
      status: ResultStatus.Aborted,
      coreId: `${nanoid(8)}`,
    }
  }

  async commit(context: TransactionContext): Promise<CommitResult> {
    return {
      status: ResultStatus.Committed,
    }
  }
}
