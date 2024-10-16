import { Account } from './account'
import { UnknownAccountError } from './errors'
import { Transaction } from './transaction'

export class Ledger {
  accounts = new Map<string, Account>()
  transactions: Transaction[] = []

  constructor() {
    // account with no balance
    this.accounts.set('1001001001', new Account('1001001001'))

    // account with available balance 70
    this.accounts.set('1001001002', new Account('1001001002'))
    this.credit('1001001002', 100)
    this.debit('1001001002', 10)
    this.hold('1001001002', 20)

    // account with no available balance
    this.accounts.set('1001001003', new Account('1001001003'))
    this.credit('1001001003', 300)
    this.debit('1001001003', 200)
    this.hold('1001001003', 100)

    // inactive account
    this.accounts.set('1001001004', new Account('1001001004'))
    this.credit('1001001004', 100)
    this.debit('1001001004', 20)
    this.inactivate('1001001004')
  }

  getAccount(accountId: string) {
    const account = this.accounts.get(accountId)
    if (!account) {
      throw new UnknownAccountError(`Account ${accountId} does not exist`)
    }
    return account
  }

  processTransaction(
    type: string,
    accountId: string,
    amount: number,
    idempotencyToken?: string,
  ) {
    if (idempotencyToken) {
      const existing = this.transactions.filter(
        (t) => t.idempotencyToken === idempotencyToken,
      )[0]
      if (existing) {
        return existing
      }
    }

    const nextTransactionId = this.transactions.length
    const transaction = new Transaction({
      id: nextTransactionId.toString(),
      type,
      account: accountId,
      amount,
      status: 'PENDING',
      idempotencyToken,
    })
    this.transactions[nextTransactionId] = transaction
    try {
      const account = this.getAccount(accountId)
      switch (type) {
        case 'CREDIT':
          account.credit(amount)
          break
        case 'DEBIT':
          account.debit(amount)
          break
        case 'HOLD':
          account.hold(amount)
          break
        case 'RELEASE':
          account.release(amount)
          break
      }
    } catch (error: any) {
      transaction.errorReason = error.message
      transaction.errorCode = error.code
      transaction.status = 'FAILED'
      return transaction
    }
    transaction.status = 'COMPLETED'
    return transaction
  }

  credit(accountId: string, amount: number, idempotencyToken?: string) {
    return this.processTransaction(
      'CREDIT',
      accountId,
      amount,
      idempotencyToken,
    )
  }

  debit(accountId: string, amount: number, idempotencyToken?: string) {
    return this.processTransaction('DEBIT', accountId, amount, idempotencyToken)
  }

  hold(accountId: string, amount: number, idempotencyToken?: string) {
    return this.processTransaction('HOLD', accountId, amount, idempotencyToken)
  }

  release(accountId: string, amount: number, idempotencyToken: string) {
    return this.processTransaction(
      'RELEASE',
      accountId,
      amount,
      idempotencyToken,
    )
  }

  activate(accountId: string) {
    return this.getAccount(accountId).setActive(true)
  }

  inactivate(accountId: string) {
    return this.getAccount(accountId).setActive(false)
  }

  printAccountTransactions(accountId: string) {
    console.log(
      `Id\t\tType\t\tAccount\t\tAmount\t\tStatus\t\t\tError Reason\t\tIdempotency Token`,
    )
    this.transactions
      .filter((t) => t.account === accountId)
      .forEach((t) =>
        console.log(
          `${t.id}\t\t${t.type}\t\t${t.account}\t\t${t.amount}\t\t${
            t.status
          }\t\t${t.errorReason || '-'}\t\t${t.idempotencyToken || '-'}`,
        ),
      )
  }

  printAccount(accountId: string) {
    const account = this.getAccount(accountId)
    console.log(
      JSON.stringify(
        {
          ...account,
          balance: account.getBalance(),
          availableBalance: account.getAvailableBalance(),
        },
        null,
        2,
      ),
    )
  }
}

const ledger = new Ledger()

export default ledger
