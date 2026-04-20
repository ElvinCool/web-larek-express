import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

const createOrder = (req: Request, res: Response) => {
  const { total } = req.body;
  res.status(200).json({ id: faker.string.uuid(), total });
};

export default createOrder;
