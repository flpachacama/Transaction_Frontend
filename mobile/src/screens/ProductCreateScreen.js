"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductForm_1 = __importDefault(require("../components/ProductForm"));
const api_1 = require("../api");
const useAppState_1 = require("../hooks/useAppState");
const ProductCreateScreen = ({ navigation }) => {
    const { setError } = (0, useAppState_1.useAppState)();
    return (<react_native_1.View style={styles.container}>
      <ProductForm_1.default checkExists={api_1.checkProductExists} onSubmit={api_1.createProduct} onSuccess={() => {
            setError({ code: 200, message: 'Product created successfully!' });
            navigation.navigate('ProductList');
        }}/>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({ container: { flex: 1, padding: 12 } });
exports.default = ProductCreateScreen;
