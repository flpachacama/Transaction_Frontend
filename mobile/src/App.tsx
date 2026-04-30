import React from 'react';
import {View, Text, Platform} from 'react-native';

const App = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
      <Text style={{fontSize: 20, color: '#000'}}>
        {Platform.OS === 'web' ? '🌐 Web App' : '📱 Mobile App'}
      </Text>
      <Text style={{fontSize: 14, color: '#666', marginTop: 10}}>Expo is working!</Text>
    </View>
  );
};

export default App;

