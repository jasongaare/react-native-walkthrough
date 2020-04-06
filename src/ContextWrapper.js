import React, { Component } from "react";
import PropTypes from "prop-types";

const WAIT_NO_MORE_TIMEOUT = 1000 * 60 * 10; // 10 minutes
const HOT_SEC = 500;

const nullElement = {
  id: null,
  content: null,
  placement: null,
};

const safeSetGuide = (element) => {
  return {
    currentGuide: element,
    currentIndex: 0,
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

    this.state = {
      currentElement: nullElement,
      currentGuide: [],
      currentPossibleOutcomes: [],
      outcomeListenerStartTimestamp: null,
      currentIndex: 0,
    };
  }

  getCurrentElementIndex = () =>
    this.state.currentGuide.findIndex(
      (element) => element.id === this.state.currentElement.id
    );

  clearGuide = () => this.setState(safeSetGuide([]));

  clearCurrentPossibleOutcomes = () => {
    const { eventEmitter } = this.props;

    this.state.currentPossibleOutcomes.forEach(({ event, action }) => {
      eventEmitter.removeListener(event, action);
    });

    this.setState({
      currentPossibleOutcomes: [],
      outcomeListenerStartTimestamp: null,
    });
  };

  addTimeoutCheckToOutcomeActions = ({ event, action: originalAction }) => ({
    event,
    action: () => {
      const { outcomeListenerStartTimestamp } = this.state;

      if (Date.now() - outcomeListenerStartTimestamp >= WAIT_NO_MORE_TIMEOUT) {
        this.clearGuide();
      } else {
        originalAction();
      }

      this.clearCurrentPossibleOutcomes();
    },
  });

  listenForPossibleOutcomes = (element) => {
    const { eventEmitter } = this.props;
    const { possibleOutcomes } = element;

    if (possibleOutcomes) {
      if (!Array.isArray(possibleOutcomes)) {
        console.warn(
          "[react-native-walkthrough] non-Array value provided to possibleOutcomes"
        );
      } else {
        this.setState(
          {
            currentPossibleOutcomes: possibleOutcomes.map(
              this.addTimeoutCheckToOutcomeActions
            ),
            outcomeListenerStartTimestamp: Date.now(),
          },
          () => {
            this.state.currentPossibleOutcomes.forEach(({ event, action }) =>
              eventEmitter.once(event, action)
            );
          }
        );
      }
    }
  };

  setElementNull = () => this.setState(safeSetElement(nullElement));

  setElement = (element) => {
    // clear previous element
    this.setElementNull();
    this.clearCurrentPossibleOutcomes();

    // after a hot sec, set current element
    setTimeout(() => {
      this.setState(safeSetElement(element));
    }, HOT_SEC);
  };

  setGuide = (guide, callback = () => {}) => {
    this.setElementNull();
    this.setState(safeSetGuide(guide), callback);
  };

  waitForTrigger = (element) => {
    const { eventEmitter } = this.props;

    const waitStart = Date.now();
    const triggerGuide = JSON.stringify(this.state.currentGuide);

    this.setElementNull();

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

  goToElement = (element) => {
    if (element.triggerEvent) {
      this.waitForTrigger(element);
    } else {
      this.setElement(element);
    }
  };

  goToElementWithId = (id) => {
    const elementWithId = this.state.currentGuide.find(
      (element) => element.id === id
    );

    if (elementWithId) {
      this.goToElement(elementWithId);
    }
  };

  goToNext = () => {
    const { currentElement, currentIndex } = this.state;
    const nextIndex = currentIndex + 1;

    if (currentElement.possibleOutcomes) {
      this.listenForPossibleOutcomes(currentElement);
      this.setElementNull();
    } else if (nextIndex < this.state.currentGuide.length) {
      this.setState({ currentIndex: nextIndex });
      this.goToElement(this.state.currentGuide[nextIndex]);
    } else {
      this.setElementNull();
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
