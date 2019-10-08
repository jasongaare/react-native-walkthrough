import React from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'events';

import ContextWrapper from './ContextWrapper';

const wrapperRef = React.createRef();
const ee = new EventEmitter();

const WalkthroughProvider = ({ children }) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee}>
    {children}
  </ContextWrapper>
);

const goToWalkthroughElementWithId = id => {
  const { current: wrapper } = wrapperRef;

  if (wrapper && typeof wrapper.goToElementWithId === 'function') {
    wrapper.goToElementWithId(id);
  }
};

const goToWalkthroughElement = element => {
  const { current: wrapper } = wrapperRef;

  if (wrapper && typeof wrapper.goToElement === 'function') {
    wrapper.goToElement(element);
  }
};

const setWalkthroughGuide = (guide, setGuide) => {
  const { current: wrapper } = wrapperRef;

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

const startWalkthroughAtElement = (walkthrough, elementId) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, () => {
      const elementIndex = walkthrough.findIndex(
        element => element.id === elementId
      );

      goToWalkthroughElement(
        walkthrough[elementIndex !== -1 ? elementIndex : 0]
      );
    });
  } else {
    console.warn(
      '[walkthrough] non-Array argument provided to startWalkthrough'
    );
  }
};

const dispatchWalkthroughEvent = event => ee.emit(event);

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
