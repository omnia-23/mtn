"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config"));
const dotenv_handler_1 = require("dotenv-handler");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const index_router_1 = __importDefault(require("./routers/index.router"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, config_1.default)();
const app = (0, express_1.default)();
const PORT = (0, dotenv_handler_1.getConfig)('PORT');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)(':method :url :status :response-time ms - :date[web]'));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
}));
app.use(index_router_1.default);
app.use(errorHandler_middleware_1.errorHandler);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/', (req, res) => {
    res.send('Hello, Vercel with TypeScript!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
