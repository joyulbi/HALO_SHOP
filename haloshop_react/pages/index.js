import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import api from '../utils/axios';
import { useRouter } from 'next/router';

const Home = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const bannerImages = [
    '/images/slide1.png',
    '/images/slide2.jpeg',
    '/images/slide3.jpeg'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true
  };

  useEffect(() => {
    api.get('/api/items')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('상품 목록 불러오기 실패:', err);
      });
  }, []);

  // 🔥 로그인 여부 체크 및 이동 함수 (JWT 토큰 key: accessToken)
  const goToCart = () => {
    const token = localStorage.getItem('accessToken'); // ✅ key 정확히 수정

    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return; // 로그인 안 했으면 이동 차단
    }

    router.push('/cart'); // 로그인 했으면 장바구니 이동
  };

  const goToCheckout = () => {
    const token = localStorage.getItem('accessToken'); // ✅ key 정확히 수정

    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      return; // 로그인 안 했으면 이동 차단
    }

    router.push('/checkout'); // 결제 페이지 이동
  };

  return (
    <>
      {/* 메인 슬라이드 */}
      <section className="banner" style={{ marginBottom: '50px' }}>
        <Slider {...sliderSettings}>
          {bannerImages.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`banner-${idx}`} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '10px' }} />
            </div>
          ))}
        </Slider>
      </section>

      {/* 메인 상품 목록 */}
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        추천 상품
      </h2>

      <section className="product-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', marginBottom: '50px' }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
};

export default Home;
