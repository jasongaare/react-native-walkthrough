import React from 'react';
import PropTypes from 'prop-types';

import ContextWrapper from './ContextWrapper';

const wrapperRef = React.createRef();

const WalkthroughProvider = ({ children }) => (
  <ContextWrapper ref={wrapperRef}>{children}</ContextWrapper>
);

const goToWalkthroughElement = (element) => {
  const { current: wrapper } = wrapperRef;

  if (wrapper && typeof wrapper.goToElement === 'function') {
    wrapper.goToElement(element);
  }
};

const setWalkthroughGuide = (guide) => {
  const { current: wrapper } = wrapperRef;

  if (wrapper && typeof wrapper.setElement === 'function') {
    wrapper.setGuide(guide);
  }
};

const startWalkthrough = (walkthrough) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough);
    goToWalkthroughElement(walkthrough[0]);
  } else {
    console.warn(
      '[walkthrough] non-Array argument provided to startWalkthrough',
    );
  }
};

WalkthroughProvider.propTypes = {
  children: PropTypes.element,
};

export { startWalkthrough };
export default WalkthroughProvider;
