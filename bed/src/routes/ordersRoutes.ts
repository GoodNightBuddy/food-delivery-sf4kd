import express, { Router } from 'express';
import OrdersController from '../controllers/ordersController';

const router: Router = express.Router();
const controller: OrdersController = new OrdersController();

// Route: Get all user orders
router.get('/orders/:userId', controller.getOrders);

// Route: Submit order and convert cart to an order
router.post('/orders', controller.submitOrder);

export default router;