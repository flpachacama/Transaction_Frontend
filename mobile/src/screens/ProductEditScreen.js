"use strict";
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
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductForm_1 = __importDefault(require("../components/ProductForm"));
const api_1 = require("../api");
const useAppState_1 = require("../hooks/useAppState");
const ProductEditScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { setError } = (0, useAppState_1.useAppState)();
    return (<react_native_1.View style={styles.container}>
      <ProductForm_1.default initial={product} isEdit onSubmit={(payload) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, api_1.updateProduct)(product.id, payload); })} onSuccess={() => {
            setError({ code: 200, message: 'Product updated successfully!' });
            navigation.navigate('ProductList');
        }}/>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({ container: { flex: 1, padding: 12 } });
exports.default = ProductEditScreen;
