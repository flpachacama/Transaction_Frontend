"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductDetail = ({ product, onBack }) => {
    return (<react_native_1.ScrollView contentContainerStyle={styles.container}>
      {product.logo ? (<react_native_1.Image source={{ uri: product.logo }} style={styles.logo}/>) : (<react_native_1.View style={[styles.logo, { backgroundColor: '#ddd' }]}/>)}
      <react_native_1.Text style={styles.name}>{product.name}</react_native_1.Text>
      <react_native_1.Text style={styles.label}>Description</react_native_1.Text>
      <react_native_1.Text style={styles.desc}>{product.description}</react_native_1.Text>
      <react_native_1.Text style={styles.label}>Release</react_native_1.Text>
      <react_native_1.Text>{product.date_release}</react_native_1.Text>
      <react_native_1.Text style={styles.label}>Revision</react_native_1.Text>
      <react_native_1.Text>{product.date_revision}</react_native_1.Text>
      <react_native_1.View style={{ marginTop: 20 }}>
        <react_native_1.Button title="Back" onPress={onBack}/>
      </react_native_1.View>
    </react_native_1.ScrollView>);
};
const styles = react_native_1.StyleSheet.create({
    container: { padding: 16, alignItems: 'center' },
    logo: { width: 200, height: 200, borderRadius: 8, marginBottom: 16 },
    name: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    label: { marginTop: 12, fontWeight: '600' },
    desc: { textAlign: 'center', marginTop: 6 },
});
exports.default = ProductDetail;
