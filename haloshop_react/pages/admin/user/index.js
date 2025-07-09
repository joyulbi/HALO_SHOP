// pages/admin/user/index.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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
  Card,
  Row,
  Col
} from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import api from '../../../utils/axios';
import styled, { createGlobalStyle } from 'styled-components';

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

const STATUS_MAP = {
  1: { text: '정상', color: '#7db93b' },
  2: { text: '정지', color: '#d4380d' },
  3: { text: '휴면', color: '#faad14' },
  4: { text: '탈퇴', color: '#8c8c8c' },
};
const CHART_COLORS = ['#003f5c', '#58508d', '#ff6e54', '#ffa600'];

export default function UserListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 서버 사이드 페이지 정보
  const [pageInfo, setPageInfo] = useState({ current: 0, size: 20, total: 0 });

  // 리스트 조회 (페이지, size, 검색어)
  const fetchList = async (query = '', { current, size } = pageInfo) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/user/users', {
        params: { page: current, size, email: query, nickname: query }
      });
      // sort admins first
      const list = (res.data.content || []).sort((a, b) =>
        (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0)
      );
      setData(list);
      setPageInfo(info => ({ ...info, total: res.data.totalElements }));
    } catch {
      message.error('유저 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상세 조회
  const fetchDetail = async id => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/user/users/${id}`);
      setSelectedDetail(res.data);
      form.setFieldsValue({
        email: res.data.account.email,
        nickname: res.data.account.nickname,
        phone: res.data.account.phone,
        address: res.data.user?.address,
        addressDetail: res.data.user?.addressDetail,
        zipcode: res.data.user?.zipcode,
        birth: res.data.user?.birth ? moment(res.data.user.birth) : null,
        gender: res.data.user?.gender,
        status: res.data.account.userStatusId
      });
      setModalVisible(true);
    } catch {
      message.error('유저 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const id = selectedDetail.account.id;
      await api.put(`/admin/user/users/${id}`, {
        nickname: vals.nickname,
        email: vals.email,
        phone: vals.phone,
        address: vals.address,
        addressDetail: vals.addressDetail,
        zipcode: String(vals.zipcode),
        birth: vals.birth.format('YYYY-MM-DD'),
        gender: vals.gender
      });
      if (vals.status !== selectedDetail.account.userStatusId) {
        await api.patch(`/admin/user/users/${id}/status`, { id: vals.status });
      }
      message.success('유저 정보를 저장했습니다.');
      setModalVisible(false);
      fetchList(searchText, pageInfo);
    } catch {
      message.error('저장 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchList('', pageInfo);
  }, []);

  // 차트 데이터 집계
  const aggregate = (arr, fn) => {
    const cnt = {};
    arr.forEach(item => {
      const k = fn(item);
      cnt[k] = (cnt[k] || 0) + 1;
    });
    return Object.entries(cnt).map(([name, value]) => ({ name, value }));
  };
  const roleData = aggregate(data, d => (d.isAdmin ? 'Admin' : 'User'));
  const statusData = aggregate(data, d => STATUS_MAP[d.userStatusId].text);

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
      render: a =>
        a ? <Badge color="#000" text="Admin" /> : <Badge color="#555" text="User" />
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
      width: 120,
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => fetchDetail(r.id)}>
            Details
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Didot&display=swap"
          rel="stylesheet"
        />
      </Head>
      <GlobalStyle />
      <Wrapper>
        <Title level={3}>사용자 관리</Title>

        {/* 1) Admin/User 비율 차트, 2) 유저 상태 차트 */}
        <ChartRow gutter={16}>
          <ChartCol span={12}>
            <Card size="small" title="Admin vs User 비율">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {roleData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </ChartCol>
          <ChartCol span={12}>
            <Card size="small" title="회원 상태 분포">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </ChartCol>
        </ChartRow>

        {/* 검색 및 신규 생성 */}
        <Toolbar>
          <Search
            placeholder="이메일 또는 닉네임"
            enterButton="Search"
            onSearch={v => {
              setSearchText(v);
              fetchList(v, { ...pageInfo, current: 0 });
            }}
            style={{ width: 300 }}
          />
          <Button className="primaryButton">신규 생성</Button>
        </Toolbar>

        {/* 목록 테이블 */}
        <StyledCard>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              current: pageInfo.current + 1,
              pageSize: pageInfo.size,
              total: pageInfo.total,
              showSizeChanger: true
            }}
            onChange={({ current, pageSize }) => {
              const next = {
                current: current - 1,
                size: pageSize,
                total: pageInfo.total
              };
              setPageInfo(next);
              fetchList(searchText, next);
            }}
            rowClassName={r => (r.isAdmin ? 'admin-row' : 'hover-row')}
            bordered={false}
          />
        </StyledCard>

        {/* 상세 모달 */}
        <Modal
          title={
            <Text className="modalTitle">
              유저 상세
              {selectedDetail?.account.isAdmin ? ' (Admin 읽기전용)' : ''}
            </Text>
          }
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSave}
          okText="저장"
          cancelText="취소"
          width={880}
          bodyStyle={{ padding: 24 }}
          footer={selectedDetail?.account.isAdmin ? null : undefined}
        >
          {detailLoading ? (
            <div className="loadingContainer">
              <Spin size="large" />
            </div>
          ) : (
            selectedDetail && (
              <>
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  className="descriptions"
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
                <Form
                  form={form}
                  layout="vertical"
                  preserve={false}
                  className="form"
                  disabled={selectedDetail.account.isAdmin}
                >
                  <Form.Item
                    name="email"
                    label="이메일"
                    rules={[
                      { required: true, message: '이메일을 입력하세요.' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="nickname"
                    label="닉네임"
                    rules={[
                      { required: true, message: '닉네임을 입력하세요.' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="전화번호">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="주소"
                    rules={[
                      { required: true, message: '주소를 입력하세요.' }
                    ]}
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
                    rules={[
                      { required: true, message: '상태를 선택하세요.' }
                    ]}
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
            )
          )}
        </Modal>
      </Wrapper>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    background: #f7f5f0 !important;
    font-family: 'Didot', serif !important;
  }
  .hover-row:hover td {
    background: rgba(0,0,0,0.03) !important;
  }
  .admin-row {
    background: rgba(180,151,90,0.1) !important;
    font-weight: bold;
  }
  .primaryButton {
    background: #000 !important;
    border: none !important;
    color: #fff !important;
    font-family: 'Didot', serif !important;
    height: 40px;
  }
  .primaryButton:hover {
    background: #333 !important;
  }
  .modalTitle {
    font-family: 'Didot', serif;
    font-size: 20px;
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: none;
`;

const ChartRow = styled(Row)`
  margin-bottom: 24px;
`;

const ChartCol = styled(Col)`
  & .ant-card-head {
    font-family: 'Didot', serif;
    font-weight: bold;
  }
`;
