export class Transaction {
  public id: string
  public type: string
  public account: string
  public amount: number
  public status: string
  public idempotencyToken?: string
  public errorReason?: string
  public errorCode?: string

  constructor({
    id,
    type,
    account,
    amount,
    status,
    idempotencyToken,
  }: {
    id: string
    type: string
    account: string
    amount: number
    status: string
    idempotencyToken?: string
  }) {
    this.id = id
    this.type = type
    this.account = account
    this.amount = amount
    this.status = status
    this.errorReason = undefined
    this.errorCode = undefined
    this.idempotencyToken = idempotencyToken
  }
}
