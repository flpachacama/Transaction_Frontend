import React, {useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput} from 'react-native';
import {getProducts} from '../api';
import ProductCard from '../components/ProductCard';
import {Product} from '../types';
import {useAppState} from '../hooks/useAppState';
import {mapApiError} from '../utils/errorMessages';

type Props = {
  onSelect?: (item: Product) => void;
};

const DEBOUNCE_MS = 400;

const ProductList: React.FC<Props> = ({onSelect}) => {
  const {setLoading, setError, isLoading} = useAppState();
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setAllItems(data);
        setItems(data);
      } catch (err: any) {
        const {message, code} = mapApiError(err);
        setError({code, message});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setLoading, setError]);

  useEffect(() => {
    // debounce filter
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // @ts-ignore
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

  if (isLoading) {
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

      <View style={styles.counterWrap}>
        <Text>{`Total: ${items.length}`}</Text>
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
  counterWrap: {padding: 8, alignItems: 'flex-end', borderBottomWidth: 1, borderColor: '#f5f5f5'},
});

export default ProductList;
