import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import CampaignRank from "../components/CampaignRank";
import axios from 'axios';

import { Dropdown, Button, Space, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

const Header = styled.div`
  background-color: #fff;
  width: 100%;
  padding: 1.2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TextGroup = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    position: static;
    transform: none;
  }
`;

const ButtonWrapper = styled.div`
  @media (min-width: 768px) {
    position: static;
  }
`;

const ListTop = styled.div`
  background-color: #fff;
  width: 80vw;
  min-height: 42vh; /* 최소 높이만 보장 */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2% 0;
  margin-top: 2rem;
  flex-wrap: wrap; /* 반응형 대응 */
`;

// 카드형 컨테이너 (flex-wrap)
const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  width: 80vw;
  padding: 2rem 0;
  background-color: #eee;
`;

// 카드 개별 스타일
const TeamCard = styled.div`
  background: #fff;
  width: 220px;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const TeamImage = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
  border-radius: 50%;
  background-color: #f9f9f9;
  padding: 0.5rem;
`;

const TeamName = styled.p`
  font-weight: 700;
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  text-align: center;
`;

const TeamTotal = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
  text-align: center;
`;

const CampaignTitle = styled.p`
  margin: 0;
  font-size: ${({ fontSize }) => fontSize || "16px"};
  color: ${({ color }) => color || "#000"};
`;

  const handleButtonClick = (e) => {
    message.info('Click on left button.');
    console.log('click left button', e);
  };
  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

const Campaign = () => {


  const menu = (
    <Menu onClick={(e) => {
      message.info(`Click on menu item ${e.key}`);
      console.log('click', e);
    }}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );

  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/donation-campaigns")
      .then((res) => setRankList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const top3 = rankList.slice(0, 3);
  const others = rankList.slice(3);

  return (
    <>
      <Header>
        <ButtonWrapper>
          <Dropdown overlay={menu}>
            <Button>
              <Space>
                시즌
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </ButtonWrapper>

        <TextGroup>
          <CampaignTitle fontSize="24px" color="#222">시즌1 : 수목 성장</CampaignTitle>
          <CampaignTitle fontSize="18px" color="#888">25.01.01 - 25.03.28</CampaignTitle>
        </TextGroup>
      </Header>

      <ListTop>
        <CampaignRank top3={top3} />
      </ListTop>

      {/* 카드형 컨테이너 */}
      <CardContainer>
        {others.map((campaign) => (
          <TeamCard key={campaign.id}>
            <TeamImage
              src={campaign.image}
              alt={campaign.team?.name || "팀 이미지"}
            />
            <TeamName>{campaign.team?.name || "팀명 없음"}</TeamName>
            <TeamTotal>{campaign.total?.toLocaleString() || 0} 원</TeamTotal>
          </TeamCard>
        ))}
      </CardContainer>
    </>
  );
}

export default Campaign;
