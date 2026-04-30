import React from 'react';
import {View, StyleSheet, Button} from 'react-native';
import ProductDetail from './ProductDetail';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {product} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Edit" onPress={() => navigation.navigate('ProductEdit', {product})} />,
    });
  }, [navigation, product]);

  return (
    <View style={styles.container}>
      <ProductDetail product={product} onBack={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}});

export default ProductDetailScreen;
