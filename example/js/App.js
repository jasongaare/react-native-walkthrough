import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { WalkthroughProvider } from 'react-native-walkthrough';

import NavigationStack from './NavigationStack';

export default function App() {
  console.disableYellowBox = true;

  return (
    <WalkthroughProvider>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </WalkthroughProvider>
  );
}
