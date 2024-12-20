"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envPath = void 0;
const dotenv_handler_1 = require("dotenv-handler");
const path_1 = __importDefault(require("path"));
exports.envPath = path_1.default.resolve(__dirname, `../../.env`);
exports.default = () => {
    (0, dotenv_handler_1.loadConfig)(exports.envPath, {
        required: [
            'POSTGRES_USER',
            'POSTGRES_PORT',
            'POSTGRES_DB',
            'POSTGRES_USER',
            'POSTGRES_PASSWORD',
            'NODE_ENV',
            'PORT',
            'BASE_URL',
            'SECRET_KEY',
        ],
        expand: true,
    });
};
