import express from 'express';
import ProductController from '../controllers/productController';

const router = express.Router();
const productController = new ProductController();

// Route: Get list of shops
router.get('/shops', productController.getShops);

// Route: Get product for specified shops
router.get('/shops/products/:shopId', productController.getProductsByShopId);

export default router;
