import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// 🔒 모달 활성 시 스크롤 잠금
const useScrollLock = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
};

// 🧼 스타일 컴포넌트
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 360px;
  max-width: 90%;
  padding: 2rem;
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  position: relative;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const InfoRow = styled.p`
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
  color: #555;
  display: flex;
  justify-content: space-between;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #2b6cb0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  margin: 0.5rem 0 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49,130,206,0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.6rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  background: ${({ variant }) => variant === 'cancel' ? '#e2e8f0' : '#3182ce'};
  color: ${({ variant }) => variant === 'cancel' ? '#4a5568' : '#fff'};

  &:hover {
    background: ${({ variant }) => variant === 'cancel' ? '#cbd5e0' : '#2b6cb0'};
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  margin: 0.5rem 0;
  color: #e53e3e;
  font-size: 0.95rem;
  text-align: center;
`;

const DonationModal = ({ team, campaignId, onClose }) => {

  console.log("캠페인id : ", campaignId);
  useScrollLock();

  const ApiCallUrl = "http://localhost:8080";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPoint, setUserPoint] = useState(0);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios.get(`${ApiCallUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const userId = res.data?.account?.id;
        if (!userId) throw new Error("유저 정보 없음");
        setAccountId(userId);

        return axios.get(`${ApiCallUrl}/api/userpoint/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res2 => {
        setUserPoint(res2.data?.totalPoint ?? 0);
      })
      .catch(() => {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDonate = () => {
    if (!accountId) {
      setError("유저 정보를 찾을 수 없습니다.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!amount || Number(amount) <= 0 || Number(amount) > userPoint) {
      setError("유효한 기부 포인트를 입력하세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    axios.post(
      `${ApiCallUrl}/api/donations/${accountId}`,
      {
        campaignId: campaignId,
        amount: Number(amount),
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(() => {
        alert(`"${amount}" 포인트를 ${team?.name} 팀에 기부했습니다!`);
        onClose();
        window.location.reload();
      })
      .catch(() => {
        setError("기부 중 오류가 발생했습니다.");
      })
      .finally(() => setSubmitting(false));
  };

  const infoList = [
    { label: '팀명', value: team?.name },
    { label: '보유 포인트', value: `${userPoint.toLocaleString()} Pt` }
  ];

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>기부하기</Title>

        {loading ? (
          <InfoRow>로딩 중...</InfoRow>
        ) : error ? (
          <ErrorMsg>{error}</ErrorMsg>
        ) : (
          <>
            {infoList.map(({ label, value }) => (
              <InfoRow key={label}>
                {label}: <Highlight>{value}</Highlight>
              </InfoRow>
            ))}

            <Input
              type="number"
              placeholder="기부할 포인트 입력"
              value={amount}
              max={userPoint}
              onChange={e => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < 0) {
                  setAmount('');
                } else if (val > userPoint) {
                  setAmount(userPoint.toString());
                } else {
                  setAmount(val.toString());
                }
              }}
              style={{ color: Number(amount) > userPoint ? 'red' : '#000' }}
              disabled={submitting}
            />

            <ButtonGroup>
              <Button variant="cancel" onClick={onClose} disabled={submitting}>취소</Button>
              <Button
                variant="confirm"
                onClick={handleDonate}
                disabled={!amount || Number(amount) > userPoint || Number(amount) <= 0 || submitting}
              >
                {submitting ? '기부 중...' : '기부하기'}
              </Button>
            </ButtonGroup>
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default DonationModal;
