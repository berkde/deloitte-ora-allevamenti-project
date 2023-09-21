export class AwsServiceError extends Error {
  readonly statusCode!: number;
  readonly type!: string;

  constructor(message: string, statusCode: number, type: string) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}

export class CubbitServiceError extends Error {
  readonly statusCode!: number;
  readonly type!: string;

  constructor(message: string, statusCode: number, type: string) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}
