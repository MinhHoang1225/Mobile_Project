import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: 'myDatabase.db',
    location: 'default',
  });
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type HistoryItem = {
  id?: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
};

const initialCategories: Category[] = [
  { id: 1, name: 'Quần áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Phụ kiện' },
  { id: 4, name: 'Đồ lót & mặc nhà' },
  { id: 5, name: 'Đồ thể thao & Gym' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 't-shirt.jpg', categoryId: 1 },
  {
    id: 2,
    name: 'Giày sneaker',
    price: 1100000,
    img: 'sneaker.jpg',
    categoryId: 2,
  },
  {
    id: 3,
    name: 'Balo thời trang',
    price: 490000,
    img: 'balo.jpg',
    categoryId: 3,
  },
  {
    id: 4,
    name: 'Pijama',
    price: 120000,
    img: 'pijama.jpg',
    categoryId: 4,
  },
  {
    id: 5,
    name: 'Áo thể thao',
    price: 980000,
    img: 'gym.jpg',
    categoryId: 5,
  },
];

export const products: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 't-shirt.jpg', categoryId: 1 },
  {
    id: 2,
    name: 'Giày sneaker',
    price: 1100000,
    img: 'sneaker.jpg',
    categoryId: 2,
  },
  {
    id: 3,
    name: 'Balo thời trang',
    price: 490000,
    img: 'balo.jpg',
    categoryId: 3,
  },
  { id: 4, name: 'Pijama', price: 120000, img: 'pijama.jpg', categoryId: 4 },
  { id: 5, name: 'Áo thể thao', price: 980000, img: 'gym.jpg', categoryId: 5 },
];

export const popularProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 't-shirt.jpg', categoryId: 1 },
  {
    id: 2,
    name: 'Giày sneaker',
    price: 1100000,
    img: 'sneaker.jpg',
    categoryId: 2,
  },
  {
    id: 3,
    name: 'Balo thời trang',
    price: 490000,
    img: 'balo.jpg',
    categoryId: 3,
  },
  { id: 4, name: 'Pijama', price: 120000, img: 'pijama.jpg', categoryId: 4 },
  { id: 5, name: 'Áo thể thao', price: 980000, img: 'gym.jpg', categoryId: 5 },
];

export const images: { [key: string]: any } = {
  't-shirt.jpg': require('../assets/book_images/t-shirt.jpg'),
  'sneaker.jpg': require('../assets/book_images/sneaker.jpg'),
  'balo.jpg': require('../assets/book_images/balo.jpg'),
  'pijama.jpg': require('../assets/book_images/pijama.jpg'),
  'gym.jpg': require('../assets/book_images/gym.jpg'),
};

//async: Khai báo đây là một hàm bất đồng bộ, cho phép sử dụng await bên trong
// onSuccess?: () => void: Tham số truyền vào là một callback tùy chọn, gọi khi quá trình khởi tạo thành công.
// Promise<void>: Hàm trả về một Promise, không trả giá trị cụ thể (kiểu void), nhằm đảm bảo có thể chờ quá trình khởi tạo hoàn tất.
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction(
      tx => {
        //chỉ để test không dùng 2 câu lệnh này
        // tx.executeSql('DROP TABLE IF EXISTS products');
        // tx.executeSql('DROP TABLE IF EXISTS categories');

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)',
        );
        initialCategories.forEach(category => {
          tx.executeSql(
            'INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)',
            [category.id, category.name],
          );
        });

        tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          img TEXT,
          categoryId INTEGER,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )`);

        initialProducts.forEach(product => {
          tx.executeSql(
            'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
            [
              product.id,
              product.name,
              product.price,
              product.img,
              product.categoryId,
            ],
          );
        });

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE,
              password TEXT,
              role TEXT
            )`,
          [],
          () => console.log('✅ Users table created'),
          (_, error) => console.error('❌ Error creating users table:', error),
        );

        // === CART TABLE ===
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productId INTEGER,
            quantity INTEGER,
            img TEXT,
            FOREIGN KEY (productId) REFERENCES products(id)
          )
        `);

        tx.executeSql(
  `CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    name TEXT,
    quantity INTEGER,
    price REAL,
    total REAL,
    date TEXT,
    status TEXT DEFAULT 'Đang xử lý',
    FOREIGN KEY (productId) REFERENCES products(id)
  )`
);

        tx.executeSql(
          `INSERT INTO users (username, password, role)
            SELECT 'admin', '123456', 'admin'
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
          [],
          () => console.log('✅ Admin user added'),
          (_, error) => console.error('❌ Error inserting admin:', error),
        );
      },
      error => console.error('❌ Transaction error:', error),
      () => {
        // Hàm khi thành công
        console.log('✅ Database initialized');
        if (onSuccess) onSuccess(); // onSuccess là tên biến đại diện cho hàm callback (có thể đặt tên bất kỳ). Nếu biến onSuccess tồn tại (tức là không phải undefined hoặc null), thì hãy gọi hàm đó =>Gọi loadData() ở useEffect() của Sanpham3Sqlite
      },
    );
  } catch (error) {
    console.error('❌ initDatabase outer error:', error);
  }
};

export const resetDatabase = async (): Promise<void> => {
  try {
    await SQLite.deleteDatabase({
      name: 'myDatabase.db',
      location: 'default',
    });

    db = null; // xoá kết nối cũ
    console.log('🗑️ Database deleted');

    // tạo lại database mới
    await initDatabase();
    console.log('🔄 Database recreated');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};

export const fetchDashboardStats = async () => {
  try {
    const db = await getDb();

    const stats: any = {};

    // Tổng danh mục
    const [cat] = await db.executeSql("SELECT COUNT(*) as total FROM categories");
    stats.totalCategories = cat.rows.item(0).total;

    // Tổng sản phẩm
    const [prod] = await db.executeSql("SELECT COUNT(*) as total FROM products");
    stats.totalProducts = prod.rows.item(0).total;

    // Tổng người dùng
    const [users] = await db.executeSql("SELECT COUNT(*) as total FROM users");
    stats.totalUsers = users.rows.item(0).total;

    // Tổng đơn lịch sử
    const [his] = await db.executeSql("SELECT COUNT(*) as total FROM history");
    stats.totalHistory = his.rows.item(0).total;

    // Top sản phẩm bán nhiều
    const [top] = await db.executeSql(`
      SELECT name, SUM(quantity) as totalSold
      FROM history
      GROUP BY productId
      ORDER BY totalSold DESC
      LIMIT 1
    `);

    stats.topProduct =
      top.rows.length > 0 ? top.rows.item(0).name : "Chưa có dữ liệu";

    return stats;
  } catch (error) {
    console.log("❌ Dashboard error:", error);
    return null;
  }
};

// ➕ Thêm Category
export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('INSERT INTO categories (name) VALUES (?)', [name]);
    console.log('✅ Category added');
    return true;
  } catch (error) {
    console.error('❌ Error adding category:', error);
    return false;
  }
};

// 🔄 Sửa Category
export const updateCategory = async (
  id: number,
  name: string,
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE categories SET name = ? WHERE id = ?', [
      name,
      id,
    ]);
    console.log('✅ Category updated');
    return true;
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return false;
  }
};

// ❌ Xóa Category
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM categories WHERE id = ?', [id]);
    console.log('✅ Category deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return false;
  }
};
export const updateOrderStatus = async (id: number, status: string) => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE history SET status = ? WHERE id = ?', [status, id]);
    console.log('✅ Order status updated');
  } catch (error) {
    console.error('❌ Error updating order status:', error);
  }
};

export const addProductToCategory = async (
  name: string,
  price: number,
  categoryId: number
): Promise<void> => {
  const db = await getDb();
  await db.executeSql(
    'INSERT INTO products (name, price, categoryId) VALUES (?, ?, ?)',
    [name, price, categoryId]
  );
};

export const fetchProductsByCategoryadmin = async (
  categoryId: number
): Promise<Product[]> => {
  const db = await getDb();
  const [results] = await db.executeSql(
    'SELECT * FROM products WHERE categoryId = ?',
    [categoryId]
  );

  const rows = results.rows;
  const arr: Product[] = [];
  for (let i = 0; i < rows.length; i++) arr.push(rows.item(i));
  return arr;
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM categories');
    const items: Category[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM products');
    const items: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId],
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      [
        product.name,
        product.price,
        product.categoryId,
        product.img,
        product.id,
      ],
    );
    console.log('✅ Product updated with image');
  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.executeSql('DELETE FROM products WHERE id = ?', [id]);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (cartId: number) => {
  try {
    const db = await getDb();
    await db.executeSql(`DELETE FROM cart WHERE id = ?`, [cartId]);
    console.log('✅ Removed from cart');
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
  }
};

// Lấy tất cả sản phẩm trong giỏ
export const fetchCartItems = async (): Promise<
  (Product & { cartId: number; quantity: number; img: string })[]
> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(`
      SELECT cart.id as cartId, cart.quantity, products.*, COALESCE(cart.img, products.img) as img
      FROM cart
      JOIN products ON cart.productId = products.id
    `);
    const items: any[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching cart items:', error);
    return [];
  }
};

export const addToCart = async (
  productId: number,
  quantity: number,
  img: string,
): Promise<boolean> => {
  try {
    const db = await getDb();

    // Kiểm tra xem sản phẩm đã có trong cart chưa
    const [results] = await db.executeSql(
      'SELECT * FROM cart WHERE productId = ?',
      [productId],
    );

    if (results.rows.length > 0) {
      // Nếu có rồi thì tăng quantity
      const existingQuantity = results.rows.item(0).quantity;
      await db.executeSql('UPDATE cart SET quantity = ? WHERE productId = ?', [
        existingQuantity + quantity,
        productId,
      ]);

      // Cập nhật img nếu chưa có
      const defaultImg = img; // hoặc một giá trị mặc định
      await db.executeSql(
        `UPDATE cart SET img = ? WHERE productId = ? AND img IS NULL`,
        [defaultImg, productId],
      );

      console.log('✅ Cart updated');
    } else {
      // Nếu chưa có thì thêm mới
      await db.executeSql(
        'INSERT INTO cart (productId, quantity, img) VALUES (?, ?, ?)',
        [productId, quantity, img],
      );
      console.log('✅ Added to cart');
    }

    return true;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    return false;
  }
};
//---------------lọc sản phẩm theo loại------
export const fetchProductsByCategory = async (
  categoryId: number,
): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM products WHERE categoryId = ?',
      [categoryId],
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};

//tìm kiếm sản phẩm theo tên sản phẩm hoặc theo tên loại
export const searchProductsByNameOrCategory = async (
  keyword: string,
): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `
      SELECT products.* FROM products
      JOIN categories ON products.categoryId = categories.id
      WHERE products.name LIKE ? OR categories.name LIKE ?
      `,
      [`%${keyword}%`, `%${keyword}%`],
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('❌ Error searching by name or category:', error);
    return [];
  }
};

export const addToHistory = async (
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[],
  total: number,
) => {
  try {
    const db = await getDb();
    const date = new Date().toISOString();
    await db.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO history (productId, name, quantity, price, total, date) VALUES (?, ?, ?, ?, ?, ?)',
          [item.id, item.name, item.quantity, item.price, total, date],
        );
      });
    });
    console.log('✅ Items added to history');
  } catch (error) {
    console.error('❌ Error adding to history:', error);
  }
};

// Lấy tất cả lịch sử mua hàng
export const fetchHistory = async (): Promise<HistoryItem[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM history ORDER BY date DESC',
    );
    const items: HistoryItem[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    return [];
  }
};
//------------------crud user-----------------
// ➕ Thêm người dùng
export const addUser = async (
  username: string,
  password: string,
  role: string,
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role],
    );
    console.log('✅ User added');
    return true; // Thêm thành công
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false; // Thêm thất bại
  }
};

// 🔄 Cập nhật người dùng
export const updateUser = async (user: User) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [user.username, user.password, user.role, user.id],
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  }
};

// ❌ Xóa người dùng theo id
export const deleteUser = async (id: number) => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
    console.log('✅ User deleted');
  } catch (error) {
    console.error('❌ Error deleting user:', error);
  }
};

// 🔍 Lấy danh sách tất cả người dùng
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users');
    const users: User[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      users.push(rows.item(i));
    }
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

// 🔑 Lấy người dùng theo username & password (dùng cho đăng nhập)
export const getUserByCredentials = async (
  username: string,
  password: string,
): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user by credentials:', error);
    return null;
  }
};

// 🔍 Lấy người dùng theo id
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users WHERE id = ?', [
      id,
    ]);
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user by id:', error);
    return null;
  }
};
