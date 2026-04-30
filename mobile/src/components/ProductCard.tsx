import React from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
import {Product} from '../types';

type Props = {
  item: Product;
  onPress?: (item: Product) => void;
};

const ProductCard: React.FC<Props> = ({item, onPress}) => {
  const short = item.description?.length > 80 ? item.description.slice(0, 77) + '...' : item.description;
  const imageSource = item.logo ? {uri: item.logo} : null;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(item)}>
      {imageSource ? (
        <Image source={imageSource} style={styles.logo} resizeMode="cover" />
      ) : (
        <View style={[styles.logo, styles.placeholder]} />
      )}
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{short}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center'},
  logo: {width: 64, height: 64, borderRadius: 8, backgroundColor: '#ddd'},
  placeholder: {justifyContent: 'center', alignItems: 'center'},
  body: {flex: 1, marginLeft: 12},
  name: {fontSize: 16, fontWeight: '600'},
  desc: {fontSize: 12, color: '#666', marginTop: 4},
});

export default ProductCard;
