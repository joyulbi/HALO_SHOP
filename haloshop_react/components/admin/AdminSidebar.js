import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  { label: '관리자 메인', path: '/admin' },
  { label: '시스템 관리', path: '/admin/system' },
  { label: '보안', path: '/admin/security/logs' },
  { label: '유저 관리', path: '/admin/user' },
  { label: '상품 등록', path: '/admin/items' },
  { label: '재고 관리', path: '/admin/inventory' },
  { label: '멤버십 관리', path: '/admin/membership' },
  { label: '주문 내역', path: '/admin/order' },
  { label: '포인트 로그', path: '/admin/point/pointlog' },
  { label: '리뷰 관리', path: '/admin/reviews' },
  { label: '배송 관리', path: '/admin/delivery' },
  { label: '문의 관리', path: '/admin/inquiries' },
  { label: '야구팀 설정', path: '/admin/teams' },
  { label: '시즌 설정', path: '/admin/seasons' },
  { label: '기부 캠페인', path: '/admin/campaign' },
];

const AdminSidebar = () => {
  const router = useRouter();

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      left: '20px',
      width: '200px',
      maxHeight: 'calc(100vh - 160px)',
      backgroundColor: '#1f2937',
      color: '#1f2937',
      padding: '20px',
      borderRadius: '12px',
      overflowY: 'auto',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      <h2 style={{
        fontSize: '20px',
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#60a5fa'
      }}>
        관리자 메뉴
      </h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: '10px' }}>
            <Link href={item.path} passHref>
              <span
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  color: router.pathname === item.path ? '#1e3a8a' : '#cbd5e1',
                  backgroundColor: router.pathname === item.path ? '#dbeafe' : 'transparent',
                  fontSize: '15px',
                  borderRadius: '4px',
                  transition: '0.2s',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
