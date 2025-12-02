import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { fetchHistory, HistoryItem, updateOrderStatus } from '../database/db';
import AdminNav from './AdminNav';

export default function AdminOrder() {
  const [orders, setOrders] = useState<HistoryItem[]>([]);

  const loadOrders = async () => {
    const data = await fetchHistory();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleChangeStatus = (order: HistoryItem) => {
    Alert.alert('Cập nhật trạng thái', `Đơn hàng: ${order.name}`, [
      {
        text: 'Đang xử lý',
        onPress: async () => await changeStatus(order.id!, 'Đang xử lý'),
      },
      {
        text: 'Đã giao',
        onPress: async () => await changeStatus(order.id!, 'Đã giao'),
      },
      {
        text: 'Đã hủy',
        onPress: async () => await changeStatus(order.id!, 'Đã hủy'),
      },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const changeStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    // Tùy chỉnh màu trạng thái
    let statusColor = '#f39c12'; // Đang xử lý
    if (item.status === 'Đã giao') statusColor = '#27ae60';
    else if (item.status === 'Đã hủy') statusColor = '#c0392b';

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, { backgroundColor: statusColor }]}>
            {item.status || 'Đang xử lý'}
          </Text>
        </View>

        <Text style={styles.text}>Số lượng: {item.quantity}</Text>
        <Text style={styles.text}>Giá: {item.price.toLocaleString()} đ</Text>
        <Text style={styles.text}>
          Ngày đặt: {new Date(item.date).toLocaleString()}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleChangeStatus(item)}
        >
          <Text style={styles.btnText}>Cập nhật trạng thái</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>📦 Quản lý đơn hàng</Text>
        {orders.length === 0 ? (
          <Text style={styles.empty}>Chưa có đơn hàng nào.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id!.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
      <AdminNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f4f8' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4a3aff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  status: {
    color: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  text: { fontSize: 16, color: '#34495e', marginBottom: 4 },
  btn: {
    marginTop: 10,
    backgroundColor: '#4a3aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' },
});
