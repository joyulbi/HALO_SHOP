import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import CampaignRank from "../components/CampaignRank";
import DonationModal from "../components/DonationModal";
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

    img {
      filter: brightness(1.05) saturate(1.1);
      transition: filter 0.3s ease;
    }
  }
`;

const TeamImage = styled.img`
  width: 70%;
  height: 70%;
  object-fit: contain;
  border-radius: 50%;
  background-color: #f9f9f9;
  padding: 0.5rem;
  transition: filter 0.3s ease;
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

const ApiCallUrl = "http://localhost:8080";

const campaign = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [campaignImage, setCampaignImage] = useState({});
  const [rankList, setRankList] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    axios.get(`${ApiCallUrl}/api/seasons`)
      .then(res => {
        const seasonList = res.data;
        setSeasons(seasonList);
        if (seasonList.length > 0) {
          // id가 가장 큰 시즌 선택
          setSelectedSeason(seasonList.reduce((max, curr) => (curr.id > max.id ? curr : max), seasonList[0]));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSeason) return;

    // 시즌 상세정보
    axios.get(`${ApiCallUrl}/api/seasons/${selectedSeason.id}`)
      .then(res => setSelectedSeason(prev => ({ ...prev, ...res.data })))
      .catch(console.error);

    // 시즌 이미지
    axios.get(`${ApiCallUrl}/api/campaign-images/${selectedSeason.id}`)
      .then(res => setCampaignImage(res.data))
      .catch(console.error);

    // 시즌 캠페인
    axios.get(`${ApiCallUrl}/api/donation-campaigns/season/${selectedSeason.id}`)
      .then(res => setRankList(res.data))
      .catch(console.error);
  }, [selectedSeason?.id]);

  const imgURL = `${ApiCallUrl}/image/campaign/`;
  const defaultImg = `${ApiCallUrl}/image/`;

  const getImageByTotal = (total) => {
    if (!selectedSeason || !campaignImage) return defaultImg + 'default.jpg';

    const { level_1: lvl1, level_2: lvl2, level_3: lvl3 } = selectedSeason;

    if (typeof total !== 'number') return defaultImg + 'default.jpg';

    if (total >= lvl3) { return campaignImage.level_3 ? imgURL + campaignImage.level_3 : defaultImg + 'level3.png'; }
    if (total >= lvl2) { return campaignImage.level_2 ? imgURL + campaignImage.level_2 : defaultImg + 'level2.png'; }
    if (total >= lvl1) { return campaignImage.level_1 ? imgURL + campaignImage.level_1 : defaultImg + 'level1.png'; }

    return defaultImg + 'default.jpg';
  };

  const seasonMenu = (
    <Menu
      onClick={({ key }) => {
        const season = seasons.find(s => s.id === Number(key));
        if (season) setSelectedSeason(season);
      }}
      items={[...seasons]
        .sort((a, b) => b.id - a.id)
        .map(season => ({
          key: season.id,
          label: `시즌 ${season.id} : ${season.name}`,
        }))}
    />
  );

  const top3WithImage = rankList.slice(0, 3).map(item => ({
    ...item,
    image: getImageByTotal(item.total),
  }));

  // 모달 열기 함수
  const openModal = (team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  if (!selectedSeason) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.3rem",
        color: "#888"
      }}>
        아직 캠페인이 준비중입니다
      </div>
    );
  }

  return (
    <>
      <Header>
        <ButtonWrapper>
          <Dropdown overlay={seasonMenu}>
            <Button>
              <Space>
                {selectedSeason?.name
                  ? `시즌 ${selectedSeason.id} : ${selectedSeason.name}`
                  : "시즌 선택"}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </ButtonWrapper>
        <TextGroup>
          <CampaignTitle fontSize="24px" color="#222">
            {selectedSeason?.name
              ? `시즌 ${selectedSeason.id} : ${selectedSeason.name}`
              : "시즌명을 선택하세요"}
          </CampaignTitle>
          <CampaignTitle fontSize="18px" color="#888">
            {selectedSeason?.startDate
              ? `${selectedSeason.startDate.slice(0, 10).replace(/-/g, '.')} - ${selectedSeason.endDate?.slice(0, 10).replace(/-/g, '.')}`
              : ""}
          </CampaignTitle>
        </TextGroup>
      </Header>

      <ListTop>
        <CampaignRank top3={top3WithImage} />
      </ListTop>

      <CardContainer>
        {rankList.slice(3).map(campaign => (
          <TeamCard 
            key={campaign.id} 
            onClick={() => openModal(campaign.team)} // 클릭 시 모달 오픈
            style={{ cursor: "pointer" }}           // 클릭 가능 커서 추가 (선택)
          >
            <TeamImage
              src={getImageByTotal(campaign.total)}
              alt={campaign.team?.name || "팀 이미지"}
            />
            <TeamName>{campaign.team?.name || "팀명 없음"}</TeamName>
            <TeamTotal>{campaign.total?.toLocaleString() || 0} Pt</TeamTotal>
          </TeamCard>
        ))}
      </CardContainer>
      {modalOpen && selectedTeam && (
        <DonationModal
          team={selectedTeam}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default campaign;