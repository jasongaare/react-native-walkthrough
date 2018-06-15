import React, { Component } from 'react';
import Screen1 from './screens/Screen1';
import Screen2 from './screens/Screen2';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      currentScreen: 1,
    };
  }

  render() {
    switch (this.state.currentScreen) {
      case 1:
        return <Screen1 />;
      case 2:
        return <Screen2 />;
      default:
        break;
    }

    return null;
  }
}
