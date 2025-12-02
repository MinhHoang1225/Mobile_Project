import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { fetchProductsByCategory, Product } from '../database/db';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

export default function ProductByCategory() {
  const route = useRoute<any>();
  const { categoryId, name } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    const data = await fetchProductsByCategory(categoryId);
    setProducts(data);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        🛒 Sản phẩm thuộc loại: {name}
      </Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
            Không có sản phẩm nào
          </Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3a2d70',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1dbf7',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  price: {
    marginTop: 5,
    color: '#d35400',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
