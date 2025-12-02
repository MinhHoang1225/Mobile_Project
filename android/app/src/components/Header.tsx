import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
      };
      loadUser();
    }, [])
  );

  return (
    <View style={styles.header}>
      {user && (
        <View style={styles.userContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.userName}>Xin chào, {user.username}</Text>
            <Text style={styles.userSubtitle}>Ngày hôm nay của bạn như thế nào?</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#dad3aff6',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // bo tròn hoàn hảo
    marginRight: 12,  // khoảng cách avatar và text
  },
  textContainer: {
    flexDirection: 'column',
  },
  userName: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
  },
  userSubtitle: {
    color: '#555',
    fontSize: 14,
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default Header;
