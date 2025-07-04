import { useAuth } from "../../hooks/useAuth";

export default function AuctionLog({
  logs, highest, inputBid, setInputBid, handleBid, isFinished, minBid, errorMsg, accountMap
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
            {user && log.accountId === user.id
              ? `${user.nickname}님`
              : `${accountMap && accountMap[log.accountId] ? accountMap[log.accountId] : log.accountId}님`
            }이 {log.price.toLocaleString()}원에 입찰
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
          최고 입찰가 {highest ? highest.toLocaleString() : "-"}
        </div>
        <input
          type="number"
          placeholder={`최소 ${minBid || 0}원, 100원 단위`}
          value={inputBid}
          disabled={isFinished}
          min={minBid}
          step={100}
          onChange={e => setInputBid(e.target.value)}
          style={{
            width: "90%", fontSize: "1rem", marginBottom: 10, padding: 6, border: "1px solid #ccc", borderRadius: 4
          }}
        />
        <button
          style={{
            width: "90%", padding: "8px 0", background: "#ff2222", color: "#fff", fontWeight: "bold",
            border: "none", borderRadius: 5, fontSize: "1rem"
          }}
          onClick={handleBid}
          disabled={isFinished}
        >입찰하기</button>
        {isFinished && <div style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>경매가 종료되었습니다.</div>}
        {errorMsg && <div style={{ color: "red", marginTop: 10 }}>{errorMsg}</div>}
        <div style={{ fontSize: "0.9rem", marginTop: 8, color: "#555" }}>
          최소 입찰 가능 금액: <b>{minBid ? minBid.toLocaleString() : "-"}</b>원, 100원 단위만 가능
        </div>
      </div>
    </div>
  );
}
