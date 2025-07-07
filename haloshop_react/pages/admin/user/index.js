// pages/admin/user/index.js
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Spin,
  message,
  Descriptions,
  Badge,
  Space,
  Typography,
  Card
} from 'antd';
import moment from 'moment';
import api from '../../../utils/axios';

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

const STATUS_MAP = {
  1: { text: '정상', color: '#7db93b' },
  2: { text: '정지', color: '#d4380d' },
  3: { text: '휴면', color: '#faad14' },
  4: { text: '탈퇴', color: '#8c8c8c' },
};

export default function UserListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 1) 리스트 조회
  const fetchList = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/admin/user/users', {
        params: { page: 0, size: 20, email: query, nickname: query }
      });
      setData(res.data.content || []);
    } catch {
      message.error('유저 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 2) 상세 조회
  const fetchDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/user/users/${id}`);
      setSelectedDetail(res.data);
      form.setFieldsValue({
        email:         res.data.account.email,
        nickname:      res.data.account.nickname,
        phone:         res.data.account.phone,
        address:       res.data.user?.address,
        addressDetail: res.data.user?.addressDetail,
        zipcode:       res.data.user?.zipcode,
        birth:         res.data.user?.birth ? moment(res.data.user.birth) : null,
        gender:        res.data.user?.gender,
        status:        res.data.account.userStatusId,
      });
      setModalVisible(true);
    } catch {
      message.error('유저 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  // 3) 저장 핸들러
  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const id = selectedDetail.account.id;

      // 프로필 업데이트
      await api.put(`/admin/user/users/${id}`, {
        nickname:      vals.nickname,
        email:         vals.email,
        phone:         vals.phone,
        address:       vals.address,
        addressDetail: vals.addressDetail,
        zipcode:       String(vals.zipcode),
        birth:         vals.birth.format('YYYY-MM-DD'),
        gender:        vals.gender,
      });

      // 상태 변경
      if (vals.status !== selectedDetail.account.userStatusId) {
        await api.patch(`/admin/user/users/${id}/status`, { id: vals.status });
      }

      message.success('유저 정보를 저장했습니다.');
      setModalVisible(false);
      fetchList(searchText);
    } catch {
      message.error('저장 중 오류가 발생했습니다.');
    }
  };

  // 4) 삭제 핸들러
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/user/users/${id}`);
      message.success('유저를 삭제했습니다.');
      fetchList(searchText);
    } catch {
      message.error('삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname', width: 140 },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: d => moment(d).format('YY.MM.DD')
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 100,
      render: a => a
        ? <Badge color="#0539a6" text="Admin" />
        : <Badge color="#cccccc" text="User" />
    },
    {
      title: 'Status',
      dataIndex: 'userStatusId',
      key: 'userStatusId',
      width: 100,
      render: s => <Badge color={STATUS_MAP[s].color} text={STATUS_MAP[s].text} />
    },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    {
      title: 'Actions',
      key: 'action',
      width: 160,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            style={{ borderColor: '#0539a6', color: '#0539a6', fontFamily: `'Helvetica Neue', sans-serif` }}
            onClick={() => fetchDetail(r.id)}
          >Details</Button>
          <Button
            size="small"
            danger
            onClick={() => Modal.confirm({
              title: '삭제하시겠습니까?',
              onOk: () => handleDelete(r.id)
            })}
          >Delete</Button>
        </Space>
      )
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '60px auto',
        background: '#faf9f4',
        padding: 24,
        borderRadius: 12,
        fontFamily: `'Didot','Times New Roman',serif`,
      }}
    >
      <Title level={3} style={{ fontFamily: `'Didot', serif`, marginBottom: 16 }}>
        사용자 관리
      </Title>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24
      }}>
        <Search
          placeholder="이메일 또는 닉네임"
          enterButton="Search"
          onSearch={v => { setSearchText(v); fetchList(v); }}
          style={{ width: 280 }}
        />
        <Button type="primary" style={{
          background: '#0539a6',
          border: 'none',
          fontFamily: `'Helvetica Neue', sans-serif`
        }}>
          신규 생성
        </Button>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          overflowX: 'auto'
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          rowClassName={() => 'hover-row'}
          style={{ fontFamily: `'Helvetica Neue', sans-serif` }}
          bordered={false}
        />
      </Card>

      <Modal
        title={<Text style={{ fontFamily: `'Didot', serif`, fontSize: 20 }}>유저 상세 / 수정</Text>}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="저장"
        cancelText="취소"
        width={880}
        bodyStyle={{ padding: 24 }}
      >
        {detailLoading ? (
          <div style={{ textAlign:'center', padding:48 }}><Spin size="large" /></div>
        ) : selectedDetail && (
          <>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="Account ID">
                {selectedDetail.account.id}
              </Descriptions.Item>
              <Descriptions.Item label="관리자 여부">
                {selectedDetail.account.isAdmin ? 'Admin' : 'User'}
              </Descriptions.Item>
              {selectedDetail.admin && (
                <Descriptions.Item label="Admin Role">
                  {selectedDetail.admin.role}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Form form={form} layout="vertical" preserve={false}>
              <Form.Item
                name="email"
                label="이메일"
                rules={[{ required: true, message: '이메일을 입력하세요.' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nickname"
                label="닉네임"
                rules={[{ required: true, message: '닉네임을 입력하세요.' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="전화번호">
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="주소"
                rules={[{ required: true, message: '주소를 입력하세요.' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="addressDetail" label="상세주소">
                <Input />
              </Form.Item>
              <Form.Item name="zipcode" label="우편번호">
                <Input />
              </Form.Item>
              <Form.Item name="birth" label="생년월일">
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item name="gender" label="성별">
                <Select>
                  <Option value="M">남</Option>
                  <Option value="F">여</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="status"
                label="회원 상태"
                rules={[{ required: true, message: '상태를 선택하세요.' }]}
              >
                <Select>
                  <Option value={1}>정상</Option>
                  <Option value={2}>정지</Option>
                  <Option value={3}>휴면</Option>
                  <Option value={4}>탈퇴</Option>
                </Select>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      <style jsx global>{`
        /* hover 시 살짝 음영 */
        .hover-row:hover td {
          background: rgba(5,57,166,0.04);
        }
      `}</style>
    </div>
  );
}
