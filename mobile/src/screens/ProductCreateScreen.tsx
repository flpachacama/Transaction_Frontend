import React from 'react';
import {View, StyleSheet} from 'react-native';
import ProductForm from '../components/ProductForm';
import {createProduct, checkProductExists} from '../api';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {useAppState} from '../hooks/useAppState';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductCreate'>;

const ProductCreateScreen: React.FC<Props> = ({navigation}) => {
  const {setError} = useAppState();

  return (
    <View style={styles.container}>
      <ProductForm
        checkExists={checkProductExists}
        onSubmit={createProduct}
        onSuccess={() => {
          setError({code: 200, message: 'Product created successfully!'});
          navigation.navigate('ProductList');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1, padding: 12}});

export default ProductCreateScreen;
