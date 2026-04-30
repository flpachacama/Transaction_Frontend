"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductDetail_1 = __importDefault(require("./ProductDetail"));
const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    react_1.default.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <react_native_1.Button title="Edit" onPress={() => navigation.navigate('ProductEdit', { product })}/>,
        });
    }, [navigation, product]);
    return (<react_native_1.View style={styles.container}>
      <ProductDetail_1.default product={product} onBack={() => navigation.goBack()}/>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({ container: { flex: 1 } });
exports.default = ProductDetailScreen;
