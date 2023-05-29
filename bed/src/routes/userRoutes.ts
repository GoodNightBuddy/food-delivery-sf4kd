import { Router } from 'express';
import UserController from '../controllers/userController';

const router: Router = Router();
const userController: UserController = new UserController();

// Route: Create a new user
router.get('/users/:userId', userController.getUser);

// Route: Create a new user
router.post('/users', userController.createUser);

export default router;
