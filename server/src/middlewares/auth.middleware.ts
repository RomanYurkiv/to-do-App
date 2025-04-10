import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(403).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, user: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    const foundUser = await User.findByPk(user.id);
    if (!foundUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.user = foundUser;
    next();
  });
};