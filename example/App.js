import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { WalkthroughProvider } from 'react-native-walkthrough';

import Screen1 from './screens/Screen1';
import Screen2 from './screens/Screen2';

export default class App extends Component {
  constructor() {
    super();

    YellowBox.ignoreWarnings(['']);

    this.state = {
      currentScreen: 1,
    };
  }

  render() {
    const { currentScreen } = this.state;
    let screenToRender = null;

    switch (currentScreen) {
      case 1:
        screenToRender = <Screen1 />;
        break;
      case 2:
        screenToRender = <Screen2 />;
        break;
      default:
        break;
    }

    return (
      <WalkthroughProvider>
        {screenToRender}
      </WalkthroughProvider>
    );
  }
}
