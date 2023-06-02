import { Router } from 'express';
import UserController from '../controllers/UserController';

const router: Router = Router();
const userController: UserController = new UserController();

// Route: Check if user exists in db
router.get('/users/:userId', userController.getUser);

// Route: Create a new user
router.post('/users', userController.createUser);

export default router;
