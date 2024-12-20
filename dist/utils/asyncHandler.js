"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const HttpError_1 = __importDefault(require("./HttpError"));
const asyncHandler = 
// eslint-disable-next-line @typescript-eslint/ban-types
(fn, errorMessage) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error(err);
        if (err instanceof HttpError_1.default) {
            next(err);
        }
        else {
            next(new HttpError_1.default(500, errorMessage, err));
        }
    });
};
exports.asyncHandler = asyncHandler;
