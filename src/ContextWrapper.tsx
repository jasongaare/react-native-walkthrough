import React, { Component } from 'react';
import { EventEmitter } from 'events';
import { TooltipProps } from 'react-native-walkthrough-tooltip';

const WAIT_NO_MORE_TIMEOUT = 1000 * 60 * 10; // 10 minutes
const HOT_SEC = 500;

type OutcomeType = { event: string | symbol; action: (...args: any[]) => void };

export type ElementType = {
  id: string;
  content: TooltipProps['content'];
  placement?: TooltipProps['placement'];
  triggerEvent?: string | symbol;
  tooltipProps?: TooltipProps;
  onClose?: () => void;
  possibleOutcomes?: OutcomeType[];
  listenForOutcomesWhileDisplayed?: boolean;
};
export type GuideType = ElementType[];

export const nullElement = {
  id: '',
  content: undefined,
  placement: undefined,
};

const safeSetGuide = (element: GuideType) => ({ currentGuide: element });
const safeSetElement = (element: ElementType) => ({ currentElement: element });

export type ContextValue = {
  currentElement: ElementType;
  goToNext: () => void;
};
export const WalkthroughContext = React.createContext<ContextValue>({
  currentElement: nullElement,
  goToNext: () => {},
});

interface Props {
  debug?: boolean;
  eventEmitter: EventEmitter;
}
type State = {
  currentElement: ElementType;
  currentGuide: GuideType;
  currentPossibleOutcomes: OutcomeType[];
  outcomeListenerStartTimestamp?: number;
};

class ContextWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentElement: nullElement,
      currentGuide: [],
      currentPossibleOutcomes: [],
      outcomeListenerStartTimestamp: undefined,
    };
  }

  getCurrentElementIndex = () =>
    this.state.currentGuide.findIndex(element => element.id === this.state.currentElement.id);

  clearGuide = () => this.setState(safeSetGuide([]));

  clearCurrentPossibleOutcomes = () => {
    const { eventEmitter } = this.props;
    if (this.props.debug) {
      console.debug(
        `[react-native-walkthrough] clearing ${this.state.currentPossibleOutcomes.length} possible outcomes`
      );
    }

    this.state.currentPossibleOutcomes.forEach(({ event, action }) => {
      eventEmitter.removeListener(event, action);
    });

    this.setState({
      currentPossibleOutcomes: [],
      outcomeListenerStartTimestamp: undefined,
    });
  };

  addTimeoutCheckToOutcomeActions = ({ event, action: originalAction }: OutcomeType) => ({
    event,
    action: () => {
      const { outcomeListenerStartTimestamp } = this.state;

      if (outcomeListenerStartTimestamp === undefined) {
        console.warn('[react-native-walkthrough] outcomeListenerStartTimestamp not initialized');
      } else if (Date.now() - outcomeListenerStartTimestamp >= WAIT_NO_MORE_TIMEOUT) {
        if (this.props.debug) {
          console.debug(
            `[react-native-walkthrough] clearing guide because of walkthrough timeout of ${WAIT_NO_MORE_TIMEOUT}ms`
          );
        }
        this.clearGuide();
      } else {
        originalAction();
      }

      this.clearCurrentPossibleOutcomes();
    },
  });

  listenForPossibleOutcomes = (element: ElementType) => {
    const { eventEmitter } = this.props;
    const { possibleOutcomes } = element;

    if (possibleOutcomes) {
      if (!Array.isArray(possibleOutcomes)) {
        console.warn('[react-native-walkthrough] non-Array value provided to possibleOutcomes');
      } else {
        this.setState(
          {
            currentPossibleOutcomes: possibleOutcomes.map(this.addTimeoutCheckToOutcomeActions),
            outcomeListenerStartTimestamp: Date.now(),
          },
          () => {
            this.state.currentPossibleOutcomes.forEach(({ event, action }) => eventEmitter.once(event, action));
          }
        );
      }
    }
  };

  setElementNull = () => this.setState(safeSetElement(nullElement));

  setElement = (element: ElementType) => {
    if (element.id !== this.state.currentElement.id) {
      // clear previous element
      this.setElementNull();
      this.clearCurrentPossibleOutcomes();

      // after a hot sec, set current element
      setTimeout(() => {
        this.setState(safeSetElement(element));
      }, HOT_SEC);
    }
  };

  setGuide = (guide: GuideType, callback?: () => void) => {
    this.setElementNull();
    if (__DEV__) {
      const duplicateElements = guide.filter((element, index) => guide.indexOf(element) !== index);
      if (duplicateElements.length > 0) {
        const duplicateElementIds = duplicateElements.map(element => element.id).join(', ');
        console.warn(`[react-native-walkthrough] guide uses duplicated element IDs: ${duplicateElementIds}`);
      }
    }
    this.setState(safeSetGuide(guide), callback);
  };

  waitForTrigger = (element: ElementType, triggerEvent: string | symbol) => {
    const { eventEmitter } = this.props;

    const waitStart = Date.now();
    const triggerGuide = JSON.stringify(this.state.currentGuide);

    this.setElementNull();

    eventEmitter.once(triggerEvent, () => {
      const waitEnd = Date.now();
      const currentGuide = JSON.stringify(this.state.currentGuide);
      if (this.props.debug) {
        console.debug(`[react-native-walkthrough] triggering for ${element.id} from ${String(triggerEvent)}`);
      }

      if (waitEnd - waitStart >= WAIT_NO_MORE_TIMEOUT) {
        this.clearGuide();
      } else if (triggerGuide === currentGuide) {
        // only do action if we are still in the same guide that requested the element
        this.setElement(element);
      }
    });
  };

  goToElement = (element: ElementType) => {
    if (element.triggerEvent) {
      this.waitForTrigger(element, element.triggerEvent);
    } else {
      this.setElement(element);
    }
  };

  goToElementWithId = (id: string) => {
    const elementWithId = this.state.currentGuide.find(element => element.id === id);

    if (elementWithId) {
      if (this.props.debug) {
        console.debug(`[react-native-walkthrough] moving to element with ID ${id}`);
      }
      this.goToElement(elementWithId);
    } else if (this.props.debug) {
      console.debug(`[react-native-walkthrough] could not find element with ID ${id}`);
    }
  };

  goToNext = () => {
    const { currentElement } = this.state;
    const nextIndex = this.getCurrentElementIndex() + 1;

    if (currentElement.possibleOutcomes) {
      if (this.props.debug) {
        console.debug(`[react-native-walkthrough] current element has possible outcomes, listening...`);
      }
      if (!currentElement.listenForOutcomesWhileDisplayed) {
        // Only listen if we are not already listening...
        this.listenForPossibleOutcomes(currentElement);
      }
      this.setElementNull();
    } else if (nextIndex < this.state.currentGuide.length) {
      if (this.props.debug) {
        console.debug(`[react-native-walkthrough] moving to next element at index ${nextIndex}`);
      }
      const nextElement = this.state.currentGuide[nextIndex];
      this.goToElement(nextElement);
      if (nextElement.listenForOutcomesWhileDisplayed && nextElement.possibleOutcomes) {
        if (this.props.debug) {
          console.debug(
            `[react-native-walkthrough] next element has ${nextElement.possibleOutcomes.length} possible outcomes, listening...`
          );
        }
        this.listenForPossibleOutcomes(nextElement);
      }
    } else {
      if (this.props.debug) {
        console.debug(`[react-native-walkthrough] no more elements, exiting walkthrough`);
      }
      this.setElementNull();
      this.clearGuide();
    }
  };

  render() {
    return (
      <WalkthroughContext.Provider value={{ ...this.state, goToNext: this.goToNext }}>
        {this.props.children}
      </WalkthroughContext.Provider>
    );
  }
}

export default ContextWrapper;
