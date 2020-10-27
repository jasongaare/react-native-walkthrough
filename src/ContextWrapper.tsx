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
};
export type GuideType = ElementType[];

export const nullElement = {
  id: '',
  content: undefined,
  placement: undefined,
};

const safeSetGuide = (element: GuideType, onWalkthroughComplete?: () => void) => ({
  currentGuide: element,
  currentIndex: 0,
  onWalkthroughComplete: onWalkthroughComplete,
});
const safeSetElement = (element: ElementType) => ({ currentElement: element });

export type ContextValue = {
  currentElement: ElementType;
  goToNext: () => void;
};
export const WalkthroughContext = React.createContext<ContextValue>({
  currentElement: nullElement,
  goToNext: () => {
    /* fallback */
  },
});

interface Props {
  eventEmitter: EventEmitter;
}
type State = {
  currentElement: ElementType;
  currentGuide: GuideType;
  currentPossibleOutcomes: OutcomeType[];
  currentIndex: number;
  onWalkthroughComplete?: () => void;
};

class ContextWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentElement: nullElement,
      currentGuide: [],
      currentPossibleOutcomes: [],
      currentIndex: 0,
      onWalkthroughComplete: undefined,
    };
  }

  clearGuide = () => {
    this.state.onWalkthroughComplete?.();
    this.setState(safeSetGuide([]));
  };

  clearCurrentPossibleOutcomes = () => {
    const { eventEmitter } = this.props;

    this.state.currentPossibleOutcomes.forEach(({ event, action }) => {
      eventEmitter.removeListener(event, action);
    });

    this.setState({ currentPossibleOutcomes: [] });
  };

  addTimeoutCheckToOutcomeActions = (outcomeListenerStartTimestamp: number) => ({
    event,
    action: originalAction,
  }: OutcomeType) => ({
    event,
    action: () => {
      if (Date.now() - outcomeListenerStartTimestamp >= WAIT_NO_MORE_TIMEOUT) {
        this.clearGuide();
      } else {
        originalAction();
      }
      // remove all if one of them fired
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
        const wrapped = possibleOutcomes.map(this.addTimeoutCheckToOutcomeActions(Date.now()));
        this.setState({ currentPossibleOutcomes: wrapped }, () =>
          wrapped.forEach(({ event, action }) => eventEmitter.once(event, action))
        );
      }
    }
  };

  setElementNull = () => this.setState(safeSetElement(nullElement));

  setElement = (element: ElementType) => {
    // clear previous element
    this.setElementNull();
    this.clearCurrentPossibleOutcomes();

    // after a hot sec, set current element
    setTimeout(() => {
      this.setState(safeSetElement(element));
    }, HOT_SEC);
  };

  setGuideAsync = (guide: GuideType, onWalkthroughComplete?: () => void): Promise<void> =>
    new Promise(resolve => this.setState(safeSetGuide(guide, onWalkthroughComplete), resolve));

  waitForTrigger = (element: ElementType, triggerEvent: string | symbol) => {
    const { eventEmitter } = this.props;

    const waitStart = Date.now();
    const triggerGuide = JSON.stringify(this.state.currentGuide);

    this.setElementNull();

    eventEmitter.once(triggerEvent, () => {
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

  private goToElementAt = (elementIndex: number) => {
    if (elementIndex < 0) return;
    const element = this.state.currentGuide[elementIndex];
    if (element == null) return;
    this.setState({ currentIndex: elementIndex });
    if (element.triggerEvent) {
      this.waitForTrigger(element, element.triggerEvent);
    } else {
      this.setElement(element);
    }
  };

  goToElement = (element: ElementType) => {
    const elementIndex = this.state.currentGuide.indexOf(element);
    this.goToElementAt(elementIndex);
  };

  goToElementWithId = (id: string) => {
    const elementIndex = this.state.currentGuide.findIndex(element => element.id === id);
    this.goToElementAt(elementIndex);
  };

  goToNext = () => {
    const { currentElement, currentIndex } = this.state;
    const nextIndex = currentIndex + 1;

    if (currentElement.possibleOutcomes) {
      this.listenForPossibleOutcomes(currentElement);
      this.setElementNull();
    } else if (nextIndex < this.state.currentGuide.length) {
      this.goToElementAt(nextIndex);
    } else {
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
