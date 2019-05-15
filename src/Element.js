import React from "react";
import PropTypes from "prop-types";

import { WalkthroughContext } from "./Provider";
import Tooltip from "react-native-walkthrough-tooltip";

const WalkthroughElement = props => {
  const children = { ...props.children };
  const elementId = props.id;

  return (
    <WalkthroughContext.Consumer>
      {({ currentElement, setElement, nullElement }) => (
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
          placement={currentElement.placement || "auto"}
          animated
        >
          {children}
        </Tooltip>
      )}
    </WalkthroughContext.Consumer>
  );
};

WalkthroughElement.defaultProps = {
  onPress: null,
  onLongPress: null
};

WalkthroughElement.propTypes = {
  children: PropTypes.element.isRequired,
  id: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func
};

export default WalkthroughElement;
