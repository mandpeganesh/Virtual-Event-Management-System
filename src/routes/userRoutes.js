import express from 'express';
import { register, login } from '../controllers/userController.js';
import { validateRegistration, validateLogin } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

export { router as userRouter };