import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { WalkthroughContext } from './Provider';
import Tooltip from './Tooltip';

const WalkthroughElement = props => {
  const children = { ...props.children };
  const elementId = props.id;

  return (
    <WalkthroughContext.Consumer>
      {
        ({ currentElement, setElement, nullElement }) => (
          <Tooltip
            isVisible={elementId === currentElement.id}
            onElementPress={() => {
              currentElement.next(setElement, props.onPress);
            }}
            onElementLongPress={() => {
              currentElement.next(setElement, props.onLongPress);
            }}
            onClose={() => setElement(nullElement)}
            content={currentElement.content}
            animated={Platform.OS === 'ios'}
            placement={currentElement.placement || 'auto'}
          >
            {children}
          </Tooltip>
        )
      }
    </WalkthroughContext.Consumer>
  );
};

WalkthroughElement.defaultProps = {
  onPress: null,
  onLongPress: null,
};

WalkthroughElement.propTypes = {
  children: PropTypes.element,
  id: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

export default WalkthroughElement;