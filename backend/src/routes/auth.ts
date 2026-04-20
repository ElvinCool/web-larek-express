import { Router } from 'express';
import {
  login, register, logout, refreshAccessToken, getCurrentUser,
} from '../controllers/auth';
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
