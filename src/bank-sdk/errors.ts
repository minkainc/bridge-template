export class CoreError extends Error {
  protected code: string

  constructor(message: string) {
    super(message)
    this.name = 'CoreError'
    this.code = '100'
  }
}

export class InsufficientBalanceError extends CoreError {
  constructor(message: string) {
    super(message)
    this.name = 'InsufficientBalanceError'
    this.code = '101'
  }
}

export class InactiveAccountError extends CoreError {
  constructor(message: string) {
    super(message)
    this.name = 'InactiveAccountError'
    this.code = '102'
  }
}

export class UnknownAccountError extends CoreError {
  constructor(message: string) {
    super(message)
    this.name = 'UnknownAccountError'
    this.code = '103'
  }
}
