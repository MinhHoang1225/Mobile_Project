import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { fetchHistory, HistoryItem } from '../database/db';
import Nav from './Nav';

export default function HistoryItemScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
  const loadHistory = async () => {
    const data = await fetchHistory();

    // Sắp xếp mới nhất lên đầu
    const sorted = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setHistory(sorted);
  };
  loadHistory();
}, []);


  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
        <Text style={styles.total}>Tổng: {item.total.toLocaleString()} đ</Text>
      </View>
      <Text style={styles.date}>🗓 {new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
              <Text style={styles.title}>🛒 Lịch sử mua hàng</Text>
      </View>
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
    <Nav/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f8',
  },
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quantity: {
    fontSize: 16,
    color: '#34495e',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a3aff',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 50,
  },
});
