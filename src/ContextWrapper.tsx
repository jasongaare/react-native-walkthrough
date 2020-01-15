import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {InteractionManager} from 'react-native';

const WAIT_NO_MORE_TIMEOUT = 1000 * 60 * 10; // 10 minutes
const HOT_SEC = 350;

const nullElement = {
  id: null,
  content: null,
  placement: null,
};

const safeSetGuide = element => {
  return {
    currentGuide: element,
  };
};

const safeSetElement = element => {
  return {
    currentElement: element,
  };
};

export const WalkthroughContext = React.createContext(nullElement);

class ContextWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {currentElement: nullElement, currentGuide: []};
  }

  getCurrentElementIndex = () =>
    this.state.currentGuide.findIndex(
      element => element.id === this.state.currentElement.id
    );

  setElement = element => {
    if (element.id !== this.state.currentElement.id) {
      // clear previous element
      this.setState(safeSetElement(nullElement));

      // after interactions and a hot sec, set current element
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          this.setState(safeSetElement(element));
        }, HOT_SEC);
      });
    }
  };

  setGuide = (guide, callback = () => {}) =>
    this.setState(safeSetGuide(guide), callback);

  setNull = () => this.setState(safeSetElement(nullElement));

  clearGuide = () => this.setState(safeSetGuide([]));

  waitForTrigger = element => {
    const {eventEmitter} = this.props;

    const waitStart = Date.now();
    const triggerGuide = JSON.stringify(this.state.currentGuide);

    this.setNull();

    eventEmitter.once(element.triggerEvent, () => {
      const waitEnd = Date.now();
      const currentGuide = JSON.stringify(this.state.currentGuide);

      if (waitEnd - waitStart >= WAIT_NO_MORE_TIMEOUT) {
        this.clearGuide();
      } else if (triggerGuide === currentGuide) {
        // only do action if we are still in the same guide that requested the element
        this.setElement(element);
      }
    });
  };

  goToElement = element => {
    if (element.triggerEvent) {
      this.waitForTrigger(element);
    } else {
      this.setElement(element);
    }
  };

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
  eventEmitter: PropTypes.object,
};

export default ContextWrapper;
