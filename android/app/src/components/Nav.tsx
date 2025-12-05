import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Nav = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Category')}
      >
        <Text style={styles.navText}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={styles.navText}>Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.navText}>Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('HistoryItemScreen')}
      >
        <Text style={styles.navText}>History Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('User')}
      >
        <Text style={styles.navText}>User</Text>
      </TouchableOpacity>

      
      {/* <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TestDB')}
      >
        <Text style={styles.navText}>History Order</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#ffffff',
    elevation: 5, // shadow trên Android
    shadowColor: '#000', // shadow trên iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
});

export default Nav;
