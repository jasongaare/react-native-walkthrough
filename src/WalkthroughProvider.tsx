import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'events';

import ContextWrapper, { ElementType, GuideType, nullElement } from './ContextWrapper';

const wrapperRef = React.createRef<ContextWrapper>();
const ee = new EventEmitter();

const WalkthroughProvider: FunctionComponent = ({ children }) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee}>
    {children}
  </ContextWrapper>
);

const goToWalkthroughElementWithId = (id: string) => {
  const { current: wrapper } = wrapperRef;
  wrapper?.goToElementWithId(id);
};

const goToWalkthroughElement = (element: ElementType) => {
  const { current: wrapper } = wrapperRef;
  wrapper?.goToElement(element);
};

const setWalkthroughGuide = (guide: GuideType, onFinish?: () => void) => {
  const { current: wrapper } = wrapperRef;
  return wrapper?.setGuideAsync(guide, onFinish);
};

const startWalkthrough = (walkthrough: GuideType, onFinish?: () => void) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, onFinish)?.then(() => goToWalkthroughElement(walkthrough[0]));
  } else {
    console.warn('[react-native-walkthrough] non-Array argument provided to startWalkthrough');
  }
};

const startWalkthroughAtElement = (walkthrough: GuideType, elementId: string) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, () => {
      goToWalkthroughElementWithId(elementId);
    });
  } else {
    console.warn('[react-native-walkthrough] non-Array argument provided to startWalkthroughAtElement');
  }
};

const dispatchWalkthroughEvent = (event: string | symbol) => ee.emit(event);

const exitWalkthrough = () => startWalkthrough([nullElement]);

WalkthroughProvider.propTypes = {
  children: PropTypes.element,
};

export {
  dispatchWalkthroughEvent,
  exitWalkthrough,
  goToWalkthroughElementWithId,
  startWalkthrough,
  startWalkthroughAtElement,
};
export default WalkthroughProvider;
