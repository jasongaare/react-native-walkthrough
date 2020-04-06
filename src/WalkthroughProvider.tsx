import React, {FunctionComponent} from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

import ContextWrapper, {ElementType, GuideType} from './ContextWrapper';

const wrapperRef = React.createRef<ContextWrapper>();
const ee = new EventEmitter();

const WalkthroughProvider: FunctionComponent = ({children}) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee}>
    {children}
  </ContextWrapper>
);

const goToWalkthroughElementWithId = id => {
  const {current: wrapper} = wrapperRef;

  if (wrapper && typeof wrapper.goToElementWithId === 'function') {
    wrapper.goToElementWithId(id);
  }
};

const goToWalkthroughElement = (element: ElementType) => {
  const {current: wrapper} = wrapperRef;
  wrapper?.goToElement(element);
};

const setWalkthroughGuide = (guide: GuideType, setGuide: () => void) => {
  const {current: wrapper} = wrapperRef;
  wrapper?.setGuide(guide, setGuide);
};

const startWalkthrough = (walkthrough: GuideType) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, () => {
      goToWalkthroughElement(walkthrough[0]);
    });
  } else {
    console.warn(
      '[react-native-walkthrough] non-Array argument provided to startWalkthrough'
    );
  }
};

const startWalkthroughAtElement = (walkthrough, elementId) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, () => {
      goToWalkthroughElementWithId(elementId);
    });
  } else {
    console.warn(
      '[react-native-walkthrough] non-Array argument provided to startWalkthroughAtElement'
    );
  }
};

const dispatchWalkthroughEvent = (event: string | symbol) => ee.emit(event);

const exitWalkthrough = () => startWalkthrough([{}]);

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
