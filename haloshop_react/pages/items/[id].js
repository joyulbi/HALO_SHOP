import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import { CartButtonContext } from '../../context/CartButtonContext';
import api from '../../utils/axios';
import { useCart } from '../../context/CartContext';
import ItemDetailTabs from '../../components/ItemDetailTabs';
import SirenLottie from '../../components/lottie/SirenLottie';

const ItemDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  const lensSize = 150;
  const zoom = 3;

  const [flyImage, setFlyImage] = useState(null);
  const [flyStyle, setFlyStyle] = useState({});
  const [isFlying, setIsFlying] = useState(false);
  const [animationName, setAnimationName] = useState('');

  const [sentiment, setSentiment] = useState('');  // 감정 분석 상태 추가

  const productImageRef = useRef(null);
  const { cartButtonRef } = useContext(CartButtonContext);
  const { fetchCartCount } = useCart();

useEffect(() => {
  if (!id) return;

  api.get(`/api/items/${id}`)  // 로그인 필요 없는 API니까 토큰 필요 없음
    .then(res => setItem(res.data))
    .catch(err => {
      if (err.response?.status === 404) {
        alert("해당 상품이 존재하지 않습니다.");
        router.push("/");
      } else {
        console.error('상품 상세 불러오기 실패:', err);
      }
    });

    // 감성 분석 비율 가져오기
    const review = "이 제품은 정말 훌륭합니다!";  // 예시 리뷰 텍스트
    api.post(`/api/items/${id}/sentiment`, { review })  // 감성 분석 API 호출
      .then(res => setSentiment(`이 제품은 ${res.data.positivePercentage}% 긍정적인 반응을 얻었어요!`))
      .catch(err => {
        console.error('감성 분석 불러오기 실패:', err);
      });
}, [id]);

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  const width = e.currentTarget.offsetWidth;
  const height = e.currentTarget.offsetHeight;

  if (x < lensSize / 2) x = lensSize / 2;
  if (x > width - lensSize / 2) x = width - lensSize / 2;
  if (y < lensSize / 2) y = lensSize / 2;
  if (y > height - lensSize / 2) y = height - lensSize / 2;

  setLensPosition({ x, y });
};


  const handleNextImage = () => {
    if (item && item.images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % item.images.length);
    }
  };

  const handlePrevImage = () => {
    if (item && item.images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length);
    }
  };

const handleAddToCart = async () => {
  if (isSoldOut) {
    alert("품절된 상품입니다.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인 후 이용 가능합니다.");
    router.push("/login");
    return;
  }

  const productImage = item.images && item.images.length > 0
    ? `http://localhost:8080${item.images[0].url}`
    : '/images/no-image.png';

  const productRect = productImageRef.current.getBoundingClientRect();
  const targetRect = cartButtonRef.current.getBoundingClientRect();

  const startX = productRect.left;
  const startY = productRect.top;

  const centerX = window.innerWidth / 2 - productRect.width / 2;
  const centerY = window.innerHeight / 2 - productRect.height / 2;

  const endX = targetRect.left + targetRect.width / 2 - productRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2 - productRect.height / 2;

  const newAnimationName = `flyToCart${Date.now()}`;
  setAnimationName(newAnimationName);

  const styleSheet = document.styleSheets[0];
  const keyframes =
    `@keyframes ${newAnimationName} {
      0% { transform: translate(${startX}px, ${startY}px) scale(1); }
      50% { transform: translate(${centerX}px, ${centerY}px) scale(0.3); }
      100% { transform: translate(${endX}px, ${endY}px) scale(0.1); }
    }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  setFlyImage(productImage);
  setFlyStyle({
    position: 'fixed',
    top: '0',
    left: '0',
    width: `${productRect.width}px`,
    height: `${productRect.height}px`,
    animation: `${newAnimationName} 1.2s ease-in-out forwards`,
    zIndex: 9999
  });
  setIsFlying(true);

  // ✅ 실제 장바구니 담기 요청
  api.post('/api/cart', {
    accountId: 8, // 실제론 백엔드에서 토큰 기반 accountId 추출하는게 좋음
    itemsId: item.id,
    quantity: quantity
  }).catch(err => console.error('장바구니 담기 실패:', err));

  setTimeout(() => {
    setIsFlying(false);
    fetchCartCount();
  }, 1200);
};

const handleBuyNow = () => {
  if (isSoldOut) {
    alert("품절된 상품입니다.");
    return;
  }

  router.push({
    pathname: '/order/SingleOrderFormPage',
    query: {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      quantity: quantity
    }
  });
};



  if (!item) return <div>로딩중...</div>;

  const isSoldOut = item.inventory_volume === 0;
  console.log('🔥 item.inventory_volume:', item.inventory_volume);
console.log('🔥 isSoldOut:', isSoldOut);

  return (
    <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
        {item.name}
          {isSoldOut && (
            <span style={{
              marginLeft: '10px',
              fontSize: '18px',
              color: 'white',
              backgroundColor: '#c8102e',
              padding: '4px 10px',
              borderRadius: '6px',
              verticalAlign: 'middle'
            }}>
              품절
            </span>
            )}
      </h1>

      {/* 감성 분석 결과 표시 */}
      {sentiment && (
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c8102e', marginBottom: '20px', textAlign: 'center' }}>
          {sentiment}
        </div>
      )}

      <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* 🔥 버튼 + 이미지: 가로 정렬 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* 이전 버튼 */}
          {item.images.length > 1 && (
            <button
            onClick={handlePrevImage}
            style={{
              fontSize: '24px',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ◀
          </button>
          )}

          {/* 이미지 + 렌즈 */}
          <div
            style={{ position: 'relative', width: '400px', height: '400px', overflow: 'hidden', cursor: 'crosshair' }}
            onMouseEnter={() => setShowLens(true)}
            onMouseLeave={() => setShowLens(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={productImageRef}
              src={item.images && item.images.length > 0 ? `http://localhost:8080${item.images[currentIndex].url}` : '/images/no-image.png'}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />

            {showLens && (
              <div
                style={{
                  position: 'absolute',
                  width: `${lensSize}px`,
                  height: `${lensSize}px`,
                  top: `${lensPosition.y - lensSize / 2}px`,
                  left: `${lensPosition.x - lensSize / 2}px`,
                  border: '2px solid #000',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>

          {/* 다음 버튼 */}
          {item.images.length > 1 && (
          <button
            onClick={handleNextImage}
            style={{
              fontSize: '24px',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ▶
          </button>
          )}
        </div>

        {/* 상품 정보 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: '20px',
            padding: '36px',
            backgroundColor: '#fffdfc',
            borderRadius: '16px',
            border: '1px solid #ddd', // ✅ 테두리 추가
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', // ✅ 그림자 강화
            minWidth: '440px',
            transition: 'box-shadow 0.3s ease',
          }}>
          <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{item.description}</p>
          <p style={{ fontSize: '24px', color: '#c8102e', fontWeight: 'bold' }}>가격: {item.price.toLocaleString()}원</p>
        {item.inventory_volume <= 10 && item.inventory_volume > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#ffeaea',
            padding: '8px 12px',
            borderRadius: '6px'
          }}>
            <SirenLottie />
            <p style={{
              fontSize: '16px',
              color: '#d00000',
              fontWeight: 'bold', 
              margin: 0
            }}>
              현재 남은 재고: {item.inventory_volume}개
            </p>
          </div>
        )}

          <div>
            <label style={{ marginRight: '10px' }}>수량: </label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleBuyNow}
              style={{
                padding: '12px 24px',
                backgroundColor: '#c8102e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#a80d26'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#c8102e'}
            >
              구매하기
            </button>

            <button
              onClick={handleAddToCart}
              style={{
                padding: '12px 24px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
            >
              장바구니 담기
            </button>
          </div>
        </div>
      </div>

      {/* 확대 뷰 */}
{showLens && productImageRef.current && (
  <div
    style={{
      position: 'absolute',
      top: '120px',
      left: '500px',
      width: '400px',
      height: '400px',
      border: '1px solid #ccc',
      backgroundImage: `url(${item.images[currentIndex] ? `http://localhost:8080${item.images[currentIndex].url}` : '/images/no-image.png'})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${productImageRef.current.offsetWidth * zoom}px ${productImageRef.current.offsetHeight * zoom}px`,
      backgroundPosition: `-${lensPosition.x * zoom - 200}px -${lensPosition.y * zoom - 200}px`, // 200 = 400(확대 박스 너비)/2
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      zIndex: 1000
    }}
  />
)}

      {/* 플라잉 이미지 */}
      {isFlying && (
        <img src={flyImage} style={flyStyle} />
      )}
      <ItemDetailTabs item={item} />
    </div>
  );
};

export default ItemDetail;
