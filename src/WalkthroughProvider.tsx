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

const dispatchWalkthroughEvent = (event: string | symbol) => ee.emit(event);

WalkthroughProvider.propTypes = {
  children: PropTypes.element,
};

export {dispatchWalkthroughEvent, startWalkthrough};
export default WalkthroughProvider;
