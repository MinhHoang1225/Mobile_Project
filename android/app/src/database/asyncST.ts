export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const db = await getDb();

    db.transaction(
      (tx) => {
        // Tạo bảng categories
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            name TEXT
          )`
        );

        initialCategories.forEach((category) => {
          tx.executeSql(
            'INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)',
            [category.id, category.name]
          );
        });

        // Tạo bảng products
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            img TEXT,
            categoryId INTEGER,
            FOREIGN KEY (categoryId) REFERENCES categories(id)
          )`
        );

        initialProducts.forEach((product) => {
          tx.executeSql(
            'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
            [product.id, product.name, product.price, product.img, product.categoryId]
          );
        });

        // Tạo bảng users
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
          )`,
          [],
          () => console.log('✅ Users table created'),
          (_, error) => {
            console.error('❌ Error creating users table:', error);
            return false;
          }
        );

        // Thêm tài khoản admin mặc định nếu chưa có
        tx.executeSql(
          `INSERT INTO users (username, password, role)
           SELECT 'admin', '123456', 'admin'
           WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
          [],
          () => console.log('✅ Admin user added'),
          (_, error) => {
            console.error('❌ Error inserting admin:', error);
            return false;
          }
        );
      },
      (error) => console.error('❌ Transaction error:', error),
      () => {
        console.log('✅ Database initialized');
        if (onSuccess) onSuccess();
      }
    );
  } catch (error) {
    console.error('❌ initDatabase outer error:', error);
  }
};

// ➕ Thêm người dùng
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('✅ User added');
    return true;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false;
  }
};

// 🔄 Cập nhật người dùng
export const updateUser = async (user: User): Promise<void> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [user.username, user.password, user.role, user.id]
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  }
};

// ❌ Xóa người dùng theo ID
export const deleteUser = async (id: number): Promise<void> => {
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

// 🔑 Lấy người dùng theo username và password (đăng nhập)
export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    const rows = results.rows;
    return rows.length > 0 ? rows.item(0) : null;
  } catch (error) {
    console.error('❌ Error getting user by credentials:', error);
    return null;
  }
};

// 🔍 Lấy người dùng theo ID
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    const rows = results.rows;
    return rows.length > 0 ? rows.item(0) : null;
  } catch (error) {
    console.error('❌ Error getting user by id:', error);
    return null;
  }
};