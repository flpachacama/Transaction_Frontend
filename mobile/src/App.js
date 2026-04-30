"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const ProductListScreen_1 = __importDefault(require("./screens/ProductListScreen"));
const ProductDetailScreen_1 = __importDefault(require("./screens/ProductDetailScreen"));
const ProductCreateScreen_1 = __importDefault(require("./screens/ProductCreateScreen"));
const ProductEditScreen_1 = __importDefault(require("./screens/ProductEditScreen"));
const react_native_1 = require("react-native");
const AppContext_1 = require("./context/AppContext");
const ErrorOverlay_1 = __importDefault(require("./components/ErrorOverlay"));
const Stack = (0, native_stack_1.createNativeStackNavigator)();
const AppContent = () => {
    const containerStyle = react_native_1.Platform.OS === 'web' ? { flex: 1 } : { flex: 1 };
    return (<native_1.NavigationContainer>
      <react_native_1.View style={containerStyle}>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="ProductList" component={ProductListScreen_1.default} options={{ title: 'Products' }}/>
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen_1.default} options={{ title: 'Product Detail' }}/>
          <Stack.Screen name="ProductCreate" component={ProductCreateScreen_1.default} options={{ title: 'Create Product' }}/>
          <Stack.Screen name="ProductEdit" component={ProductEditScreen_1.default} options={{ title: 'Edit Product' }}/>
        </Stack.Navigator>
      </react_native_1.View>
      <ErrorOverlay_1.default />
    </native_1.NavigationContainer>);
};
const App = () => {
    return (<AppContext_1.AppProvider>
      <AppContent />
    </AppContext_1.AppProvider>);
};
exports.default = App;
