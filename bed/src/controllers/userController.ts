import { RequestHandler } from 'express';
import db from '../db/dbConfig';

class UserController {
  createUser: RequestHandler = async (req, res) => {
  
    try {
      await db.query('BEGIN');
  
      const newUserQuery = await db.query('INSERT INTO users DEFAULT VALUES RETURNING id');
      const newUser = newUserQuery.rows[0];
      const userId = newUser.id;
  
      await db.query('INSERT INTO carts (user_id) VALUES ($1)', [userId]);
  
      await db.query('COMMIT');
  
      res.status(201).json({ userId });
    } catch (error: any) {
      await db.query('ROLLBACK');
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  getUser: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;

      const getUserQuery = await db.query('SELECT id FROM users WHERE id = $1', [userId]);

      if (getUserQuery.rows.length > 0) {
        // User with the provided userId exists
        res.status(200).json({ userId });
      } else {
        // User with the provided userId does not exist
        res.status(200).json({ userId: null });
      }
    } catch (error: any) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default UserController;
