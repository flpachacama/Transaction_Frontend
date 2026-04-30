import React from 'react';
import {View, StyleSheet} from 'react-native';
import ProductForm from '../components/ProductForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, Product} from '../types';
import {updateProduct} from '../api';
import {useAppState} from '../hooks/useAppState';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductEdit'>;

const ProductEditScreen: React.FC<Props> = ({route, navigation}) => {
  const {product} = route.params;
  const {setError} = useAppState();

  return (
    <View style={styles.container}>
      <ProductForm
        initial={product}
        isEdit
        onSubmit={async (payload: Product) => await updateProduct(product.id, payload)}
        onSuccess={() => {
          setError({code: 200, message: 'Product updated successfully!'});
          navigation.navigate('ProductList');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1, padding: 12}});

export default ProductEditScreen;
