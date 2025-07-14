import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Spin, Empty } from "antd";
import { useAuth } from "../hooks/useAuth"; 
import axios from "axios";

const StyledModalContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding: 8px;
`;

const DonationCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background-color: #fafafa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f0f4ff;
  }
`;

const DonationInfo = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #333;
`;

const DonationId = styled.span`
  font-weight: 600;
  color: #0050b3;
`;

const TeamName = styled.span`
  font-weight: 500;
  color: #222;
`;

const Amount = styled.span`
  font-weight: 600;
  color: #389e0d;
`;

const DonationDate = styled.span`
  font-size: 12px;
  color: #999;
  white-space: nowrap;
`;

const ApiCallUrl = "http://localhost:8080";

const MyDonationHistory = ({ visible, onClose, selectedSeason }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!visible) return; // 모달이 열릴 때만 호출
    if (!user || !selectedSeason) return;

    setLoading(true);
    axios
      .get(`${ApiCallUrl}/api/donations/account/${user.id}/season/${selectedSeason.id}`)
      .then((res) => {
        // id 내림차순 정렬
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setDonations(sorted);
      })
      .catch((err) => {
        console.error("기부 내역 로드 실패", err);
        setDonations([]);
      })
      .finally(() => setLoading(false));
  }, [visible, user, selectedSeason]);

  // 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Modal
      title={`${selectedSeason?.name ?? ""} 시즌 : 내 기부 내역`}
      open={visible}
      onCancel={onClose}
      footer={null}
      bodyStyle={{ padding: "16px 24px" }}
    >
      <StyledModalContent>
        {loading ? (
          <Spin tip="불러오는 중..." />
        ) : donations.length === 0 ? (
          <Empty description="기부 내역이 없습니다." />
        ) : (
          donations.map((donation) => (
            <DonationCard key={donation.id}>
              <DonationInfo>
                <DonationId>#{donation.id}</DonationId>
                <TeamName>{donation.campaign?.team?.name ?? "팀 정보 없음"}</TeamName>
                <Amount>{donation.amount?.toLocaleString() ?? 0} Pt</Amount>
              </DonationInfo>
              <DonationDate>{formatDate(donation.createdAt)}</DonationDate>
            </DonationCard>
          ))
        )}
      </StyledModalContent>
    </Modal>
  );
};

export default MyDonationHistory;
