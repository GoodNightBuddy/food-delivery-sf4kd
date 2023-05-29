import { RequestHandler } from 'express';
import { QueryResult } from 'pg';
import db from '../db/dbConfig';

interface Product {
  id: number;
  product_name: string;
  price: number;
  product_image_url: string
}

interface CartItem extends Product {
  quantity: number;
}

interface CartData {
  cart: CartItem[];
  total_price: number;
}

interface User {
  id: number;
  email: string;
}

interface Order {
  id: number;
}

type Cart = {
  id: number;
  user_id: number;
};

interface ErrorWithCode extends Error {
  code?: string;
}


interface Order {
  order_id: number;
  order_date: string;
  quantity: number;
  product_id: number;
  product_name: string;
  price: number;
  product_image_url: string;
}


interface OrderItem {
  order_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_image_url: string;
  price: number;
}

interface OrderData {
  orderNumber: number;
  orderDate: string;
  items: OrderItem[];
  total_price: number;
}

class PurchaseController {

  private getUpdatedCartData = async (cartId: number): Promise<CartData> => {
    const cartDataQuery: QueryResult<CartItem> = await db.query(`
      SELECT ci.quantity, p.id AS product_id, p.product_name, p.price, p.product_image_url
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

  public submitOrder: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.body;

      // Start a transaction
      await db.query('BEGIN');

      // Insert the order
      const orderQuery: QueryResult<Order> = await db.query(
        'INSERT INTO orders (user_id, total_price) VALUES ($1, 0) RETURNING id, order_date',
        [userId]
      );

      const orderId: number = orderQuery.rows[0].id;
      const orderDate: string = orderQuery.rows[0].order_date;

      // Get the cart items for the user
      const cartItemsQuery: QueryResult<CartItem> = await db.query(
        'SELECT ci.quantity, p.id AS id, p.product_name, p.price, p.product_image_url FROM cart_items ci INNER JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId]
      );

      const cartItems: CartItem[] = cartItemsQuery.rows;

      // Insert order items
      for (const item of cartItems) {
        await db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)', [
          orderId,
          item.id,
          item.quantity,
        ]);
      }

      // Get the total price of the order
      const totalPriceQuery: QueryResult<any> = await db.query(
        'SELECT SUM(p.price * ci.quantity) AS total_price FROM cart_items ci INNER JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)',
        [userId]
      );

      const totalPrice: number = totalPriceQuery.rows[0].total_price;

      // Update the total price in the orders table
      await db.query('UPDATE orders SET total_price = $1 WHERE id = $2', [totalPrice, orderId]);

      // Delete the cart and cart items
      await db.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);

      // Commit the transaction
      await db.query('COMMIT');

      const response: OrderData = {
        orderNumber: orderId,
        orderDate,
        items: cartItems.map((item) => ({
          order_id: orderId,
          quantity: item.quantity,
          product_id: item.id,
          product_name: item.product_name,
          price: item.price,
          product_image_url: item.product_image_url,
        })),
        total_price: totalPrice,
      };

      res.status(200).json(response);
    } catch (error) {
      // Rollback the transaction in case of error
      await db.query('ROLLBACK');
      console.error('Error submitting order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public getOrders: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.params;

      // Retrieve the orders for the user in chronological order
      const ordersQuery: QueryResult<Order> = await db.query(
        'SELECT o.id AS order_id, o.order_date, oi.quantity, p.id AS product_id, p.product_name, p.price, p.product_image_url ' +
        'FROM orders o ' +
        'JOIN order_items oi ON o.id = oi.order_id ' +
        'JOIN products p ON oi.product_id = p.id ' +
        'WHERE o.user_id = $1 ' +
        'ORDER BY o.order_date DESC',
        [userId]
      );

      const orders: Order[] = ordersQuery.rows;

      // Group the order items by order ID
      const ordersMap: Map<number, OrderData> = new Map();

      for (const order of orders) {
        const { order_id, order_date, quantity, product_id, product_name, price, product_image_url } = order;

        if (!ordersMap.has(order_id)) {
          ordersMap.set(order_id, {
            orderNumber: order_id,
            orderDate: order_date,
            items: [],
            total_price: 0,
          });
        }

        const orderData: OrderData = ordersMap.get(order_id)!;
        orderData.items.push({
          order_id,
          quantity,
          product_id,
          product_name,
          price: price,
          product_image_url,
        });
        orderData.total_price += price * quantity;
      }

      // Convert the orders map to an array of OrderData
      const orderList: OrderData[] = Array.from(ordersMap.values());

      res.status(200).json(orderList);
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default PurchaseController;
