import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import api from '../utils/axios';

const Home = () => {
  const [products, setProducts] = useState([]);

  const bannerImages = [
    '/images/기아응원타올.jpg',
    '/images/삼성케이스.jpg',
    '/images/ssg유니폼.jpg'
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
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
      <section className="product-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', marginBottom: '50px' }}>
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
    </>
  );
};

export default Home;
