import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Table, Select, Card, Row, Col, Spin } from 'antd';
import styled from 'styled-components';

const { Option } = Select;
// 고대비 보색 팔레트
const COLORS = ['#003f5c', '#ff6e54', '#58508d', '#ffa600', '#bc5090'];

export default function AdminSecurityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/logs')
      .then(res => {
        setLogs(res.data);
        setFilteredLogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const aggregate = (arr, key) => {
    const cnt = {};
    arr.forEach(item => {
      const v = item[key] || 'UNKNOWN';
      cnt[v] = (cnt[v] || 0) + 1;
    });
    return Object.entries(cnt).map(([name, value]) => ({ name, value }));
  };

  // 시간대별 로그 수 집계 (최근 24시간)
  const aggregateByHour = arr => {
    const cnt = {};
    arr.forEach(item => {
      const hour = moment(item.timestamp).format('HH:00');
      cnt[hour] = (cnt[hour] || 0) + 1;
    });
    return Object.entries(cnt)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([hour, value]) => ({ hour, value }));
  };

  const onFilterChange = value => {
    setActionFilter(value);
    setFilteredLogs(
      value === 'ALL' ? logs : logs.filter(l => l.action === value)
    );
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '액션', dataIndex: 'action', width: 140 },
    { title: '설명', dataIndex: 'description' },
    { title: '실행자', dataIndex: 'executor', width: 160 },
    { title: 'IP', dataIndex: 'ip', width: 140 },
    {
      title: '시간',
      dataIndex: 'timestamp',
      width: 180,
      render: ts => moment(ts).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <PageContainer>
        <Spin spinning={loading}>
          <StyledCard title="🔒 보안 로그 대시보드">
            <Row gutter={16}>
              <Col span={12}>
                <ChartCard size="small" title="액션 분포">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={aggregate(filteredLogs, 'action')}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      >
                        {aggregate(filteredLogs, 'action').map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Col>
              <Col span={12}>
                <ChartCard size="small" title="시간대별 로그 발생 수">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={aggregateByHour(filteredLogs)}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ff6e54" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Col>
            </Row>

            <Row style={{ margin: '24px 0 12px' }}>
              <Col span={6}>
                <Select value={actionFilter} onChange={onFilterChange} style={{ width: '100%' }}>
                  <Option value="ALL">전체 액션</Option>
                  {Array.from(new Set(logs.map(l => l.action))).map(act => (
                    <Option key={act} value={act}>{act}</Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredLogs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              bordered
            />
          </StyledCard>
        </Spin>
      </PageContainer>
    </>
  );
}

// Dior 스타일 컴포넌트
const PageContainer = styled.div`
  font-family: 'Playfair Display', serif;
  background: #faf8f5;
  min-height: 100vh;
  padding: 32px;
`;

const StyledCard = styled(Card)`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  .ant-card-head {
    font-size: 1.5rem;
    color: #000;
  }
`;

const ChartCard = styled(Card)`
  background: #f6f5f3;
  border-radius: 12px;
  .ant-card-head {
    color: #333;
    font-weight: bold;
  }
`;
