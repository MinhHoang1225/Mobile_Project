// TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../components/Home';
import Products from '../components/Products';
import { Ionicons } from '@expo/vector-icons';

export type BottomTabParamList = {
  Home: undefined;
  Products: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Home' ? 'home' : 'cube';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2980b9',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Products" component={Products} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
