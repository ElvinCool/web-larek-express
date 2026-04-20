import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_ACCESS_TOKEN_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, AUTH_ACCESS_TOKEN_SECRET) as { _id: string };
    req.user = { _id: decoded._id };
    return next();
  } catch {
    return next(new UnauthorizedError('Неверный токен'));
  }
};

export default auth;
