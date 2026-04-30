import React, {useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput} from 'react-native';
import {getProducts} from '../api';
import ProductCard from '../components/ProductCard';
import {Product} from '../types';

type Props = {
  onSelect?: (item: Product) => void;
};

const DEBOUNCE_MS = 400;

const ProductList: React.FC<Props> = ({onSelect}) => {
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        setAllItems(data);
        setItems(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // debounce filter
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // @ts-ignore setTimeout returns number in RN
    timerRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setItems(allItems);
        return;
      }
      const filtered = allItems.filter((it) => (it.name || '').toLowerCase().includes(q));
      setItems(filtered);
    }, DEBOUNCE_MS) as unknown as number;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, allItems]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search by name..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      {!items.length ? (
        <View style={styles.center}>
          <Text>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({item}) => <ProductCard item={item} onPress={onSelect} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  searchWrap: {padding: 8, borderBottomWidth: 1, borderColor: '#eee'},
  input: {backgroundColor: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ddd'},
});

export default ProductList;
