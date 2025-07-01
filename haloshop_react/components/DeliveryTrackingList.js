import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KakaoDraggableMap from './KakaoDraggableMap';

const DeliveryTrackingList = ({ accountId }) => {
  const [trackings, setTrackings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/delivery-tracking/user/${accountId}`);
      setTrackings(res.data);
    } catch (err) {
      console.error(err);
    //   alert('배송 추적 정보를 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal, accountId]);

  const getStepIndex = (status) => {
    switch (status) {
      case '배송준비중': return 0;
      case '출고됨': return 1;
      case '배송중': return 2;
      case '배송완료': return 3;
      default: return 0;
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>내 배송 현황 확인하기</button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: '16px' }}>배송조회</h2>

            {trackings.map((item) => {
              const step = getStepIndex(item.status);

              return (
                <div key={item.id} style={{ marginBottom: '32px' }}>
                  {/* 배송 상태 진행 표시 */}
                  <div style={styles.stepContainer}>
                    {['발송', '집하', '배송중', '도착'].map((label, idx) => (
                      <span key={idx} style={{ ...styles.stepLabel, color: step >= idx ? '#ef4444' : '#ccc' }}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div style={styles.stepBar}>
                    <div style={{ ...styles.stepProgress, width: `${(step + 1) * 25}%` }} />
                  </div>

                  {/* 상품 정보 */}
                  <div style={styles.productInfo}>
                    <img
                      src="/sample-product.png"
                      alt="상품"
                      style={styles.productImage}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>디자이너스 데일리 백(2color)</div>
                      <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px' }}>샛-출발</div>
                    </div>
                  </div>

                  {/* 배송 기록 */}
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '8px' }}>배송 기록</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li style={{ marginBottom: '8px' }}>
                        <div><strong>{item.updatedAt}</strong></div>
                        <div>{item.status} | {item.carrier} | {item.location ?? '지역 정보 없음'}</div>
                      </li>
                      <li style={{ fontSize: '12px', color: '#888' }}>
                        2022-09-25 10:58:22<br />배송 출발 | 서울 강남구
                      </li>
                      <li style={{ fontSize: '12px', color: '#aaa' }}>
                        2022-09-25 09:30:00<br />배송 진행중 | 물류센터
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}

            {/* 카카오 지도 삽입 */}
            <div style={{ margin: '24px 0' }}>
              <h4 style={{ marginBottom: '8px' }}>배송 위치 지도</h4>
              <KakaoDraggableMap />
            </div>

            <button onClick={() => setShowModal(false)} style={{ marginTop: '16px' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    background: '#fff',
    padding: '24px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90%',
    overflowY: 'auto',
  },
  stepContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '8px',
  },
  stepLabel: {
    width: '25%',
    textAlign: 'center',
  },
  stepBar: {
    height: '6px',
    background: '#eee',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  stepProgress: {
    height: '100%',
    backgroundColor: '#ef4444',
    transition: 'width 0.3s ease',
  },
  productInfo: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
};

export default DeliveryTrackingList;
