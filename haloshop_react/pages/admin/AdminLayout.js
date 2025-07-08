import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <>
      {/* 고정 사이드바는 별도 */}
      <AdminSidebar />

      {/* 메인 영역은 밀리지 않음 */}
      <main style={{
        minHeight: '100vh',
        padding: '40px 40px 40px 40px', // 필요시 padding 조절
        backgroundColor: '#fff', // 흰 배경
      }}>
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
