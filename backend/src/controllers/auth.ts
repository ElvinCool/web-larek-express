import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateTokens = (id: unknown) => ({
  accessToken: jwt.sign(
    { _id: id },
    AUTH_ACCESS_TOKEN_SECRET,
    { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY } as any,
  ),
  refreshToken: jwt.sign(
    { _id: id },
    AUTH_REFRESH_TOKEN_SECRET,
    { expiresIn: AUTH_REFRESH_TOKEN_EXPIRY } as any,
  ),
});

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const { accessToken, refreshToken } = generateTokens(user._id);
      return User.findByIdAndUpdate(
        user._id,
        { $push: { tokens: { token: refreshToken } } },
      )
        .then(() => {
          setRefreshCookie(res, refreshToken);
          res.status(201).json({
            user: { email: user.email, name: user.name },
            success: true,
            accessToken,
          });
        });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return Promise.reject(new UnauthorizedError('Неверный email или пароль'));
          }
          const { accessToken, refreshToken } = generateTokens(user._id);
          return User.findByIdAndUpdate(
            user._id,
            { $push: { tokens: { token: refreshToken } } },
          )
            .then(() => {
              setRefreshCookie(res, refreshToken);
              res.status(200).json({
                user: { email: user.email, name: user.name },
                success: true,
                accessToken,
              });
            });
        });
    })
    .catch(next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  User.findOne({ 'tokens.token': refreshToken })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return User.findByIdAndUpdate(
        user._id,
        { $pull: { tokens: { token: refreshToken } } },
      );
    })
    .then(() => {
      res.cookie('refreshToken', '', { httpOnly: true, maxAge: 0 });
      res.json({ success: true });
    })
    .catch(next);
};

export const refreshAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  try {
    const decoded = jwt.verify(
      refreshToken,
      AUTH_REFRESH_TOKEN_SECRET,
    ) as { _id: string };

    User.findOne({ _id: decoded._id, 'tokens.token': refreshToken })
      .then((user) => {
        if (!user) {
          return Promise.reject(new UnauthorizedError('Пользователь не найден'));
        }
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        return User.findByIdAndUpdate(
          user._id,
          { $pull: { tokens: { token: refreshToken } } },
        )
          .then(() => User.findByIdAndUpdate(
            user._id,
            { $push: { tokens: { token: newRefreshToken } } },
          ))
          .then(() => {
            setRefreshCookie(res, newRefreshToken);
            res.json({
              user: { email: user.email, name: user.name },
              success: true,
              accessToken,
            });
          });
      })
      .catch(next);
  } catch {
    next(new UnauthorizedError('Неверный refreshToken'));
  }
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.user!._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return res.json({
        user: { email: user.email, name: user.name },
        success: true,
      });
    })
    .catch(next);
};
