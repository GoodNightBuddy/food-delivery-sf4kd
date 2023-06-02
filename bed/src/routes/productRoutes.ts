import express from 'express';
import ProductController from '../controllers/ProductController';

const router = express.Router();
const productController = new ProductController();

router.get('/shops', productController.getShops);
router.get('/shops/products/:shopId', productController.getProductsByShopId);

export default router;
