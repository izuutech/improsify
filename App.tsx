import React from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigation/AppNavigator';
import {theme} from './src/styles/theme';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

const App: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.surface}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
