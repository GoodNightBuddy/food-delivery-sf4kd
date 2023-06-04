/* Replace with your SQL commands */
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  shop_image_url VARCHAR(200) NOT NULL,
  address VARCHAR(200) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  shop_id INT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_image_url VARCHAR(200)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY
  -- email VARCHAR(200) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_price NUMERIC(10, 2) NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(200) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  shipping_address VARCHAR(200) NOT NULL
);

CREATE TABLE order_items (
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

-- Insert data into the 'shops' table
INSERT INTO shops (name, shop_image_url, address)
VALUES
  ('McDonalds', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png', 'проспект Свободи, 35, Львів, Львівська область, 79000'),
  ('KFC', 'https://www.kfc-ukraine.com/admin/files/3190.svg', 'проспект Свободи, 19, Львів, Львівська область, 79000'),
  ('Starbucks', 'https://upload.wikimedia.org/wikipedia/ru/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png', 'Emilii Plater 53, 00-113 Warszawa, Польша'),
  ('Burger King', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/2024px-Burger_King_logo_%281999%29.svg.png', 'Aleje Jerozolimskie 54 lok. N12-13-14, 00-495 Warszawa, Польша');

INSERT INTO products (shop_id, price, product_name, product_image_url)
VALUES
  -- McDonalds products
  (1, 4.99, 'Cotton Candy', 'https://png.pngtree.com/png-clipart/20201028/ourmid/pngtree-pink-cartoon-cotton-candy-png-image_2377475.jpg'),
  (1, 2.99, 'Donuts', 'https://w7.pngwing.com/pngs/501/669/png-transparent-donut-thumbnail.png'),
  (1, 5.99, 'Apple Pie', 'https://static.vecteezy.com/system/resources/previews/021/027/415/original/apple-pie-transparent-png.png'),
  (1, 3.99, 'Cherry Pie', 'https://www.pngmart.com/files/11/Cherry-Pie-PNG-Transparent-HD-Photo.png'),
  (1, 5.99, 'Big Mac', 'https://s7d1.scene7.com/is/image/mcdonalds/DC_201907_0005_BigMac_832x472:1-3-product-tile-desktop?wid=765&hei=472&dpr=off'),
  (1, 6.99, 'Big Tasty', 'https://s7d1.scene7.com/is/image/mcdonalds/mcdonalds-BigTasty:1-3-product-tile-desktop?wid=829&hei=515&dpr=off'),
  (1, 2.99, 'French Fries', 'https://static.vecteezy.com/system/resources/previews/013/442/145/original/crispy-and-delicious-french-fries-free-png.png'),
  (1, 4.99, 'Cheeseburger', 'https://upload.wikimedia.org/wikipedia/commons/1/11/Cheeseburger.png'),
  
  -- KFC products
  (2, 4.99, 'Baguette', 'https://w7.pngwing.com/pngs/273/595/png-transparent-baguette-viennoiserie-bakery-pain-au-chocolat-croissant-sandwich-baked-goods-food-baking.png'),
  (2, 2.99, 'Apple Juice', 'https://e7.pngegg.com/pngimages/160/715/png-clipart-apple-fruit-and-glass-of-apple-juice-apple-juice-concentrate-juice-food-fruit.png'),
  (2, 5.99, 'Noodles', 'https://e7.pngegg.com/pngimages/15/63/png-clipart-noodle-noodle.png'),
  (2, 3.99, 'Ramen', 'https://img2.freepng.ru/20180515/lee/kisspng-ramen-instant-noodle-mie-goreng-asam-pedas-japanes-5afad5985a1570.021722611526388120369.jpg'),
  (2, 7.99, 'Pizza', 'https://png.pngtree.com/png-clipart/20230412/original/pngtree-modern-kitchen-food-boxed-cheese-lunch-pizza-png-image_9048155.png'),
  (2, 6.99, 'Shawarma', 'https://w7.pngwing.com/pngs/16/539/png-transparent-taco-shawarma-fast-food-doner-kebab-hamburger-hot-dog-jamon-food-recipe-street-food.png'),
  (2, 3.99, 'Hot Dog', 'https://w7.pngwing.com/pngs/184/454/png-transparent-hot-dog-days-pink-s-hot-dogs-bratwurst-burger-food-ketchup-american-food.png'),
  
  -- Starbucks products
  (3, 4.99, 'Sake', 'https://e7.pngegg.com/pngimages/825/668/png-clipart-sake-rice-wine-beer-wine-beer-bottle-wine.png'),
  (3, 2.99, 'Hot Chocolate', 'https://w7.pngwing.com/pngs/359/451/png-transparent-hot-chocolate-caffe-mocha-cordial-starbucks-chocolate.png'),
  (3, 5.99, 'Oat', 'https://w7.pngwing.com/pngs/65/827/png-transparent-muesli-rice-cereal-oatmeal-steel-cut-oats-oat-food-oat-breakfast-cereal.png'),
  (3, 3.99, 'Fried Eggs', 'https://w7.pngwing.com/pngs/550/238/png-transparent-food-fried-food-food-delicatessen-egg.png'),
  (3, 3.99, 'Coffee', 'https://png.pngtree.com/png-clipart/20190925/ourmid/pngtree-flying-cup-of-coffee-with-splash-and-coffee-beans-png-background-png-image_1742479.jpg'),
  (3, 2.99, 'Tea', 'https://w1.pngwing.com/pngs/927/689/png-transparent-grey-tea-green-tea-tea-bag-white-tea-teacup-herbal-tea-tea-green.png'),
  
  -- Burger King products
  (4, 4.99, 'Cream Soup', 'https://e7.pngegg.com/pngimages/283/0/png-clipart-broth-cheese-soup-iranian-cuisine-cafe-chicken-soup-soups-cream-soup.png'),
  (4, 2.99, 'Steak', 'https://w7.pngwing.com/pngs/994/579/png-transparent-grilled-steak-delmonico-steak-beefsteak-chophouse-restaurant-strip-steak-beef-steak-beef-roast-beef-cooking-thumbnail.png'),
  (4, 3.99, 'Donuts', 'https://w7.pngwing.com/pngs/501/669/png-transparent-donut-thumbnail.png'),
  (4, 4.99, 'Coca-Cola', 'https://imgpng.ru/d/cocacola_PNG15.png'),
  (4, 3.99, 'Ice Cream', 'https://w7.pngwing.com/pngs/586/1024/png-transparent-ice-cream-cones-sorbet-gelato-neapolitan-ice-cream-ice-cream.png'),
  (4, 6.99, 'Chicken Salad', 'https://w7.pngwing.com/pngs/486/141/png-transparent-vegetarian-cuisine-chicken-salad-caesar-salad-garnish-salad.png'),
  (4, 2.99, 'Cookies', 'https://w7.pngwing.com/pngs/162/831/png-transparent-baked-cookies-cookie-bread-sheet-pan-baking-mold-cookies-chocolate-chip-cookies-baked-goods-food-cooking.png');
