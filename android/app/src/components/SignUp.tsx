import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { addUser } from '../database/db';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const Signup = () => {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('user');

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const success = await addUser(username.trim(), password.trim(), role);

      if (success) {
        Alert.alert('Thành công', 'Đăng ký thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại hoặc đăng ký thất bại');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    }
  };

  return (
    <View style={styles.container}>

      {/* Nút Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Đăng Ký</Text>

        <TextInput
          placeholder="Tên đăng nhập"
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />

        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Đã có tài khoản? Đăng nhập ngay</Text>
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

export default Signup;
