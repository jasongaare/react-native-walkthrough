import React, { FunctionComponent, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'events';

import ContextWrapper, { ElementType, GuideType, nullElement } from './ContextWrapper';

const wrapperRef = React.createRef<ContextWrapper>();
const ee = new EventEmitter();

const WalkthroughProvider: FunctionComponent<PropsWithChildren<{ debug?: boolean }>> = ({ debug, children }) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee} debug={debug}>
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

const setWalkthroughGuide = (guide: GuideType, setGuide: () => void) => {
  const { current: wrapper } = wrapperRef;
  wrapper?.setGuide(guide, setGuide);
};

const startWalkthrough = (walkthrough: GuideType) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, () => {
      if (walkthrough.length > 0) goToWalkthroughElement(walkthrough[0]);
    });
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
