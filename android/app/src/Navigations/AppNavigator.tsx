// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../components/Home';
import Products from '../components/Products';
import ProductDetail from '../components/ProductDetail';
import Login from '../components/Login';
import Signup from '../components/SignUp';
import AdminDashboard from '../components/AdminDashboard';
import User from '../components/User';
import Cart from '../components/Cart';
import SplashScreen from '../components/SplashScreen';
import AdminCategory from '../components/AdminCategory';
import AdminProduct from '../components/AdminProduct';
import AdminSetting from '../components/AdminSetting';
import Category from '../components/Category';
import ProductByCategory from '../components/ProductByCategory';
import TestDB from '../components/testDB';
import Payment from '../components/Payment';
import HistoryItemScreen from '../components/HistoryItemScreen';
import AdminUser from '../components/AdminUser';
import AdminOrder from '../components/AdminOrder';

export type RootStackParamList = {
  SplashScreen: undefined;
  Home: undefined;
  Products: undefined;
  ProductDetail: { product: any };
  SignUp: undefined;
  Login: undefined;
  AdminDashboard: undefined;
  User: undefined;
  Cart: undefined;
  AdminCategory: undefined;
  AdminProduct: undefined;
  AdminSetting: undefined;
  Category: undefined;
  ProductByCategory: { categoryId: number };
  TestDB: undefined;
  Payment: { total: number; items: any[] };
  HistoryItemScreen: undefined;
  AdminUser: undefined;
  AdminOrder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // token bạn lưu khi login
        if (token) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("SplashScreen");
        }
      } catch (error) {
        setInitialRoute("SplashScreen");
      }
    };

    checkLoginStatus();
  }, []);

  // Tránh render khi chưa xác định route
  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}  // Splash không có header
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="AdminCategory" component={AdminCategory} /> 
        <Stack.Screen name="AdminProduct" component={AdminProduct} />
        <Stack.Screen name="AdminSetting" component={AdminSetting} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="ProductByCategory" component={ProductByCategory} />
        <Stack.Screen name="TestDB" component={TestDB} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="HistoryItemScreen" component={HistoryItemScreen} />
        <Stack.Screen name="AdminUser" component={AdminUser} />
                <Stack.Screen name="AdminOrder" component={AdminOrder} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
