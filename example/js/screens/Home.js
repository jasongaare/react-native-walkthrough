import React from 'react';
import styled from 'styled-components';

import { WalkthroughElement, startWalkthrough } from 'react-native-walkthrough';

import ChildlessPlacementExamplesWalkthrough from '../walkthroughs/childless-placement-examples';
import PlacementExamplesWalkthrough from '../walkthroughs/placement-examples';

// #region styled-components
const HomeContainer = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 25%;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: black;
  margin: 24px;
  margin-top: 32px;
`;

const Button = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const ActionButton = styled(Button)`
  background-color: lightgray;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: black;
  width: 100%;
  text-align: center;
`;
// #endregion

const Home = ({ navigation }) => {
  return (
    <React.Fragment>
      <HomeContainer>
        <TitleText>Walkthroughs</TitleText>

        <ActionButton
          onPress={() => startWalkthrough(PlacementExamplesWalkthrough)}
        >
          <ButtonText>Show All Placement Examples</ButtonText>
        </ActionButton>

        <ActionButton
          onPress={() =>
            startWalkthrough(ChildlessPlacementExamplesWalkthrough)
          }
        >
          <ButtonText>Show Childless Tooltip Examples</ButtonText>
        </ActionButton>

        <TitleText>Tooltip Examples</TitleText>

        <WalkthroughElement id="placement-examples">
          <ActionButton
            onPress={() => navigation.navigate('PlacementExamples')}
          >
            <ButtonText>Placement Examples (with children)</ButtonText>
          </ActionButton>
        </WalkthroughElement>

        <WalkthroughElement id="childless-placement-examples">
          <ActionButton
            onPress={() => navigation.navigate('ChildlessPlacementExamples')}
          >
            <ButtonText>Childless Tooltip Example</ButtonText>
          </ActionButton>
        </WalkthroughElement>
      </HomeContainer>
    </React.Fragment>
  );
};

export default Home;
