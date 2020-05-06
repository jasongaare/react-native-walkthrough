import React from 'react';
import styled from 'styled-components';

const TooltipView = styled.View``;

const TooltipText = styled.Text`
  color: black;
  font-size: 18px;
`;

const makeTooltipContent = (text) => (
  <TooltipView>
    <TooltipText>{text}</TooltipText>
  </TooltipView>
);

export default [
  {
    id: 'placement-examples',
    content: makeTooltipContent('Tap here to view all placement examples'),
  },
  {
    id: 'top-example',
    content: makeTooltipContent(
      'This is a tooltip rendered on the TOP of a child element.',
    ),
    triggerEvent: 'placement-examples-focus',
    tooltipProps: {
      allowChildInteraction: false, // this prevents the OTHER tooltip from rendering
    },
  },
  {
    id: 'bottom-example',
    content: makeTooltipContent(
      'This is a tooltip rendered on the BOTTOM of a child element.',
    ),
    placement: 'bottom',
    tooltipProps: {
      allowChildInteraction: false, // this prevents the OTHER tooltip from rendering
    },
  },
  {
    id: 'right-example',
    content: makeTooltipContent(
      'This is a tooltip rendered on the RIGHT of a child element.',
    ),
    placement: 'right',
    tooltipProps: {
      allowChildInteraction: false, // this prevents the OTHER tooltip from rendering
    },
  },
  {
    id: 'left-example',
    content: makeTooltipContent(
      'Finally, this is a tooltip rendered on the LEFT of a child element.',
    ),
    placement: 'left',
    tooltipProps: {
      allowChildInteraction: false, // this prevents the OTHER tooltip from rendering
    },
  },
];
