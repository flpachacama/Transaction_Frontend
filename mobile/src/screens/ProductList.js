"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const api_1 = require("../api");
const ProductCard_1 = __importDefault(require("../components/ProductCard"));
const useAppState_1 = require("../hooks/useAppState");
const errorMessages_1 = require("../utils/errorMessages");
const DEBOUNCE_MS = 400;
const ProductList = ({ onSelect }) => {
    const { setLoading, setError, isLoading } = (0, useAppState_1.useAppState)();
    const [allItems, setAllItems] = (0, react_1.useState)([]);
    const [items, setItems] = (0, react_1.useState)([]);
    const [query, setQuery] = (0, react_1.useState)('');
    const timerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const load = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoading(true);
            try {
                const data = yield (0, api_1.getProducts)();
                setAllItems(data);
                setItems(data);
            }
            catch (err) {
                const { message, code } = (0, errorMessages_1.mapApiError)(err);
                setError({ code, message });
            }
            finally {
                setLoading(false);
            }
        });
        load();
    }, [setLoading, setError]);
    (0, react_1.useEffect)(() => {
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
        }, DEBOUNCE_MS);
        return () => {
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, [query, allItems]);
    if (isLoading) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.ActivityIndicator />
      </react_native_1.View>);
    }
    return (<react_native_1.View style={{ flex: 1 }}>
      <react_native_1.View style={styles.searchWrap}>
        <react_native_1.TextInput placeholder="Search by name..." value={query} onChangeText={setQuery} style={styles.input}/>
      </react_native_1.View>

      <react_native_1.View style={styles.counterWrap}>
        <react_native_1.Text>{`Total: ${items.length}`}</react_native_1.Text>
      </react_native_1.View>

      {!items.length ? (<react_native_1.View style={styles.center}>
          <react_native_1.Text>No products found</react_native_1.Text>
        </react_native_1.View>) : (<react_native_1.FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => <ProductCard_1.default item={item} onPress={onSelect}/>}/>)}
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    searchWrap: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
    input: { backgroundColor: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
    counterWrap: { padding: 8, alignItems: 'flex-end', borderBottomWidth: 1, borderColor: '#f5f5f5' },
});
exports.default = ProductList;
