import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addToHistory, removeFromCart } from '../database/db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

export default function Payment() {
  const route = useRoute();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;
  const navigation = useNavigation<NavigationProp>();
  const { total, items } = route.params;

  // ➕ State nhập thông tin
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // ➕ Validate trước khi thanh toán
  const validateBeforePay = () => {
    if (!fullname.trim() || !phone.trim() || !address.trim()) {
      return Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin giao hàng.');
    }

    handleConfirm();
  };

  const handleConfirm = async () => {
    Alert.alert(
      'Xác nhận thanh toán',
      `Bạn muốn thanh toán ${total.toLocaleString()} đ?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              await addToHistory(items, total);
              await Promise.all(items.map((item) => removeFromCart(item.cartId)));
              Alert.alert('🎉 Thành công', 'Thanh toán hoàn tất!');

              navigation.navigate('HistoryItemScreen');
            } catch (error) {
              console.error('❌ Thanh toán lỗi:', error);
              Alert.alert('❌ Lỗi', 'Không thể thanh toán. Thử lại sau.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>💳 Thanh toán</Text>

      {/* ====== THÔNG TIN GIAO HÀNG ====== */}
      <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ tên người nhận"
        value={fullname}
        onChangeText={setFullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Địa chỉ nhận hàng"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      {/* ====== SẢN PHẨM ====== */}
      <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>

      {items.map((item, i) => (
        <View key={i} style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng cộng:</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString()} đ</Text>
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity style={styles.btn} onPress={validateBeforePay}>
        <Text style={styles.btnText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f8', padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4a3aff',
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#333' },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemQuantity: { fontSize: 14, color: '#777', marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#4a3aff' },

  totalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#e74c3c' },

  btn: {
    backgroundColor: '#4a3aff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
