import express, { Router } from 'express';
import PurchaseController from '../controllers/purchaseController';

const router: Router = express.Router();
const controller: PurchaseController = new PurchaseController();

router.get('/cart/:userId', controller.getCart);

// Route: Add product to cart and get cart data with total price and product data
router.put('/cart', controller.addToCart);

// Route: Changer product quantity in the cart and get cart data with total price and product data
router.patch('/cart', controller.updateCartItemQuantity);

// Route: Delte product to cart and get cart data with total price and product data
router.delete('/cart', controller.removeFromCart);

const purchaseController = new PurchaseController();
router.get('/orders/:userId', purchaseController.getOrders);

// Route: Submit order and convert cart to an order
router.post('/orders', controller.submitOrder);

export default router;
