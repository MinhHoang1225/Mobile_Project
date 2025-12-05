// components/BottomNav.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminNav = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminDashboard')}
      >
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminCategory')}
      >
        <Text style={styles.navText}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminProduct')}
      >
        <Text style={styles.navText}>Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminUser')}
      >
        <Text style={styles.navText}>User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminOrder')}
      >
        <Text style={styles.navText}>Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('AdminSetting')}
      >
        <Text style={styles.navText}>Setting</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000ff',
  },
});

export default AdminNav;
