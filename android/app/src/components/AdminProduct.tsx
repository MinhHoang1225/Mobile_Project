import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import AdminNav from './AdminNav';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
  fetchCategories,
  Category
} from '../database/db';
import RNPickerSelect from 'react-native-picker-select';

const AdminProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Product form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts([...data].reverse());
  };

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategoryId(null);
    setEditId(null);
    setShowForm(false);
  };

const handleSaveProduct = async () => {
  if (!name.trim() || !price || !categoryId) {
    return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm');
  }

  const productData = {
    name: name.trim(),
    price: Number(price),
    categoryId: categoryId,
  };

  try {
    if (editId !== null) { // an toàn hơn check editId
      await updateProduct({ ...productData, id: editId });
      Alert.alert('Thành công', 'Cập nhật sản phẩm thành công');
    } else {
      await addProduct(productData);
      Alert.alert('Thành công', 'Thêm sản phẩm mới thành công');
    }
    resetForm();
    loadProducts();
  } catch (err) {
    console.error(err);
    Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
  }
};

  const handleEdit = (item: Product) => {
    setName(item.name);
    setPrice(item.price.toString());
    setCategoryId(item.categoryId);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            loadProducts();
          } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể xoá sản phẩm');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => {
    const categoryName = categories.find(c => c.id === item.categoryId)?.name || '';
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ProductName}>{item.name}</Text>
          <Text>Giá: {item.price} VNĐ</Text>
          <Text>Loại: {categoryName}</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
            <Text style={styles.btnText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>📦 Quản lý sản phẩm</Text>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput placeholder="Tên sản phẩm" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Giá sản phẩm" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
<View style={styles.pickerContainer}>
  <RNPickerSelect
    onValueChange={(value) => setCategoryId(value)}
    items={categories.map(c => ({ label: c.name, value: c.id }))}
    value={categoryId}
    placeholder={{ label: 'Chọn loại sản phẩm...', value: null }}
    style={pickerSelectStyles}
  />
</View>


          <TouchableOpacity style={styles.btnSave} onPress={handleSaveProduct}>
            <Text style={styles.btnSaveText}>{editId ? '💾 Cập nhật' : '➕ Thêm'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancel} onPress={resetForm}>
            <Text style={styles.btnCancelText}>❌ Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showForm && (
        <TouchableOpacity style={styles.btnAdd} onPress={() => setShowForm(true)}>
          <Text style={styles.btnAddText}>➕ Thêm sản phẩm</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>Chưa có sản phẩm nào</Text>}
      />

      <AdminNav />
    </View>
  );
};

export default AdminProduct;


// ======= STYLE =======
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#dad3aff6',        // màu chủ đạo
    color: '#333',
  },

  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e6e3d1',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#faf9f4',
    padding: 10,
    marginBottom: 12,
    color: '#333',
  },

  // NÚT THÊM
  btnAdd: {
    backgroundColor: '#dad3aff6',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfc8a7',
    elevation: 2,
  },

  btnAddText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // NÚT LƯU
  btnSave: {
    backgroundColor: '#333',    // nút save dùng màu tối cho nổi bật
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  btnSaveText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // NÚT HỦY
  btnCancel: {
    backgroundColor: '#dad3aff6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfc8a7',
  },

  btnCancelText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // CARD CATEGORY
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee8cf',
  },

  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },

  categoryId: {
    color: '#777',
  },

  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // NÚT SỬA
  btnEdit: {
    backgroundColor: '#ccc189f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },

  // NÚT XÓA
  btnDelete: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ProductName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },

  ProductId: {
    color: '#666',
  },
    pickerContainer: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { paddingHorizontal: 10, paddingVertical: 12, fontSize: 16 },
  inputAndroid: { paddingHorizontal: 10, paddingVertical: 8, fontSize: 16 },

});
