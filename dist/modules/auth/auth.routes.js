"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("./auth.controllers");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
// router.post('/register', registerValidator, register);
router.post('/login', auth_validation_1.loginValidator, auth_controllers_1.login);
exports.default = router;
