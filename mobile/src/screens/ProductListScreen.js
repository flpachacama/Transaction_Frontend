"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductList_1 = __importDefault(require("./ProductList"));
const ProductListScreen = ({ navigation }) => {
    react_1.default.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <react_native_1.Button title="New" onPress={() => navigation.navigate('ProductCreate')}/>,
        });
    }, [navigation]);
    return (<react_native_1.View style={styles.container}>
      <ProductList_1.default onSelect={(p) => navigation.navigate('ProductDetail', { product: p })}/>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({ container: { flex: 1 } });
exports.default = ProductListScreen;
