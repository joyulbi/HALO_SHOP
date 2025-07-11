import { useRouter } from 'next/router';

const AdminMainPage = () => {
  const router = useRouter();

  const categories = [
    {
      title: '시스템 관리자',
      buttons: [
        { label: '시스템 관리자 페이지', path: '/admin/system' },
        { label: '보안 관리 페이지', path: '/admin/security/logs' },
        { label: '유저 관리 페이지', path: '/admin/user' },
      ]
    },
    {
      title: '상품 관리',
      buttons: [
        { label: '상품 등록 페이지', path: '/admin/items' },
        { label: '상품 재고 관리 페이지', path: '/admin/inventory' },
      ]
    },
    {
      title: '회원 및 주문 관리',
      buttons: [
        { label: '멤버십 생성 페이지', path: '/admin/membership' },
        { label: '주문 내역 페이지', path: '/admin/order' },
        { label: '포인트 로그 조회 페이지', path: '/admin/point/pointlog' },
      ]
    },
    {
      title: '리뷰 및 배송 관리',
      buttons: [
        { label: '리뷰 관리 페이지', path: '/admin/reviews' },
        { label: '배송 관리 페이지', path: '/admin/delivery' },
      ]
    },
    {
      title: '기타 관리자',
      buttons: [
        { label: '문의 관리 페이지', path: '/admin/inquiries' },
        { label: '야구팀 설정 페이지', path: '/admin/teams' },
        { label: '시즌 설정 페이지', path: '/admin/seasons' },
        { label: '기부 캠페인 페이지', path: '/admin/campaign' },
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '50px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '50px' }}>관리자 메인 페이지</h1>

      {/* 1행 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
        {categories.slice(0, 3).map((category, idx) => (
          <CategoryCard key={idx} category={category} router={router} />
        ))}
      </div>

      {/* 2행 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        {categories.slice(3).map((category, idx) => (
          <CategoryCard key={idx} category={category} router={router} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category, router }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.3s',
        width: '250px',
        height: 'auto',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)'}
    >
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        width: '100%',
        textAlign: 'center'
      }}>
        {category.title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        {category.buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => router.push(btn.path)}
            style={{
              padding: '12px 16px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminMainPage;
