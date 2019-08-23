import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import EventEmitter from '../../EventEmitter';

const WAIT_NO_MORE_TIMEOUT = 1000 * 60 * 10; // 10 minutes

const nullElement = {
  id: null,
  content: null,
  placement: null,
};

const safeSetGuide = (element) => {
  return {
    currentGuide: element,
  };
};

const safeSetElement = (element) => {
  return {
    currentElement: element,
  };
};

export const WalkthroughContext = React.createContext(nullElement);

class ContextWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = { currentElement: nullElement, currentGuide: [] };
  }

  getCurrentElementIndex = () =>
    this.state.currentGuide.findIndex(
      (element) => element.id === this.state.currentElement.id,
    );

  setElement = (element) => {
    if (element.id !== this.state.currentElement.id) {
      // clear previous element
      this.setState(safeSetElement(nullElement));

      // after interactions, set current element
      InteractionManager.runAfterInteractions(() => {
        this.setState(safeSetElement(element));
      });
    }
  };

  setGuide = (guide) => this.setState(safeSetGuide(guide));

  setNull = () => this.setState(safeSetElement(nullElement));

  clearGuide = () => this.setState(safeSetGuide([]));

  waitForTrigger = (element) => {
    const waitStart = Date.now();
    this.setNull();

    EventEmitter.once(element.triggerEvent, () => {
      const waitEnd = Date.now();

      // TODO: check if guide is same as when listener was added

      if (waitEnd - waitStart < WAIT_NO_MORE_TIMEOUT) {
        this.setElement(element);
      } else {
        this.clearGuide();
      }
    });
  }

  goToElement = (element) => {
    if (element.triggerEvent) {
      this.waitForTrigger(element);
    } else {
      this.setElement(element);
    }
  } 

  goToNext = () => {
    const nextIndex = this.getCurrentElementIndex() + 1;

    if (nextIndex < this.state.currentGuide.length) {
      this.goToElement(this.state.currentGuide[nextIndex]);
    } else {
      this.setNull();
      this.clearGuide();
    }
  };

  render() {
    return (
      <WalkthroughContext.Provider
        value={{
          ...this.state,
          goToNext: this.goToNext,
        }}
      >
        {this.props.children}
      </WalkthroughContext.Provider>
    );
  }
}

ContextWrapper.propTypes = {
  children: PropTypes.element,
};

export default ContextWrapper;
