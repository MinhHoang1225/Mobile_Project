import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import AdminNav from './AdminNav';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct, // <-- cần hàm này trong db.ts
  Category,
} from '../database/db';

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // --- modal thêm sản phẩm ---
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories([...data].reverse());
  };

  const resetForm = () => {
    setName('');
    setEditId(null);
    setShowForm(false);
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Tên loại không được để trống');
    try {
      if (editId) {
        await updateCategory(editId, name);
        Alert.alert('Thành công', 'Cập nhật loại sản phẩm');
      } else {
        await addCategory(name);
        Alert.alert('Thành công', 'Thêm loại sản phẩm');
      }
      resetForm();
      loadCategories();
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Không thể lưu loại sản phẩm');
    }
  };

  const handleEdit = (item: Category) => {
    setName(item.name);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDeleteCategory = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá loại này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
            loadCategories();
          } catch (err) {
            console.log(err);
            Alert.alert('Lỗi', 'Không thể xoá loại');
          }
        },
      },
    ]);
  };

  // --- Mở modal thêm sản phẩm ---
  const handleAddProduct = (category: Category) => {
    setCurrentCategory(category);
    setProductName('');
    setProductPrice('');
    setProductModalVisible(true);
  };

  // --- Lưu sản phẩm ---
  const handleSaveProduct = async () => {
    if (!productName.trim() || !productPrice.trim()) {
      return Alert.alert('Lỗi', 'Tên sản phẩm và giá không được để trống');
    }

    if (!currentCategory) return;

    try {
      await addProduct({
        name: productName,
        price: parseFloat(productPrice),
        categoryId: currentCategory.id,
      });
      Alert.alert('Thành công', 'Đã thêm sản phẩm');
      setProductModalVisible(false);
    } catch (err) {
      console.log(err);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
    }
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryId}>ID: {item.id}</Text>
      </View>

      <View style={{ marginTop: 8 }}>
        {/* Hàng 1: Sửa + Xoá */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.btnText}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() => handleDeleteCategory(item.id)}
          >
            <Text style={styles.btnText}>Xoá</Text>
          </TouchableOpacity>
        </View>

        {/* Hàng 2: Thêm sản phẩm */}
        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            style={styles.btnAddProduct}
            onPress={() => handleAddProduct(item)}
          >
            <Text style={styles.btnText}>➕ Thêm sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>📂 Danh sách loại sản phẩm</Text>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nhập tên loại..."
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btnSave} onPress={handleSaveCategory}>
            <Text style={styles.btnSaveText}>
              {editId ? '💾 Cập nhật' : '➕ Thêm mới'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancel} onPress={resetForm}>
            <Text style={styles.btnCancelText}>❌ Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showForm && (
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.btnAddText}>➕ Thêm loại sản phẩm</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
            Không có loại sản phẩm nào
          </Text>
        }
      />

      <AdminNav />

      {/* --- Modal Thêm Sản Phẩm --- */}
      <Modal
        visible={productModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}
            >
              Thêm sản phẩm cho: {currentCategory?.name}
            </Text>

            <TextInput
              placeholder="Tên sản phẩm"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />
            <TextInput
              placeholder="Giá sản phẩm"
              value={productPrice}
              onChangeText={setProductPrice}
              style={styles.input}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.btnSave}
              onPress={handleSaveProduct}
            >
              <Text style={styles.btnSaveText}>💾 Lưu sản phẩm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setProductModalVisible(false)}
            >
              <Text style={styles.btnCancelText}>❌ Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminCategory;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#dad3aff6',
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
  btnSave: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnSaveText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  btnCancel: {
    backgroundColor: '#dad3aff6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfc8a7',
  },
  btnCancelText: { color: '#333', fontWeight: 'bold', textAlign: 'center' },
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
  categoryId: { color: '#777' },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  btnEdit: {
    backgroundColor: '#ccc189f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnDelete: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnAddProduct: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
});
