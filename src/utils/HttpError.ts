import { ValidationError } from 'express-validator';

class HttpError extends Error {
  statusCode: number;
  isValidationError: boolean = false;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(status: number, message: string, isValidationError?: boolean, err?: Error | ValidationError[]) {
    super(message);
    this.statusCode = status || 500;
    this.isValidationError = isValidationError === true;
    this.error = err;
    Error.captureStackTrace(this, this.constructor);
  }

  log(errorLogStream: NodeJS.WriteStream) {
    errorLogStream.write(
      `Time: ${new Date().toLocaleString()} Error Message: ${this.message} Error: ${this.error} Error Stack:${
        this.stack
      }\n`,
    );
  }
}

export default HttpError;
