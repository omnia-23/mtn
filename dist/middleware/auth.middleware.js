"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const dotenv_handler_1 = require("dotenv-handler");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return next(new HttpError_1.default(401, 'unauthorized'));
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new HttpError_1.default(401, 'Unauthorized: Token missing'));
    }
    try {
        const secretKey = (0, dotenv_handler_1.getConfig)('SECRET_KEY');
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = { id: payload.id, roles: payload.roles };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError)
            return next(new HttpError_1.default(401, 'session ended'));
        return next(new HttpError_1.default(403, 'Forbidden'));
    }
};
exports.authenticate = authenticate;
const authorize = (requiredRoles) => {
    return (req, res, next) => {
        const userRoles = req.user?.roles;
        if (!userRoles || !userRoles.some(role => requiredRoles.includes(role))) {
            return next(new HttpError_1.default(403, 'Forbidden'));
        }
        next();
    };
};
exports.authorize = authorize;
