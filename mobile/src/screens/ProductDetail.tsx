import React from 'react';
import {View, Text, Image, StyleSheet, Button, ScrollView} from 'react-native';
import {Product} from '../types';

type Props = {
  product: Product;
  onBack: () => void;
};

const ProductDetail: React.FC<Props> = ({product, onBack}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product.logo ? (
        <Image source={{uri: product.logo}} style={styles.logo} />
      ) : (
        <View style={[styles.logo, {backgroundColor: '#ddd'}]} />
      )}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <Text style={styles.label}>Release</Text>
      <Text>{product.date_release}</Text>
      <Text style={styles.label}>Revision</Text>
      <Text>{product.date_revision}</Text>
      <View style={{marginTop: 20}}>
        <Button title="Back" onPress={onBack} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, alignItems: 'center'},
  logo: {width: 200, height: 200, borderRadius: 8, marginBottom: 16},
  name: {fontSize: 20, fontWeight: '700', marginBottom: 12},
  label: {marginTop: 12, fontWeight: '600'},
  desc: {textAlign: 'center', marginTop: 6},
});

export default ProductDetail;
