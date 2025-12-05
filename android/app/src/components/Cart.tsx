import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Nav from './Nav';
import { fetchCartItems, removeFromCart, Product } from '../database/db';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

export default function Cart() {
  const [cartItems, setCartItems] = useState<
    (Product & { cartId: number; quantity: number })[]
  >([]);

  const loadCart = async () => {
    const items = await fetchCartItems();
    setCartItems(items);
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = (cartId: number) => {
    Alert.alert(
      'Xóa sản phẩm',
      'Bạn chắc chắn muốn xóa khỏi giỏ?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await removeFromCart(cartId);
            setCartItems(prev => prev.filter(item => item.cartId !== cartId));
          },
        },
      ],
      { cancelable: true },
    );
  };

  const getImageSource = (img: string) => {
    if (
      img.startsWith('file://') ||
      img.startsWith('content://') ||
      img.startsWith('http')
    )
      return { uri: img };
    switch (img) {
      case 't-shirt.jpg':
        return require('../assets/book_images/t-shirt.jpg');
      case 'sneaker.jpg':
        return require('../assets/book_images/sneaker.jpg');
      case 'balo.jpg':
        return require('../assets/book_images/balo.jpg');
      case 'pijama.jpg':
        return require('../assets/book_images/pijama.jpg');
      case 'gym.jpg':
        return require('../assets/book_images/gym.jpg');
      default:
        return require('../assets/book_images/t-shirt.jpg');
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const renderItem = ({
    item,
  }: {
    item: Product & { cartId: number; quantity: number; img: string };
  }) => (
    <View style={styles.card}>
      <Image source={getImageSource(item.img)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price.toLocaleString()} đ x {item.quantity}
        </Text>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(item.cartId)}
        >
          <Text style={styles.removeText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f5ff' }}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.cartId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={<Text style={styles.header}>🛒 Giỏ hàng</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        }
        ListFooterComponent={
          cartItems.length > 0 ? (
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <Text style={styles.total}>
                Tổng tiền: {totalPrice.toLocaleString()} đ
              </Text>

              <TouchableOpacity
                style={styles.payBtn}
                onPress={() =>
                  navigation.navigate('Payment', {
                    total: totalPrice,
                    items: cartItems,
                  })
                }
              >
                <Text style={styles.payText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    color: '#4b3f72',
    backgroundColor: '#dad3aff6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
  },
  payBtn: {
    backgroundColor: '#4a3aff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  payText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1dbf7',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 90, height: 90, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: 'bold', color: '#3a2d70' },
  price: { marginTop: 5, color: '#d35400', fontWeight: 'bold', fontSize: 16 },
  removeBtn: {
    marginTop: 8,
    backgroundColor: '#b45f5fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  removeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
    textAlign: 'right',
    color: '#000000f6',
  },
});
