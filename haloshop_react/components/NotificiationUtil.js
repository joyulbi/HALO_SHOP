import axios from "axios";

export const notificationUtil = async (notification, token) => {
  try {
    const entityId = notification.entityId || notification.entity?.id;

    // 문의 알림 (100번대)
    if (entityId === 100) {
      const res = await axios.get(
        `http://localhost:8080/api/inquiries/${notification.referenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...notification, title: res.data.title };
    }

    // 경매 관련 알림 (200~299번대)
    if (entityId >= 200 && entityId < 300) {
      const res = await axios.get(
        `http://localhost:8080/api/auctions/${notification.referenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...notification, title: res.data.title };
    }

    // 시즌 관련 알림 (300~399번대)
    if (entityId >= 300 && entityId < 400) {
      const res = await axios.get(
        `http://localhost:8080/api/seasons/${notification.referenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...notification, title: res.data.name };
    }

    // 주문(배송) 항목 관련 알림 (400~499번대)
    if (entityId >= 400 && entityId < 500) {
      const res = await axios.get(
        `http://localhost:8080/api/order-items/${notification.referenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...notification, title: res.data.itemName };  // itemName 값을 title에 설정
    }

    // 기본 fallback
    return { ...notification, title: null };
  } catch (err) {
    console.error("알림 상세 조회 실패:", err);
    return { ...notification, title: null };
  }
};
