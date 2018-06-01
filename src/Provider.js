import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';

const nullElement = {
  id: null,
  content: null,
  next: () => {},
  placement: null,
};

const setNext = element => {
  return {
    currentElement: element,
  };
};

export const WalkthroughContext = React.createReactContext(nullElement);

class WalkThroughProvider extends Component {
  state = { currentElement: nullElement };

  updateElement = nextElement => {
    this.setState(setNext(nextElement));
  };

  render() {
    return (
      <WalkthroughContext.Provider
        value={{
          setElement: nextElement => {
            this.updateElement(nullElement);
            InteractionManager.runAfterInteractions(() => {
              this.updateElement(nextElement);
            });
          },
          currentElement: this.state.currentElement,
          nullElement,
        }}
      >
        {this.props.children}
      </WalkthroughContext.Provider>
    );
  }
}

WalkThroughProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default WalkThroughProvider;
