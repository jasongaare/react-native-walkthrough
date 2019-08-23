import React from 'react';
import PropTypes from 'prop-types';
import { WalkthroughContext } from './ContextWrapper';
import Tooltip from '../../Tooltip';

const WalkthroughElement = (props) => {
  const elementId = props.id;

  const defaultPlacement =
    React.Children.count(props.children) === 0 ? 'center' : 'top';

  return (
    <WalkthroughContext.Consumer>
      {({ currentElement, goToNext }) => {
        const defaultTooltipProps = {
          useInteractionManager: true,
          isVisible: elementId === currentElement.id,
          content: currentElement.content,
          placement: currentElement.placement || defaultPlacement,
          onClose: goToNext,
        };

        const tooltipProps = {
          ...defaultTooltipProps,
          ...currentElement.tooltipProps,
          ...props.tooltipProps,
        };

        return <Tooltip {...tooltipProps}>{props.children}</Tooltip>;
      }}
    </WalkthroughContext.Consumer>
  );
};

WalkthroughElement.defaultProps = {
  tooltipProps: {},
};

WalkthroughElement.propTypes = {
  children: PropTypes.element,
  id: PropTypes.string.isRequired,
  tooltipProps: PropTypes.object,
};

export default WalkthroughElement;
