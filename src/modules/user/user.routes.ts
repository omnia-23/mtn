import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { getUsersHandler, createUserHandler, updateUserHandler, deleteUserHandler } from './user.controller';
import { createUserVal, filterValid, paramsVal, updateUserVal } from './user.validation';

const router = Router();

router.get('/', authenticate, authorize(['admin']), filterValid, getUsersHandler);
router.post('/', authenticate, authorize(['admin']), createUserVal, createUserHandler);
router.put('/:id', authenticate, authorize(['admin']), updateUserVal, updateUserHandler);
router.delete('/:id', authenticate, authorize(['admin']), paramsVal, deleteUserHandler);

export default router;
