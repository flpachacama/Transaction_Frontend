import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import {Product} from '../types';

const HomeScreen = () => {
  const [selected, setSelected] = useState<Product | null>(null);

  if (selected) {
    return <ProductDetail product={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <View style={styles.container}>
      <ProductList onSelect={(p) => setSelected(p)} />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});

export default HomeScreen;
