import { Account } from './account'
import { Transaction } from './transaction'

export class Ledger {
  accounts = new Map<string, Account>()
  transactions: Transaction[] = []

  constructor() {
    // account with available balance 700
    this.accounts.set('1001001001', new Account('1001001001'))
    this.credit('1001001001', 1000)
    this.debit('1001001001', 100)
    this.debit('1001001001', 200)

    // account with no available balance, and no transactions
    this.accounts.set('1001001002', new Account('1001001002'))

    // account with no available balance, but it has some transactions
    this.accounts.set('1001001003', new Account('1001001003'))
    this.credit('1001001003', 300)
    this.debit('1001001003', 300)

    // inactive account
    this.accounts.set('1001001009', new Account('1001001009'))
    this.credit('1001001009', 100)
    this.debit('1001001009', 20)
    this.deactivate('1001001009')
  }

  getAccount(accountId: string) {
    return this.accounts.get(accountId)
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

  findTransactionByToken(idempotencyToken: string) {
    return this.transactions.find(
      (transaction) => transaction.idempotencyToken === idempotencyToken,
    )
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

  activate(accountId: string) {
    return this.getAccount(accountId).setActive(true)
  }

  deactivate(accountId: string) {
    return this.getAccount(accountId).setActive(false)
  }
}
