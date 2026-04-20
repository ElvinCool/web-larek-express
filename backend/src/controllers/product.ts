import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import NotFoundError from '../errors/not-found';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ items: products, total: products.length });
    })
    .catch(next);
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, category, description, price, image,
  } = req.body;
  Product.create({
    title, category, description, price, image,
  })
    .then((product) => res.status(201).json(product))
    .catch(next);
};

export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, category, description, price, image,
  } = req.body;
  const { productId } = req.params;
  Product.findByIdAndUpdate(
    productId,
    {
      title, category, description, price, image,
    },
    { new: true },
  )
    .then((product) => {
      if (!product) {
        return next(new NotFoundError('Товар не найден'));
      }
      return res.status(200).json(product);
    })
    .catch(next);
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  Product.findByIdAndDelete(productId)
    .then((product) => {
      if (!product) {
        return next(new NotFoundError('Товар не найден'));
      }
      return res.status(200).json(product);
    })
    .catch(next);
};
