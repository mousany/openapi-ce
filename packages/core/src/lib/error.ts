export class OneAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OneAPIError';
  }
}

export class InvalidRequestError extends OneAPIError {
  constructor(apiName: string, message = 'Invalid request') {
    super(`${message} to ${apiName}`);
    this.name = 'InvalidRequestError';
  }
}

export class InvalidResponseError extends OneAPIError {
  constructor(apiName: string, message = 'Invalid response') {
    super(`${message} from ${apiName}`);
    this.name = 'InvalidResponseError';
  }
}

export class UsernameOrPasswordError extends OneAPIError {
  constructor() {
    super('Username or password is incorrect');
    this.name = 'UsernameOrPasswordError';
  }
}
