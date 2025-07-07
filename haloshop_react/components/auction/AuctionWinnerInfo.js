import React, { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function AuctionWinnerInfo({ auctionId }) {
  const [winner, setWinner] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!auctionId) return;

    const fetchData = async () => {
      try {
        // 1. 낙찰 결과 가져오기
        const resultRes = await api.get(`/api/auction-results/auction/${auctionId}`);
        setWinner(resultRes.data);

        // 2. 낙찰자 정보 조회 (방금 만든 API로)
        const accountRes = await api.get(`/user/${resultRes.data.accountId}`);
        const { account, user } = accountRes.data;

        // 3. 렌더링에 쓸 정보 가공
        setAccount({
          email: account.email,
          nickname: account.nickname || user?.nickname || "-"
        });

      } catch (err) {
        console.error("낙찰자 정보 조회 실패:", err);
        setWinner(null);
        setAccount(null);
      }
    };

    fetchData();
  }, [auctionId]);

  if (!winner || !account) return <div>낙찰자 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>🏆 낙찰자 정보</h3>
      <p><strong>이메일:</strong> {account.email}</p>
      <p><strong>닉네임:</strong> {account.nickname}</p>
      <p><strong>낙찰 금액:</strong> {winner.finalPrice.toLocaleString()}원</p>
      <p><strong>낙찰 일시:</strong> {new Date(winner.createdAt).toLocaleString()}</p>
      {winner.confirmed === true && <p style={{ color: "green" }}>✔️ 구매 확정 완료</p>}
      {winner.confirmed === false && <p style={{ color: "red" }}>❌ 구매 취소됨</p>}
    </div>
  );
}
