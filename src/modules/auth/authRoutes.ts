import express from 'express';
import { register, login } from './authController';
import { validateRequest, registerSchema, loginSchema } from '../../middlewares/validation';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;