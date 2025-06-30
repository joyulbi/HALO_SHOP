import React from "react";
import styled from 'styled-components';
import CampaignRank from "../components/CampaignRank";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  width: 100vw;
  height: 8vh;
`;

const ListTop = styled.div`
  background-color: #fff;
  width: 100vw;
  height: 42vh;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: #eee;
`

const CampaignTeamBar = styled.div`
  width: 50vw;
  height: 10vh;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* 아주 옅은 그림자 */
  border: 1px solid rgba(255, 255, 255, 0.4); /* 연한 테두리 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555; /* 차분한 텍스트 색 */
  font-weight: 600;
  font-size: 1.2rem;
  user-select: none;
`;

const teamData = [
  { id: 1, image: '이미지1', name: '팀 A', total: 100 },
  { id: 2, image: '이미지2', name: '팀 B', total: 80 },
  { id: 3, image: '이미지3', name: '팀 C', total: 50 },
  // 더 추가 가능
];

const Campaign = () => {
  return (
    <>
      <Header>
        <p style={{color:"#fff", fontSize: "24px"}}>시즌1 : 나무 키우기</p>
        <p style={{color:"#eee", fontSize: "18px"}}>25.01.01 - 20.03.28</p>
        
      </Header>

      <ListTop>
        <CampaignRank />
      </ListTop>
      <ListBottom>

        {teamData.map(team => (
          <CampaignTeamBar key={team.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: "0 3%"
              }}
            >
              <span>{team.image}</span>
              <span>{team.name}</span>
              <span>{team.total}</span>
            </div>
          </CampaignTeamBar>
        ))}

      </ListBottom>
    </>
  );
}

export default Campaign;
