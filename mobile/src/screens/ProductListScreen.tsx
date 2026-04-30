import React from 'react';
import {View, StyleSheet} from 'react-native';
import ProductList from './ProductList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Product} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen: React.FC<Props> = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="New" onPress={() => navigation.navigate('ProductCreate')} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ProductList onSelect={(p: Product) => navigation.navigate('ProductDetail', {product: p})} />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});

export default ProductListScreen;
