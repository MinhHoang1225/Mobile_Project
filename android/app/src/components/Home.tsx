import React from 'react';
import {
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Nav from './Nav';
import Header from './Header';
import { RootStackParamList } from '../Navigations/AppNavigator';
import { popularProducts, images, Product } from '../database/db';

const { width } = Dimensions.get('window');

const banners = [
  require('../assets/banner1.png'),
  require('../assets/banner2.png'),
  require('../assets/banner3.png'),
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        {' '}
        <Image source={images[item.img]} style={styles.image} />{' '}
      </TouchableOpacity>{' '}
      <View>
        {' '}
        <Text style={styles.productName}>{item.name}</Text>{' '}
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>{' '}
      </View>{' '}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {' '}
      <Header />
      {/* Banner */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        {banners.map((banner, index) => (
          <Image
            key={index}
            source={banner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {/* Popular Products */}
      <Text style={styles.title}>🛒 Sản phẩm nổi bật</Text>
      <FlatList
        data={popularProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có sản phẩm nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Nav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    height: 550,
    marginBottom: 20,
  },
  bannerImage: {
    width: width,
    height: 200,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  productPrice: {
    fontSize: 15,
    color: '#e63946',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default Home;
