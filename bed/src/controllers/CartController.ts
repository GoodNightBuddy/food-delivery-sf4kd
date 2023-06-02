import { RequestHandler } from 'express';
import { QueryResult } from 'pg';
import db from '../db/dbConfig';

interface Product {
  id: number;
  product_name: string;
  price: number;
  product_image_url: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartData {
  cart: CartItem[];
  total_price: number;
}

type Cart = {
  id: number;
  user_id: number;
};


class CartController {

  private getUpdatedCartData = async (cartId: number): Promise<CartData> => {
    const cartDataQuery: QueryResult<CartItem> = await db.query(`
      SELECT ci.quantity, p.id AS product_id, p.product_name, p.price, p.product_image_url, p.shop_id
      FROM cart_items AS ci
      JOIN products AS p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    const cartItems: CartItem[] = cartDataQuery.rows;

    const totalPrice: number = +cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

    const response: CartData = {
      cart: cartItems,
      total_price: totalPrice,
    };

    return response;
  };

  public getCart: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;

      // Get the user's cart ID
      const cartQuery: QueryResult<Cart> = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      const userCartId: number | undefined = cartQuery.rows[0]?.id;

      if (!userCartId) {
        // User does not have a cart
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Retrieve cart data
      const response: CartData = await this.getUpdatedCartData(userCartId);

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public addToCart: RequestHandler = async (req, res) => {
    try {
      const { productId, quantity, userId } = req.body;

      let response: CartData | null = null;

      // Check if the user already has a cart
      const cartQuery: QueryResult<Cart> = await db.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
      const cart: Cart | undefined = cartQuery.rows[0];

      if (cart) {
        // Check if the product already exists in the cart
        const cartItemQuery: QueryResult<CartItem> = await db.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart.id, productId]);
        const cartItem: CartItem | undefined = cartItemQuery.rows[0];

        if (cartItem) {
          // Update the quantity of the existing cart item
          const newQuantity: number = cartItem.quantity + quantity;
          await db.query('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3', [newQuantity, cart.id, productId]);
        } else {
          // Insert a new cart item
          await db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cart.id, productId, quantity]);
        }

        // Retrieve updated cart data
        response = await this.getUpdatedCartData(cart.id);
      } else {
        // Create a new cart
        const newCartQuery: QueryResult<Cart> = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
        const newCartId: number = newCartQuery.rows[0].id;

        // Insert the cart item
        await db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [newCartId, productId, quantity]);

        // Retrieve cart data
        response = await this.getUpdatedCartData(newCartId);
      }

      res.status(200).json(response);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


  public removeFromCart: RequestHandler = async (req, res) => {
    try {
      const { productId, userId } = req.query;

      // Get the user's cart ID
      const cartQuery: QueryResult<Cart> = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      const userCartId: number | undefined = cartQuery.rows[0]?.id;

      if (!userCartId) {
        // User does not have a cart
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Delete the cart item
      await db.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [userCartId, productId]);

      // Retrieve updated cart data
      const response: CartData = await this.getUpdatedCartData(userCartId);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public updateCartItemQuantity: RequestHandler = async (req, res) => {
    try {
      const { productId, quantity, userId } = req.body;

      // Get the user's cart ID
      const cartQuery: QueryResult<Cart> = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      const userCartId: number | undefined = cartQuery.rows[0]?.id;

      if (!userCartId) {
        // User does not have a cart
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Check if the product already exists in the cart
      const existingCartItemQuery: QueryResult<CartItem> = await db.query(
        'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
        [userCartId, productId]
      );
      const existingCartItem: CartItem | undefined = existingCartItemQuery.rows[0];

      if (existingCartItem) {
        // Update the quantity of the existing cart item
        await db.query('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3', [
          quantity,
          userCartId,
          productId,
        ]);
      } else {
        // Insert the new cart item
        await db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [
          userCartId,
          productId,
          quantity,
        ]);
      }

      // Retrieve updated cart data
      const response: CartData = await this.getUpdatedCartData(userCartId);

      res.status(200).json(response);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default CartController;
