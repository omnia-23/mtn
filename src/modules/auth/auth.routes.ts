import express from 'express';
import { login } from './auth.controllers';
import { loginValidator } from './auth.validation';

const router = express.Router();

// router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;
