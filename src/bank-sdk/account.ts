import { InactiveAccountError, InsufficientBalanceError } from './errors'

export class Account {
  public id: string
  public active: boolean
  public balance: number
  public onHold: number

  constructor(id: string, active = true) {
    this.id = id
    this.active = active
    this.balance = 0
    this.onHold = 0
  }

  debit(amount: number) {
    this.assertIsActive()

    if (this.getAvailableBalance() < amount) {
      throw new InsufficientBalanceError(
        `Insufficient available balance in account ${this.id}`,
      )
    }

    this.balance = this.balance - amount
  }

  credit(amount: number) {
    this.assertIsActive()

    this.balance = this.balance + amount
  }

  hold(amount: number) {
    this.assertIsActive()

    if (this.getAvailableBalance() < amount) {
      throw new InsufficientBalanceError(
        `Insufficient available balance in account ${this.id}`,
      )
    }

    this.onHold = this.onHold + amount
  }

  release(amount: number) {
    this.assertIsActive()

    if (this.onHold < amount) {
      throw new InsufficientBalanceError(
        `Insufficient balance on hold in account ${this.id}`,
      )
    }

    this.onHold = this.onHold - amount
  }

  getOnHold() {
    return this.onHold
  }

  getBalance() {
    return this.balance
  }

  getAvailableBalance() {
    return this.balance - this.onHold
  }

  isActive() {
    return this.active
  }

  assertIsActive() {
    if (!this.active) {
      throw new InactiveAccountError(`Account ${this.id} is inactive`)
    }
  }

  setActive(active: boolean) {
    this.active = active
  }
}
