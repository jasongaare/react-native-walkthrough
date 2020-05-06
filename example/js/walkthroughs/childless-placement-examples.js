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
    id: 'childless-placement-examples',
    content: makeTooltipContent('Tap here to view all placement examples'),
  },
];
