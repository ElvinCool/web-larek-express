import { Router } from 'express';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
} from '../controllers/product';
import { validateProduct } from '../middlewares/validations';
import auth from '../middlewares/auth';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', auth, validateProduct, createProduct);
productRouter.patch('/:productId', auth, updateProduct);
productRouter.delete('/:productId', auth, deleteProduct);

export default productRouter;
