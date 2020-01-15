import React, {FunctionComponent, ReactNode, ReactElement} from 'react';
import Tooltip, {
  TooltipChildrenContext,
  TooltipProps,
} from 'react-native-walkthrough-tooltip';

import {WalkthroughContext} from './ContextWrapper';

type UseTooltipChildContextT =
  | {
      useTooltipChildContext: true;
      children: (value: {tooltipDuplicate: boolean}) => ReactNode;
    }
  | {useTooltipChildContext?: false; children?: ReactNode};

type Props = {
  id: string;
  content?: ReactElement;
  tooltipProps?: TooltipProps;
} & UseTooltipChildContextT;

const WalkthroughElement: FunctionComponent<Props> = props => {
  const elementId = props.id;

  const defaultPlacement =
    React.Children.count(props.children) === 0 ? 'center' : 'top';

  return (
    <WalkthroughContext.Consumer>
      {({currentElement, goToNext}) => {
        const defaultTooltipProps: TooltipProps = {
          useInteractionManager: true,
          isVisible: elementId === currentElement.id,
          content: props.content || currentElement.content,
          placement: currentElement.placement || defaultPlacement,
          onClose: goToNext,
        };

        const tooltipProps: TooltipProps = {
          ...defaultTooltipProps,
          ...currentElement.tooltipProps,
          ...props.tooltipProps,
        };

        return (
          <Tooltip {...tooltipProps}>
            {props.useTooltipChildContext ? (
              <TooltipChildrenContext.Consumer>
                {props.children}
              </TooltipChildrenContext.Consumer>
            ) : (
              props.children
            )}
          </Tooltip>
        );
      }}
    </WalkthroughContext.Consumer>
  );
};

WalkthroughElement.defaultProps = {
  content: undefined,
  tooltipProps: undefined,
  useTooltipChildContext: false,
};

export default WalkthroughElement;
