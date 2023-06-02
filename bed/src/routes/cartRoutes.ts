import express, { Router } from 'express';
import CartController from '../controllers/CartController';

const router: Router = express.Router();
const controller: CartController = new CartController();

router.get('/cart/:userId', controller.getCart);

// Route: Add product to cart and get cart data with total price and product data
router.put('/cart', controller.addToCart);

// Route: Changer product quantity in the cart and get cart data with total price and product data
router.patch('/cart', controller.updateCartItemQuantity);

// Route: Delte product to cart and get cart data with total price and product data
router.delete('/cart', controller.removeFromCart);

export default router;
