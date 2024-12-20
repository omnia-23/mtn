import express from 'express';
import { login, register } from './auth.controllers';
import { loginValidator, registerValidator } from './auth.validation';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;
