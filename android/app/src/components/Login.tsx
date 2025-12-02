import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserByCredentials } from '../database/db';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const user = await getUserByCredentials(username, password);

      if (user) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        if (user.role === 'admin') {
          navigation.navigate('AdminDashboard');
        } else {
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    }
  };

  return (
    <View style={styles.container}>

      {/* NÚT BACK */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Đăng Nhập</Text>

        <TextInput
          placeholder="Tên đăng nhập"
          placeholderTextColor="#666"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />

        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          placeholderTextColor="#666"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f6ef',
    paddingTop: 40
  },

  /* BUTTON BACK */
  backButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    backgroundColor: '#dad3af',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 3
  },
  backText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold'
  },

  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },

  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#333'
  },

  input: { 
    width: '100%', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    marginBottom: 12,
    backgroundColor: '#fafafa'
  },

  button: { 
    backgroundColor: '#dad3af',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%'
  },

  buttonText: { 
    color: '#333', 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 16
  },

  switchText: { 
    marginTop: 15, 
    color: '#a2956d',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
});

export default Login;
