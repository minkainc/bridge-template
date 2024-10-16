export class CoreError extends Error {
  constructor(
    message: string,
    public readonly name = 'CoreError',
    public readonly code = '100',
  ) {
    super(message)
  }
}

export class InsufficientBalanceError extends CoreError {
  constructor(message: string) {
    super(message, 'InsufficientBalanceError', '101')
  }
}

export class InactiveAccountError extends CoreError {
  constructor(message: string) {
    super(message, 'InactiveAccountError', '102')
  }
}

export class UnknownAccountError extends CoreError {
  constructor(message: string) {
    super(message, 'UnknownAccountError', '103')
  }
}
