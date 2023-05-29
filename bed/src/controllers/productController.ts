import { RequestHandler } from 'express';
import { QueryResult } from 'pg';
import db from '../db/dbConfig';

interface Shop {
  id: number;
  name: string;
  shop_image_url: string;
}

interface Product {
  id: number;
  shop_id: number;
  price: string;
  product_name: string;
  product_image_url: string;
}

class ProductController {
  public getShops: RequestHandler = async (req, res) => {
    try {
      const shopsQuery: QueryResult<Shop> = await db.query('SELECT id, name, shop_image_url FROM shops');
      const shops: Shop[] = shopsQuery.rows;

      res.status(200).json(shops);
    } catch (error) {
      console.error('Error getting shops:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public getProductsByShopId: RequestHandler = async (req, res) => {
    try {
      const { shopId } = req.params;

      const productsQuery: QueryResult<Product> = await db.query(
        'SELECT p.id, p.shop_id, p.price, p.product_name, p.product_image_url ' +
        'FROM products p ' +
        'JOIN shops s ON p.shop_id = s.id ' +
        'WHERE s.id = $1',
        [shopId]
      );

      const products: Product[] = productsQuery.rows;

      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting products by shop ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default ProductController;
