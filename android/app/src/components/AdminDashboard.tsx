import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import AdminNav from "./AdminNav";
import { fetchDashboardStats } from "../database/db";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator'; // path đến navigator của bạn

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadStats = async () => {
      const result = await fetchDashboardStats();
      setStats(result);
    };
    loadStats();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📂 Dashboard</Text>

        {/* Button chuyển sang Home user */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')} // điều hướng sang Home
        >
          <Text style={styles.homeButtonText}>Xem Home User</Text>
        </TouchableOpacity>

        {!stats ? (
          <Text style={{ fontSize: 16 }}>Đang tải dữ liệu...</Text>
        ) : (
          <>
            <View style={{ padding: 20 }}>
              {/* GRID 2 CỘT */}
              <View style={styles.grid}>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.title}>Tổng danh mục</Text>
                  <Text style={styles.number}>{stats.totalCategories}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.title}>Tổng sản phẩm</Text>
                  <Text style={styles.number}>{stats.totalProducts}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.title}>Tổng người dùng</Text>
                  <Text style={styles.number}>{stats.totalUsers}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.title}>Tổng lịch sử đơn hàng</Text>
                  <Text style={styles.number}>{stats.totalHistory}</Text>
                </TouchableOpacity>
              </View>

              {/* FULL WIDTH CARD */}
              <View style={styles.topCard}>
                <Text style={styles.title}>🔥 Sản phẩm bán chạy nhất</Text>
                <Text style={styles.topName}>{stats.topProduct}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <AdminNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#dad3aff6',
    color: '#333',
  },
  homeButton: {
    backgroundColor: '#dad3aff6',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  homeButtonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: 15,
    backgroundColor: "#dad3aff6",
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  number: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  topCard: {
    padding: 20,
    backgroundColor: "#ffe9d6",
    borderRadius: 12,
    marginTop: 10,
  },
  topName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    color: "#e67e22",
  },
});

export default AdminDashboard;
