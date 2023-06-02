import { RequestHandler } from 'express';
import { QueryResult } from 'pg';
import db from '../db/dbConfig';
import { CartItem } from './CartController';

interface Order {
  order_id: number;
  id: number;
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

class OrdersController {

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

export default OrdersController;
