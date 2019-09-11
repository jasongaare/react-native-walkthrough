# React Native Walkthrough [![npm](https://img.shields.io/npm/v/react-native-walkthrough.svg)](https://www.npmjs.com/package/react-native-walkthrough) [![npm](https://img.shields.io/npm/dm/react-native-walkthrough.svg)](https://www.npmjs.com/package/react-native-walkthrough)

## Walkthrough

> _**NOTE**: This library is currently under development, and should primarly be considered as being in a beta stage._

React Native Walkthrough is an app-wide walkthrough library, with a minimal footprint. 

### Installation

```
yarn add react-native-walkthrough
```

### Basic Usage

React Native Walkthrough exports the following:

  - [`WalkthroughProvider` component](#walkthroughprovider)
  - [`WalkthroughElement component`](#walkthroughelement)
  - [`startWalkthrough` function](#startwalkthrough)
  - [`dispatchWalkthroughEvent` function](#dispatchwalkthroughevent)
    

#### `WalkthroughProvider`

First, you will need to wrap your entire app in the `WalkthroughProvider` component (no props or additional config required)

```js
import { WalkthroughProvider } from 'react-native-walkthrough';

render() {
  return (
    <WalkthroughProvider>
      <YourAppHere />
    </WalkthroughProvider>
  )  
}
```

#### `WalkthroughElement`

When you wish to highlight something as a part of a Walkthrough, you simply wrap the component in a `WalkthroughElement` and give it a unique id. 

```js
import { WalkthroughElement } from 'react-native-walkthrough';

<WalkthroughElement id="profile-button">   // just add this!
  <TouchableOpacity
    style={styles.profileButton}
    onPress={() => navigate('Profile', {name: 'Jane'})}
  >
    <Text>{"Go to Jane's profile"}</Text>
  </TouchableOpacity>
</WalkthroughElement>
```

This library utilizes [`react-native-walkthrough-tooltip`](https://github.com/jasongaare/react-native-walkthrough-tooltip) to render the content bubbles that point to a `WalkthroughElement`. You can edit the content of the tooltip in the [walkthrough guide](#creating-a-walkthrough-guide), or by providing the optional `content` prop directly on the `WalkthroughElement` component.

#### `startWalkthrough`

 Function that accepts a walkthrough guide array and begins the walkthrough by setting the current element as the first element from the walkthrough guide array. [Learn about walkthrough guides here](#creating-a-walkthrough-guide)

```js
import { startWalkthrough } from 'react-native-walkthrough';

import profileWalkthrough from '../guides/profileWalkthrough';

<TouchableOpacity
  onPress={() => startWalkthrough(profileWalkthrough)}
>
  <Text>{"Show me how to view a profile"}</Text>
</TouchableOpacity>
```

#### `dispatchWalkthroughEvent`

Function that accepts a string event name. Walkthrough events are used to wait-then-show the next element in a walkthrough. Add a `triggerEvent` to the walkthrough element in a guide, then be sure to dispatch the walkthrough event when it occurs to trigger the tooltip to be displayed.  

```js
import { NavigationEvents } from 'react-navigation';
import { dispatchWalkthroughEvent } from 'react-native-walkthrough';

render (
  <React.Fragment>
    <NavigationEvents
      onDidFocus={() => dispatchWalkthroughEvent('profile-focus')}
    />
    ...
  </React.Fragment>
)
```

### Creating a Walkthrough Guide

A walkthrough guide is simply an array of objects, where each object correlates to a `WalkthroughElement`. Each element object in the guide must have an `id` and `content` to display in the tooltip bubble. 

#### Example guide
```js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  tooltipView: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  tooltipText: {
    color: 'black',
    fontSize: 18,
  },
});

const makeTooltipContent = text => (
  <View style={styles.tooltipView}>
    <Text style={styles.tooltipText}>{text}</Text>
  </View>
);

export default [
  {
    id: 'profile-button',
    content: makeTooltipContent('Tap here to view a profile'),
  },
  {
    id: 'profile-name',
    content: makeTooltipContent("Here is the user's name"),
    placement: 'bottom',
    triggerEvent: 'profile-focus',
  },
];
```

#### Guide values

|Key|Type|Required|Description|
|---|----|-----|----|
|id|string|YES|id string that matches the corresponding WalkthroughElement|
|content|function/Element| YES | This is the view displayed in the tooltip popover bubble |
|placement|string|NO | Determines placement of tooltip in relation to the element it is wrapping
|triggerEvent|string|NO|string event id, this element will not appear until the triggerEvent is dispatched via `dispatchWalkthroughEvent`
|tooltipProps|object|NO|additional props to customize the tooltip functionality and style

> To learn more about `placement` options and all the options for `tooltipProps` view the [`react-native-walkthrough-tooltip` README](https://github.com/jasongaare/react-native-walkthrough-tooltip#props)
