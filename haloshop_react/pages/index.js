import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import api from '../utils/axios';  // axios 세팅 파일 import

const Home = () => {
  const [products, setProducts] = useState([]);

  // 슬라이드 샘플 이미지
  const bannerImages = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner3.jpg'
  ];

  // 슬라이드 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  // 🔥 상품 API 연동
  useEffect(() => {
    api.get('/api/items')  // Spring Boot API 경로
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('상품 목록 불러오기 실패:', err);
      });
  }, []);

  return (
    <div>
      {/* 네비게이션 */}
      <header>
        <nav>
          <Link href="/">홈</Link> | 
          <Link href="/items">상품</Link> | 
          <Link href="/donation">기부캠페인</Link> | 
          <Link href="/customer">고객센터</Link>
        </nav>
      </header>

      {/* 메인 슬라이드 */}
      <section className="banner">
        <Slider {...sliderSettings}>
          {bannerImages.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`banner-${idx}`} style={{ width: '100%' }} />
            </div>
          ))}
        </Slider>
      </section>

      {/* 메인 상품 목록 */}
      <section className="product-list" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      {/* 사이드 퀵 메뉴 (고정) */}
      <div className="quick-menu" style={{ position: 'fixed', right: '20px', top: '200px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button>💳</button>
        <button>🛒</button>
        <button>👤</button>
      </div>
    </div>
  );
};

export default Home;
