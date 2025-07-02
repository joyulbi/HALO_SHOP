import { useAuth } from "../../hooks/useAuth";

export default function AuctionLog({
  logs, highest, inputBid, setInputBid, handleBid, isFinished
}) {
  const { user } = useAuth();

  return (
    <div style={{
      background: "#eef3ff", border: "4px solid #3d6fee", borderRadius: 12, padding: 18,
      display: "flex", flexDirection: "row", alignItems: "stretch"
    }}>
      {/* 입찰 로그 */}
      <div style={{ flex: 2, marginRight: 18 }}>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>경매 로그 실시간 정보</div>
        {logs.length > 0 ? logs.map((log, i) => (
          <div key={i}>
            {/* 내 로그만 내 닉네임, 나머진 accountId */}
            {user && log.accountId === user.id
              ? `${user.nickname}님`
              : `${log.accountId}님`
            }이 {log.price}원에 입찰
          </div>
        )) : <div>입찰 로그 없음</div>}
      </div>
      {/* 입찰폼 */}
      <div style={{
        flex: 1, background: "#fff", border: "2px solid #111",
        borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: 180
      }}>
        <div style={{
          width: "90%", marginBottom: 10, background: "#111", color: "#fff",
          fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", padding: 5, borderRadius: 5
        }}>
          최고 입찰가 {highest}
        </div>
        <input type="number" placeholder="입찰가 입력"
          value={inputBid}
          disabled={isFinished}
          onChange={e => setInputBid(e.target.value)}
          style={{
            width: "90%", fontSize: "1rem", marginBottom: 10, padding: 6, border: "1px solid #ccc", borderRadius: 4
          }} />
        <button style={{
          width: "90%", padding: "8px 0", background: "#ff2222", color: "#fff", fontWeight: "bold",
          border: "none", borderRadius: 5, fontSize: "1rem"
        }} onClick={handleBid} disabled={isFinished}>입찰하기</button>
        {isFinished && <div style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>경매가 종료되었습니다.</div>}
      </div>
    </div>
  );
}
