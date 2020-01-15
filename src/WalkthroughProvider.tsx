import React from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'events';

import ContextWrapper from './ContextWrapper';

const wrapperRef = React.createRef();
const ee = new EventEmitter();

const WalkthroughProvider = ({children}) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee}>
    {children}
  </ContextWrapper>
);

const goToWalkthroughElement = element => {
  const {current: wrapper} = wrapperRef;

  if (wrapper && typeof wrapper.goToElement === 'function') {
    wrapper.goToElement(element);
  }
};

const setWalkthroughGuide = (guide, setGuide) => {
  const {current: wrapper} = wrapperRef;

  if (wrapper && typeof wrapper.setElement === 'function') {
    wrapper.setGuide(guide, setGuide);
  }
};

const startWalkthrough = walkthrough => {
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

const dispatchWalkthroughEvent = event => ee.emit(event);

WalkthroughProvider.propTypes = {
  children: PropTypes.element,
};

export {dispatchWalkthroughEvent, startWalkthrough};
export default WalkthroughProvider;
