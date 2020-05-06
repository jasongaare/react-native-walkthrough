import React, { useState } from 'react';
import styled from 'styled-components';

import {
  WalkthroughElement,
  dispatchWalkthroughEvent,
} from 'react-native-walkthrough';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';

// #region styled-components
const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const ButtonRow = styled.View`
  margin: 16px 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  padding: 8px 16px;
  margin: 0px 8px;
  border-radius: 4px;
  background-color: lightgray;
  max-height: 40px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: black;
  font-size: 16px;
`;

const MiddleButtonRow = styled(ButtonRow)`
  justify-content: space-between;
  width: 94%;
`;

const InstructionText = styled.Text`
  color: gray;
  text-align: center;
  flex: 1;
  margin-bottom: 75%;
`;

const TooltipContainer = styled.View`
  align-items: center;
`;

const TooltipTitleText = styled.Text`
  margin: 4px 16px 8px 16px;
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const TooltipText = styled.Text`
  padding: 4px;
  color: black;
`;
// #endregion

const tooltipContentGenerator = (title, text) => (
  <TooltipContainer>
    <TooltipTitleText>{`${title}`}</TooltipTitleText>
    <TooltipText>{`${text}`}</TooltipText>
  </TooltipContainer>
);

const PlacementExamples = () => {
  const [bottomVisible, setBottomVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);
  const [topVisible, setTopVisible] = useState(false);

  useFocusEffect(() => {
    dispatchWalkthroughEvent('placement-examples-focus');
  }, []);

  const insets = useSafeArea();

  return (
    <Container>
      <ButtonRow>
        <Tooltip
          placement="bottom"
          isVisible={bottomVisible}
          onClose={() => setBottomVisible(false)}
          content={tooltipContentGenerator(
            'Bottom Placement',
            'This is a tooltip bubble rendered with bottom placement, and it points to its child element above it',
          )}
        >
          <WalkthroughElement id="bottom-example">
            <Button onPress={() => setBottomVisible(true)}>
              <ButtonText>Bottom</ButtonText>
            </Button>
          </WalkthroughElement>
        </Tooltip>
      </ButtonRow>

      <MiddleButtonRow>
        <Tooltip
          placement="right"
          isVisible={rightVisible}
          onClose={() => setRightVisible(false)}
          content={tooltipContentGenerator(
            'Right Placement',
            'This is a tooltip bubble rendered with right placement, and it points to its child element on its left',
          )}
        >
          <WalkthroughElement id="right-example">
            <Button onPress={() => setRightVisible(true)}>
              <ButtonText>Right</ButtonText>
            </Button>
          </WalkthroughElement>
        </Tooltip>

        <InstructionText>
          Tap on any button to view the tooltip style associated with that
          placement option.
        </InstructionText>

        <Tooltip
          placement="left"
          isVisible={leftVisible}
          onClose={() => setLeftVisible(false)}
          content={tooltipContentGenerator(
            'Left Placement',
            'This is a tooltip bubble rendered with left placement, and it points to its child element on its right',
          )}
        >
          <WalkthroughElement id="left-example">
            <Button onPress={() => setLeftVisible(true)}>
              <ButtonText>Left</ButtonText>
            </Button>
          </WalkthroughElement>
        </Tooltip>
      </MiddleButtonRow>

      <ButtonRow style={{ marginBottom: insets.bottom }}>
        <Tooltip
          placement="top"
          isVisible={topVisible}
          onClose={() => setTopVisible(false)}
          content={tooltipContentGenerator(
            'Top Placement',
            'This is a tooltip bubble rendered with top placement, and it points to its child element below it',
          )}
        >
          <WalkthroughElement id="top-example">
            <Button onPress={() => setTopVisible(true)}>
              <ButtonText>Top</ButtonText>
            </Button>
          </WalkthroughElement>
        </Tooltip>
      </ButtonRow>
    </Container>
  );
};

export default PlacementExamples;
