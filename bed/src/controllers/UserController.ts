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
  
  // createUser: RequestHandler = async (req, res) => {
  //   try {
  //     const { email } = req.body;

  //     const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  //     if (!emailRegex.test(email)) {
  //       res.status(400).json({ message: 'Invalid email format' });
  //       return;
  //     }

  //     const existingUserQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  //     if (existingUserQuery.rows.length > 0) {
  //       res.status(409).json({ message: 'User already exists' });
  //     } else {
  //       const newUserQuery = await db.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [email]);
  //       const newUser = newUserQuery.rows[0];
  //       res.status(201).json(newUser);
  //     }
  //   } catch (error: any) {
  //     console.error('Error creating user:', error);
  //     if (error.constraint === 'users_email_check') {
  //       res.status(400).json({ message: 'Invalid email format' });
  //     }
  //     else if (error.code === '23505') {
  //       res.status(500).json({ message: `User with this email - ${req.body.email} already exists` });
  //     } else {
  //       res.status(500).json({ message: 'Internal Server Error' });
  //     }
  //   }
  // }
}

export default UserController;
