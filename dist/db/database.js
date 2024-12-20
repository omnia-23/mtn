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
exports.syncTables = exports.sql = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const schema = __importStar(require("./models"));
const dotenv_1 = __importDefault(require("dotenv"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
dotenv_1.default.config();
const PGSQL_DB_USER = process.env.POSTGRES_USER;
const PGSQL_DB_HOST = process.env.POSTGRES_HOST;
const PGSQL_DB_NAME = process.env.POSTGRES_DB;
const PGSQL_DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const PGSQL_DB_PORT = process.env.POSTGRES_PORT;
if (!PGSQL_DB_USER || !PGSQL_DB_PASSWORD || !PGSQL_DB_NAME) {
    throw new HttpError_1.default(500, 'Database configuration variables are missing!');
}
const conString = `postgres://${PGSQL_DB_USER}:${PGSQL_DB_PASSWORD}@${PGSQL_DB_HOST}:${PGSQL_DB_PORT}/${PGSQL_DB_NAME}`;
exports.sql = (0, postgres_1.default)(conString, { max: 1 });
const migrationClient = (0, postgres_js_1.drizzle)(exports.sql);
const syncTables = async () => await (0, migrator_1.migrate)(migrationClient, { migrationsFolder: './src/migrations' }).then(async () => {
    exports.sql.end();
});
exports.syncTables = syncTables;
const querySql = (0, postgres_1.default)(conString);
const queryClient = (0, postgres_js_1.drizzle)(querySql, {
    schema,
});
exports.default = queryClient;
