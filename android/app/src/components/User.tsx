import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';
import Nav from './Nav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'User'>;

const UserScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  // Modal cập nhật
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // Kiểm tra AsyncStorage khi màn hình focus
  useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const parsed = loggedInUser ? JSON.parse(loggedInUser) : null;
        setUser(parsed);
        setNewUsername(parsed?.username || '');
      };
      checkLogin();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          setUser(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'SplashScreen' }],
          });
        },
      },
    ]);
  };

  const handleUpdateUser = async () => {
    if (!newUsername.trim()) {
      return Alert.alert('Lỗi', 'Tên không được để trống');
    }
    try {
      const updatedUser = { ...user, username: newUsername };
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setModalVisible(false);
      Alert.alert('🎉 Thành công', 'Cập nhật thông tin thành công');
    } catch (error) {
      console.error('❌ Cập nhật lỗi:', error);
      Alert.alert('❌ Lỗi', 'Không thể cập nhật thông tin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 User</Text>
</View>
      <View style={styles.content}>
        
        {user ? (
          <>
            <Text style={styles.welcomeText}>Xin chào, {user.username} 👋</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>✏️ Cập nhật thông tin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>🚪 Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>📝 Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>🔑 Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Modal cập nhật thông tin */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật tên</Text>
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Nhập tên mới..."
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdateUser}>
                <Text style={styles.modalButtonText}>💾 Lưu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#e74c3c' }]}>❌ Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Nav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
   header: {
    padding: 16,
    backgroundColor: '#dad3aff6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4b3f72',
    marginBottom: 12,
  },
  welcomeText: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  button: {
    backgroundColor: '#dad3aff6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    flex: 1,
    backgroundColor: '#4a3aff',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#dad3aff6' },
});

export default UserScreen;
