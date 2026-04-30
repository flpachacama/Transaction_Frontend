import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import {RootStackParamList} from './types';
import {SafeAreaView, StatusBar} from 'react-native';
import {AppProvider} from './context/AppContext';
import ErrorOverlay from './components/ErrorOverlay';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="ProductList" component={ProductListScreen} options={{title: 'Products'}} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{title: 'Product Detail'}} />
          <Stack.Screen name="ProductCreate" component={ProductCreateScreen} options={{title: 'Create Product'}} />
          <Stack.Screen name="ProductEdit" component={ProductEditScreen} options={{title: 'Edit Product'}} />
        </Stack.Navigator>
      </SafeAreaView>
      <ErrorOverlay />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

