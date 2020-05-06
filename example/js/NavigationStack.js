import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import Home from './screens/Home';
import PlacementExamples from './screens/PlacementExamples';
import ChildlessPlacementExamples from './screens/ChildlessPlacementExamples';

const Stack = createStackNavigator();

export default function NavigationContainer() {
  // return <View style={{ flex: 1, backgroundColor: 'purple' }} />;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Walkthrough Example App',
        }}
      />
      <Stack.Screen
        name="PlacementExamples"
        component={PlacementExamples}
        options={{
          title: 'Placement Examples',
        }}
      />
      <Stack.Screen
        name="ChildlessPlacementExamples"
        component={ChildlessPlacementExamples}
        options={{
          title: 'Childless Placement Examples',
        }}
      />
    </Stack.Navigator>
  );
}
