// pages/admin/security/logs.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';              // ← 여기!
import moment from 'moment';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Table, Select, Card, Row, Col, Spin } from 'antd';

const { Option } = Select;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4567'];

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

  const onFilterChange = value => {
    setActionFilter(value);
    setFilteredLogs(
      value === 'ALL'
        ? logs
        : logs.filter(l => l.action === value)
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
    <Spin spinning={loading}>
      <Card title="🔒 보안 로그 대시보드" style={{ margin: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="액션 분포">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={aggregate(filteredLogs, 'action')}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {aggregate(filteredLogs, 'action').map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="실행자 분포">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={aggregate(filteredLogs, 'executor')}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {aggregate(filteredLogs, 'executor').map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row style={{ margin: '24px 0 12px' }}>
          <Col span={4}>
            <Select
              value={actionFilter}
              onChange={onFilterChange}
              style={{ width: '100%' }}
            >
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
      </Card>
    </Spin>
  );
}
