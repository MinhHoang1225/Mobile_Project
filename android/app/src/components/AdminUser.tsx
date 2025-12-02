import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import AdminNav from "./AdminNav";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  User,
} from "../database/db";
import RNPickerSelect from "react-native-picker-select";

const AdminUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers([...data].reverse());
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setRole(null);
    setEditId(null);
    setShowForm(false);
  };

  // ❗ CHỈ CHO PHÉP CẬP NHẬT, KHÔNG ĐƯỢC THÊM USER
  const handleSaveUser = async () => {
    if (!username.trim() || !password || !role) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
    }

    try {
      if (editId !== null) {
        await updateUser({ id: editId, username, password, role });
        Alert.alert("✔️ Thành công", "Cập nhật user thành công");
      } else {
        Alert.alert("🚫 Không thể thêm", "Hệ thống không cho phép thêm người dùng mới");
      }

      resetForm();
      loadUsers();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể lưu user");
    }
  };

  const handleEdit = (item: User) => {
    setUsername(item.username);
    setPassword(item.password);
    setRole(item.role);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn xoá người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(id);
            loadUsers();
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>👤 {item.username}</Text>
        <Text>Role: {item.role}</Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>👥 Quản lý người dùng</Text>

      {/* 🔧 FORM CHỈ DÙNG CHO EDIT */}
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          <TextInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setRole(value)}
              items={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
              placeholder={{ label: "Chọn vai trò...", value: null }}
              value={role}
              style={pickerSelectStyles}
            />
          </View>

          <TouchableOpacity style={styles.btnSave} onPress={handleSaveUser}>
            <Text style={styles.btnSaveText}>💾 Cập nhật</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancel} onPress={resetForm}>
            <Text style={styles.btnCancelText}>❌ Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ❌ Không hiển thị nút thêm người dùng */}
      {!showForm && <></>}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
            Chưa có người dùng nào
          </Text>
        }
      />

      <AdminNav />
    </View>
  );
};

export default AdminUser;

// ======= STYLE =======
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: "#dad3aff6",
    color: "#333",
  },

  formContainer: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6e3d1",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#faf9f4",
    padding: 10,
    marginBottom: 12,
    color: "#333",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    height: 45,
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  btnSave: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  btnSaveText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  btnCancel: {
    backgroundColor: "#dad3aff6",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfc8a7",
  },

  btnCancelText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee8cf",
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  btnEdit: {
    backgroundColor: "#ccc189f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },

  btnDelete: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { paddingHorizontal: 10, paddingVertical: 12, fontSize: 16 },
  inputAndroid: { paddingHorizontal: 10, paddingVertical: 8, fontSize: 16 },
});
