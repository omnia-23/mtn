"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(status, message, isValidationError, err) {
        super(message);
        this.isValidationError = false;
        this.statusCode = status || 500;
        this.isValidationError = isValidationError === true;
        this.error = err;
        Error.captureStackTrace(this, this.constructor);
    }
    log(errorLogStream) {
        errorLogStream.write(`Time: ${new Date().toLocaleString()} Error Message: ${this.message} Error: ${this.error} Error Stack:${this.stack}\n`);
    }
}
exports.default = HttpError;
