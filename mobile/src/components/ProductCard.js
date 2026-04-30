"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProductCard = ({ item, onPress }) => {
    var _a;
    const short = ((_a = item.description) === null || _a === void 0 ? void 0 : _a.length) > 80 ? item.description.slice(0, 77) + '...' : item.description;
    const imageSource = item.logo ? { uri: item.logo } : null;
    return (<react_native_1.TouchableOpacity style={styles.card} onPress={() => onPress && onPress(item)}>
      {imageSource ? (<react_native_1.Image source={imageSource} style={styles.logo} resizeMode="cover"/>) : (<react_native_1.View style={[styles.logo, styles.placeholder]}/>)}
      <react_native_1.View style={styles.body}>
        <react_native_1.Text style={styles.name}>{item.name}</react_native_1.Text>
        <react_native_1.Text style={styles.desc}>{short}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
};
const styles = react_native_1.StyleSheet.create({
    card: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    logo: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#ddd' },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    body: { flex: 1, marginLeft: 12 },
    name: { fontSize: 16, fontWeight: '600' },
    desc: { fontSize: 12, color: '#666', marginTop: 4 },
});
exports.default = ProductCard;
