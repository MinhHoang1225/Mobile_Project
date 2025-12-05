import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';
import AdminNav from './AdminNav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminSetting'>;

const AdminSetting = () => {
  const navigation = useNavigation<NavigationProp>();
  const [admin, setAdmin] = useState<{ username: string; role: string } | null>(null);

  // Load user info
  useEffect(() => {
    const loadAdmin = async () => {
      const logged = await AsyncStorage.getItem('loggedInUser');
      setAdmin(logged ? JSON.parse(logged) : null);
    };
    loadAdmin();
  }, []);

  const handleLogout = () => {
    Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          navigation.reset({
            index: 0,
            routes: [{ name: 'SplashScreen' }],
          });
        },
      },
    ]);
  };

  if (!admin || admin.role !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.notAdminText}>❌ Bạn không có quyền truy cập trang này</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
              <Text style={styles.title}>⚙️ Admin Setting</Text>
      <ScrollView contentContainerStyle={styles.content}>


        <Text style={styles.welcomeText}>
          Xin chào, {admin.username} 👋
        </Text>
        <Text style={styles.message}>
          Tại đây bạn có thể quản lý cài đặt và thông tin của hệ thống.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      <AdminNav />
    </View>
  );
};

export default AdminSetting;

// ===== STYLE =====
const styles = StyleSheet.create({
  content: {
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notAdminText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#dad3aff6',
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#dad3aff6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
