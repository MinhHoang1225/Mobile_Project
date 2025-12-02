import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Category,
  fetchCategories,
} from '../database/db';
import Nav from './Nav';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigations/AppNavigator';

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ⭐ tạo biến navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories([...data].reverse());
  };

  const handleCategoryClick = (categoryId: number, name: string) => {
    setSelectedId(categoryId);

    navigation.navigate("ProductByCategory", { categoryId, name });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f5ff' }}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>🛍 Danh sách loại sản phẩm</Text>
        </View>

        <View style={styles.container}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.box, selectedId === cat.id && styles.activeBox]}
              onPress={() => handleCategoryClick(cat.id, cat.name)}
            >
              <Text
                style={[
                  styles.boxText,
                  selectedId === cat.id && styles.activeText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Nav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
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
  box: {
    width: '48%',
    height: 80,
    backgroundColor: '#dad3aff6',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBox: {
    backgroundColor: '#000',
  },
  boxText: {
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
