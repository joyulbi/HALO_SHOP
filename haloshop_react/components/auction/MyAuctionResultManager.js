import React, { useEffect, useState } from "react";
import { Card, Button, Input, Modal, message, Spin } from "antd";
import api from "../../utils/axios";
import { useAuth } from "../../hooks/useAuth"; // useAuth 훅 추가!

export default function MyAuctionResultManager() {
  const { user, loading: userLoading } = useAuth(); // user.id 활용
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [inputReason, setInputReason] = useState({});
  const [modalAuctionId, setModalAuctionId] = useState(null);

  // 낙찰 결과 불러오기
  useEffect(() => {
    if (userLoading) return; // 로그인 정보 로딩 중엔 대기
    if (!user?.id) return;   // 로그인 사용자 없으면 중단
    setLoading(true);
    api.get("/api/auction-results/me", { params: { accountId: user.id } })
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [user, userLoading]);

  // 구매확정 처리
  const handleConfirm = async (auctionId) => {
    try {
      await api.post(`/api/auction-results/auction/${auctionId}/confirm`, {confirmed: true});
      message.success("구매확정 완료");
      setResults(results => results.map(r => r.auctionId === auctionId ? { ...r, confirmed: true } : r));
    } catch (e) {
      message.error("구매확정 실패");
    }
  };

  // 구매거부 모달 열기
  const showRefuseModal = (auctionId) => setModalAuctionId(auctionId);

  // 구매거부 제출
  const handleRefuse = async (auctionId) => {
    const reason = inputReason[auctionId];
    if (!reason || reason.length < 2) return message.warning("거부사유를 입력하세요!");
    try {
      await api.post(`/api/auction-results/auction/${auctionId}/cancel`, { canceledReason: reason, confirmed: false });
      message.success("구매거부 처리 완료");
      setResults(results => results.map(r => r.auctionId === auctionId ? { ...r, confirmed: false, canceledReason: reason } : r));
      setModalAuctionId(null);
    } catch (e) {
      message.error("구매거부 실패");
    }
  };

  if (userLoading || loading) return <Spin />;
  if (!user?.id) return <div>로그인 후 이용 가능합니다.</div>;
  if (!results.length) return <div>내 낙찰 내역이 없습니다.</div>;

  return (
    <div>
      <h2 style={{ margin: "18px 0" }}>내 낙찰 결과</h2>
      {results.map(result => (
        <Card key={result.auctionId} style={{ marginBottom: 16 }}>
          <b>경매ID: {result.auctionId}</b>
          <div>낙찰 금액: {result.finalPrice?.toLocaleString()}원</div>
          <div>상태: {result.confirmed === true
            ? <span style={{ color: "green" }}>구매 확정</span>
            : result.confirmed === false
              ? <span style={{ color: "red" }}>구매 거부</span>
              : <span style={{ color: "#666" }}>미확정</span>}
          </div>
          {result.canceledReason && (
            <div style={{ color: "#c00" }}>거부사유: {result.canceledReason}</div>
          )}

          {result.adminMemo && (
            <div style={{ marginTop: 8, color: "#666" }}>
              <b>관리자 메모:</b> {result.adminMemo}
            </div>
          )}
                    
          <div style={{ marginTop: 12 }}>
            {result.confirmed == null && (
              <>
                <Button type="primary" onClick={() => handleConfirm(result.auctionId)} style={{ marginRight: 8 }}>
                  구매확정
                </Button>
                <Button type="default" danger onClick={() => showRefuseModal(result.auctionId)}>
                  구매거부
                </Button>
                <Modal
                  open={modalAuctionId === result.auctionId}
                  title="구매 거부 사유 입력"
                  onCancel={() => setModalAuctionId(null)}
                  onOk={() => handleRefuse(result.auctionId)}
                  okText="제출"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="거부 사유를 입력하세요"
                    value={inputReason[result.auctionId] || ""}
                    onChange={e => setInputReason({ ...inputReason, [result.auctionId]: e.target.value })}
                  />
                </Modal>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
