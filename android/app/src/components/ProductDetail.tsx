import React, { useState } from 'react';
import {
View,
Text,
Image,
StyleSheet,
TouchableOpacity,
Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../Navigations/AppNavigator';
import { addToCart } from '../database/db';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetail = () => {
const route = useRoute<ProductDetailRouteProp>();
const navigation = useNavigation();
const { product } = route.params;
const [quantity, setQuantity] = useState(1);
const categoryName = product.categoryName || `ID: ${product.categoryId}`;

const getImageSource = (img: string) => {
if (img.startsWith('file://') || img.startsWith('content://') || img.startsWith('http'))
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

const handleAddToCart = async () => {
  try {
    await addToCart(product.id, quantity, product.img); // dùng product.img
    Alert.alert('Thành công', `${quantity} sản phẩm đã được thêm vào giỏ hàng 🛒`);
  } catch (error) {
    console.error(error);
    Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
  }
};


return (
   <View style={styles.container}>
<TouchableOpacity
style={styles.backButton}
onPress={() => navigation.goBack()}> <Text style={styles.backText}>Back</Text> </TouchableOpacity>


  <View style={styles.card}>
    <Image source={getImageSource(product.img)} style={styles.image} />
    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
    <Text style={styles.category}>Loại: {categoryName}</Text>

    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
      >
        <Text style={styles.qtyText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.qtyValue}>{quantity}</Text>

      <TouchableOpacity
        style={styles.qtyBtn}
        onPress={() => setQuantity(prev => prev + 1)}
      >
        <Text style={styles.qtyText}>+</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
      <Text style={styles.addButtonText}>🛒 Thêm vào giỏ hàng</Text>
    </TouchableOpacity>
  </View>
</View>


);
};

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f2f2f7', padding: 16 },
backButton: {
alignSelf: 'flex-start',
marginBottom: 16,
paddingVertical: 6,
paddingHorizontal: 12,
borderRadius: 8,
backgroundColor: '#dad3aff6',
elevation: 2,
},
backText: { fontSize: 14, fontWeight: '700', color: '#000' },
card: {
flex: 1,
backgroundColor: '#fff',
borderRadius: 16,
padding: 20,
alignItems: 'center',
elevation: 4,
shadowColor: '#000',
shadowOpacity: 0.1,
shadowOffset: { width: 0, height: 3 },
shadowRadius: 6,
},
image: { width: 250, height: 250, borderRadius: 12, marginBottom: 20, borderWidth: 2, borderColor: '#2980b9' },
name: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
price: { fontSize: 20, fontWeight: '600', color: '#e74c3c', marginBottom: 10 },
category: { fontSize: 18, fontWeight: '500', color: '#555', marginBottom: 20 },
addButton: { backgroundColor: '#dad3aff6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, elevation: 2 },
addButtonText: { color: '#000000', fontSize: 16, fontWeight: '700' },
quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
qtyBtn: { backgroundColor: '#dad3aff6', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
qtyText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
qtyValue: { fontSize: 18, fontWeight: '600', marginHorizontal: 12, minWidth: 30, textAlign: 'center' },
});

export default ProductDetail;
