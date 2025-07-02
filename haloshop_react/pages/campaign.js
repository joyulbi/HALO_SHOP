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

const campaign = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [campaignImage, setCampaignImage] = useState({});
  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/seasons")
      .then(res => {
        const seasonList = res.data;
        setSeasons(seasonList);
        if (seasonList.length > 0) {
          // id가 가장 큰 시즌 선택
          const latest = seasonList.reduce((max, curr) => (curr.id > max.id ? curr : max), seasonList[0]);
          setSelectedSeason(latest);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;

    // 시즌 상세정보
    axios.get(`http://localhost:8080/api/seasons/${selectedSeason.id}`)
      .then(res => setSelectedSeason(prev => ({ ...prev, ...res.data })))
      .catch(err => console.error(err));

    // 시즌 이미지
    axios.get(`http://localhost:8080/api/campaign-images/${selectedSeason.id}`)
      .then(res => setCampaignImage(res.data))
      .catch(err => console.error(err));

    // 시즌 캠페인
    axios.get(`http://localhost:8080/api/donation-campaigns/season/${selectedSeason.id}`)
      .then(res => setRankList(res.data))
      .catch(err => console.error(err));
  }, [selectedSeason?.id]);

  // 이미지 선별
  const imgURL = 'http://localhost:8080/uploads/campaign/';
  
  const getImageByTotal = (total) => {
    if (!selectedSeason || !campaignImage) return imgURL + "default.jpg";

    const { level_1: lvl1, level_2: lvl2, level_3: lvl3 } = selectedSeason;
    let img = null;

    if (total >= lvl3) img = campaignImage.level_3;
    else if (total >= lvl2) img = campaignImage.level_2;
    else if (total >= lvl1) img = campaignImage.level_1;

    if (!img) {
      return imgURL + "default.jpg";
    }
    return imgURL + img;
  };

  const seasonMenu = (
    <Menu
      onClick={({ key }) => {
        const season = seasons.find(s => s.id === Number(key));
        if (season) setSelectedSeason(season);
      }}
    >
      {[...seasons]
        .sort((a, b) => b.id - a.id) // 최신순 정렬
        .map(season => (
          <Menu.Item key={season.id}>
            시즌 {season.id} : {season.name}
          </Menu.Item>
        ))}
    </Menu>
  );

  const top3 = rankList.slice(0, 3);
  const top3WithImage = top3.map(item => ({
  ...item,
  image: getImageByTotal(item.total),
  }));
  const others = rankList.slice(3);

  return (
    <>
      <Header>
        <ButtonWrapper>
          <Dropdown overlay={seasonMenu}>
            <Button>
              <Space>
                {selectedSeason?.name && `시즌 ${selectedSeason.id} : ${selectedSeason.name}` || "시즌 선택" }
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </ButtonWrapper>

        <TextGroup>
          <CampaignTitle fontSize="24px" color="#222">
            {selectedSeason?.name && `시즌 ${selectedSeason.id} : ${selectedSeason.name}` || "시즌명을 선택하세요"}
          </CampaignTitle>
          <CampaignTitle fontSize="18px" color="#888">
            {selectedSeason?.start_date?.slice(0, 10)} - {selectedSeason?.end_date?.slice(0, 10)}
          </CampaignTitle>
        </TextGroup>
      </Header>

      <ListTop>
        <CampaignRank top3={top3WithImage} />
      </ListTop>

      {/* 카드형 컨테이너 */}
      <CardContainer>
        {others.map((campaign) => (
          <TeamCard key={campaign.id}>
            <TeamImage
              src={getImageByTotal(campaign.total)}
              alt={campaign.team?.name || "팀 이미지"}
            />
            <TeamName>{campaign.team?.name || "팀명 없음"}</TeamName>
            <TeamTotal>{campaign.total?.toLocaleString() || 0} Pt</TeamTotal>
          </TeamCard>
        ))}
      </CardContainer>
    </>
  );
}

export default campaign;
