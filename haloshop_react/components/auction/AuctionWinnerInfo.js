import React, { useEffect, useState } from "react";
import { Button, Modal, Input, message } from "antd";
import api from "../../utils/axios";

export default function AuctionWinnerInfo({ auctionId }) {
  const [winner, setWinner] = useState(null);
  const [account, setAccount] = useState(null);
  const [memoModal, setMemoModal] = useState(false);
  const [adminMemo, setAdminMemo] = useState("");

  useEffect(() => {
    if (!auctionId) return;

    const fetchData = async () => {
      try {
        // 1. 낙찰 결과 가져오기
        const resultRes = await api.get(`/api/auction-results/auction/${auctionId}`);
        setWinner(resultRes.data);
        setAdminMemo(resultRes.data.adminMemo || "");

        // 2. 낙찰자 정보 조회 (방금 만든 API로)
        const accountRes = await api.get(`/user/${resultRes.data.accountId}`);
        const { account, user } = accountRes.data;

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

  // 어드민 메모 저장
  const handleSaveMemo = async () => {
    try {
      await api.post(`/api/auction-results/auction/${auctionId}/confirm`, { adminMemo }); // 구매확정이 아니더라도 메모만 수정 용도!
      message.success("어드민 메모가 저장되었습니다.");
      setMemoModal(false);
    } catch (e) {
      message.error("저장 실패");
    }
  };

  if (!winner || !account) return <div>낙찰자 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      <h3>🏆 낙찰자 정보</h3>
      <p><strong>이메일:</strong> {account.email}</p>
      <p><strong>닉네임:</strong> {account.nickname}</p>
      <p><strong>낙찰 금액:</strong> {winner.finalPrice?.toLocaleString()}원</p>
      <p><strong>낙찰 일시:</strong> {new Date(winner.createdAt).toLocaleString()}</p>
      {winner.confirmed === true && <p style={{ color: "green" }}>✔️ 구매 확정 완료</p>}
      {winner.confirmed === false && (
        <>
          <p style={{ color: "red" }}>❌ 구매 취소됨</p>
          <p><strong>거부사유:</strong> {winner.canceledReason}</p>
        </>
      )}
      <div style={{ marginTop: 18 }}>
        <Button type="primary" onClick={() => setMemoModal(true)}>
          어드민 메모 {winner.adminMemo ? "(수정)" : "작성"}
        </Button>
        <Modal
          open={memoModal}
          onCancel={() => setMemoModal(false)}
          onOk={handleSaveMemo}
          okText="저장"
          title="어드민 메모 입력"
        >
          <Input.TextArea
            rows={4}
            value={adminMemo}
            onChange={e => setAdminMemo(e.target.value)}
            placeholder="관리자 메모 입력"
          />
        </Modal>
      </div>
      {winner.adminMemo && (
        <div style={{ marginTop: 12, color: "#555" }}>
          <b>관리자 메모:</b> {winner.adminMemo}
        </div>
      )}
    </div>
  );
}
