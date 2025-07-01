import React from 'react';
import styled from 'styled-components';

const CircleContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  width: 70%;
  height: 100%;
`;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* 이미지와 텍스트 간 간격 */
  color: black;
  font-size: 1.2rem;
  font-weight: 600;
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
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;

  overflow: hidden; /* 이미지 자르기 */

  img {
    width: 80%;
    height: 80%;
    object-fit: contain; /* 이미지 비율 유지하며 꽉 채우기 */
    background-color: #fff;
  }
`;

const Rank = styled.p`
  color: #000;
  font-Size: 22px;
`

const Amount = styled.p`
  color: #a5a8a8;
  font-Size: 16px;
`;


const RankCircle = ({ $width, $height, $imgSrc }) => (
  <Circle $width={$width} $height={$height}>
    { $imgSrc ? <img src={$imgSrc} alt="circle img" /> : null }
  </Circle>
);

const RankDescription = () => (
  <div>
  <Rank>Rank</Rank>
  <Amount>total</Amount>
  </div>
);


const CampaignRank = () => {

  return (
    <>
      <CircleContainer>

        {/* 2등 */}
        <CircleWrapper>
        <CircleBorder $colors="#e0e0e0, #c0c0c0, #f0f0f0">
          <RankCircle  
            $width="225px" 
            $height="225px" 
            $imgSrc="https://cdn-icons-png.flaticon.com/256/2220/2220083.png" />
          </CircleBorder>
          <RankDescription />
        </CircleWrapper>


        {/* 1등 */}
        <CircleWrapper>
          <CircleBorder $colors="#FFD86E , #FFBB00 , #E4D098">
            <RankCircle  
              $width="250px" 
              $height="250px" 
              $imgSrc="https://cdn-icons-png.flaticon.com/256/2220/2220093.png" />  
            </CircleBorder>
          <RankDescription />
        </CircleWrapper>

        {/* 3등 */}
        <CircleWrapper>
          <CircleBorder $colors="#D3917A  , #AE4D08  , #8C4600">
            <RankCircle 
              $width="200px" 
              $height="200px" 
              $imgSrc="https://cdn-icons-png.flaticon.com/256/5077/5077571.png" />
            </CircleBorder>
            <RankDescription />
        </CircleWrapper>

      </CircleContainer>
    </>
  )
}

export default CampaignRank;