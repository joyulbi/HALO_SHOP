import React from 'react';
import styled from 'styled-components';

const CircleContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  width: 70%;
  height: 100%;
`;

const CircleBorder = styled.div`
  background: linear-gradient(
    45deg, 
    ${props => props.$colors || 'red, orange, yellow'}
  );
  padding: 7px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Circle = styled.div`
  width: ${props => props.$width};
  height: ${props => props.$height};
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;



const CampaignRank = () => {

  return (
    <>
      <CircleContainer>
        <CircleBorder $colors="#e0e0e0, #c0c0c0, #f0f0f0"><Circle $width="225px" $height="225px" /></CircleBorder>
        <CircleBorder $colors="#FFD86E , #FFBB00 , #E4D098"><Circle $width="250px" $height="250px" /></CircleBorder>
        <CircleBorder $colors="#D3917A  , #AE4D08  , #8C4600"><Circle $width="200px" $height="200px" /></CircleBorder>
      </CircleContainer>
    </>
  )
}

export default CampaignRank;