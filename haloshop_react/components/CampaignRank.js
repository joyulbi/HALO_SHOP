import React, { useState } from 'react';
import DonationModal from './DonationModal';
import styled from 'styled-components';

const CircleContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-evenly;
  width: 70%;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: black;
  font-size: 1.2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    order: ${props => props.order};
  }
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
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;

  /* hover 시 border 색상에 맞는 blur(그림자) 효과 */
&:hover,
&:has(> div:hover) {
  transform: scale(1.06) translateY(-8px);
  box-shadow:
    0 8px 24px rgba(99,102,241,0.13),
    0 0 24px 16px ${props => {
      // $colors에서 첫 번째 색상만 추출하여 blur 컬러로 사용 (hex → rgba 변환 + opacity 0.25)
      const hex = (props.$colors?.split(',')[0] || '#FFD86E').trim();
      // hex to rgba 변환 함수
      const hexToRgba = (hex, alpha = 0.25) => {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${alpha})`;
      };
      return hexToRgba(hex, 0.5);
    }};
  z-index: 2;
  filter: brightness(1.1) saturate(1.2);
}
`;


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
  overflow: hidden;

  img {
    width: 122%;
    height: 122%;
    object-fit: cover;
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
const RankDescription = ({ team, amount }) => (
  <div style={{ textAlign: "center" }}>
    <Rank>{team?.name || "팀명없음"}</Rank>
    <Amount>{amount?.toLocaleString() || "0"} Pt</Amount>
  </div>
);




const CampaignRank = ({ top3 }) => {

  const [selectedTeam, setSelectedTeam] = useState(null);
  const handleOpenModal = (team) => { setSelectedTeam(team); };
  const handleCloseModal = () => { setSelectedTeam(null); };

  return (
    <>
      <CircleContainer>
        {/* 2등 */}
        <CircleWrapper order={2}>
          <CircleBorder
            $colors="#e0e0e0, #c0c0c0, #f0f0f0"
            onClick={() => handleOpenModal(top3?.[1]?.team)}
          >
            <RankCircle  
              $width="225px" 
              $height="225px" 
              $imgSrc={top3?.[1]?.image} />
          </CircleBorder>
          <RankDescription 
            team={top3?.[1]?.team} 
            amount={top3?.[1]?.total.toLocaleString()} 
          />
        </CircleWrapper>

        {/* 1등 */}
        <CircleWrapper order={1}>
          <CircleBorder
            $colors="#FFD86E , #FFBB00 , #E4D098"
            onClick={() => handleOpenModal(top3?.[0]?.team)}
          >
            <RankCircle  
              $width="250px" 
              $height="250px" 
              $imgSrc={top3?.[0]?.image} />  
          </CircleBorder>
          <RankDescription 
            team={top3?.[0]?.team} 
            amount={top3?.[0]?.total.toLocaleString()} 
          />
        </CircleWrapper>

        {/* 3등 */}
        <CircleWrapper order={3}>
          <CircleBorder
            $colors="#D3917A  , #AE4D08  , #8C4600"
            onClick={() => handleOpenModal(top3?.[2]?.team)}
          >
            <RankCircle 
              $width="200px" 
              $height="200px" 
              $imgSrc={top3?.[2]?.image} />
          </CircleBorder>
          <RankDescription 
            team={top3?.[2]?.team} 
            amount={top3?.[2]?.total?.toLocaleString()} 
          />
        </CircleWrapper>
      </CircleContainer>

      {/* 모달 렌더링 */}
      {selectedTeam && (
        <DonationModal team={selectedTeam} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default CampaignRank;