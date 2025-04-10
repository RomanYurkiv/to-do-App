import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', async (req, res) => {
  await registerUser(req, res);
});

router.post('/login', async (req, res) => {
  await loginUser(req, res);
});

export default router;