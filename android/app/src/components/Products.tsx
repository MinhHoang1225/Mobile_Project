import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';
import { products as productsData, images, Product } from '../database/db';
import Nav from './Nav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

const Products = () => {
  const navigation = useNavigation<NavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    setProducts(productsData.reverse());
  }, []);

  const handleSearch = (keyword: string, min?: string, max?: string) => {
    const k = keyword ?? searchKeyword;
    const minPrice = min !== undefined ? min : priceMin;
    const maxPrice = max !== undefined ? max : priceMax;

    setSearchKeyword(k);
    if (min !== undefined) setPriceMin(min);
    if (max !== undefined) setPriceMax(max);

    let results = productsData;

    // lọc theo tên
    if (k.trim()) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(k.toLowerCase()),
      );
    }

    // lọc theo giá tối thiểu
    if (minPrice.trim()) {
      results = results.filter(p => p.price >= Number(minPrice));
    }

    // lọc theo giá tối đa
    if (maxPrice.trim()) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    setProducts(results.reverse());
  };

  const getImageSource = (img: string) => images[img] || images['t-shirt.jpg'];

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={getImageSource(item.img)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f5ff' }}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍 Danh sách sản phẩm</Text>

        <TextInput
          style={styles.search}
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchKeyword}
          onChangeText={text => handleSearch(text)}
        />

        {/* Lọc giá */}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TextInput
            style={[styles.search, { flex: 1, marginRight: 5 }]}
            placeholder="Giá từ..."
            keyboardType="numeric"
            value={priceMin}
            onChangeText={v => handleSearch(searchKeyword, v, undefined)}
          />

          <TextInput
            style={[styles.search, { flex: 1, marginLeft: 5 }]}
            placeholder="Đến..."
            keyboardType="numeric"
            value={priceMax}
            onChangeText={v => handleSearch(searchKeyword, undefined, v)}
          />
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
            Không có sản phẩm nào
          </Text>
        }
      />
      <Nav />
    </View>
  );
};

const styles = StyleSheet.create({
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
  search: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderColor: '#b5aef3',
    backgroundColor: '#fff',
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
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
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
  price: {
    marginTop: 5,
    color: '#d35400',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Products;
