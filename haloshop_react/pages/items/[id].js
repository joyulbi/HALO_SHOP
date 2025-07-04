import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import { CartButtonContext } from '../../context/CartButtonContext';
import api from '../../utils/axios';
import { useCart } from '../../context/CartContext';
import ItemDetailTabs from '../../components/ItemDetailTabs';

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

  const productImageRef = useRef(null);
  const { cartButtonRef } = useContext(CartButtonContext);
  const { fetchCartCount } = useCart();

  useEffect(() => {
    if (id) {
      api.get(`/api/items/${id}`)
        .then(res => setItem(res.data))
        .catch(err => console.error('상품 상세 불러오기 실패:', err));
    }
  }, [id]);

  const handleMouseMove = (e) => {
    let x = e.nativeEvent.offsetX;
    let y = e.nativeEvent.offsetY;

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
    const productImage = item.images && item.images.length > 0 ? `http://localhost:8080${item.images[0].url}` : '/images/no-image.png';

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

  api.post('/api/cart', {
    accountId: 8,
    itemsId: item.id,
    quantity: quantity
  })
    .catch(err => console.error('장바구니 담기 실패:', err));

  setTimeout(() => {
    setIsFlying(false);
    fetchCartCount();
  }, 1200);
};

  const handleBuyNow = () => {
    router.push(`/order/OrderFormPage?itemId=${item.id}&quantity=${quantity}`);
  };


  if (!item) return <div>로딩중...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>{item.name}</h1>

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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '20px' }}>
          <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{item.description}</p>
          <p style={{ fontSize: '24px', color: '#c8102e', fontWeight: 'bold' }}>가격: {item.price.toLocaleString()}원</p>

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
      {showLens && (
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
            backgroundSize: `${400 * zoom}px ${400 * zoom}px`,
            backgroundPosition: `-${(lensPosition.x * zoom - lensSize / 2)}px -${(lensPosition.y * zoom - lensSize / 2)}px`,
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
