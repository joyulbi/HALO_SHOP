import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

const List = styled.div`
  min-width: 200px;
`;

const ListItem = styled.div`
  margin-bottom: 0.5rem;
  font-weight: ${({ highlight }) => (highlight ? "700" : "400")};
  color: ${({ highlight }) => (highlight ? "#007bff" : "#333")};
`;

const Select = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;

const COLORS = [
  "#0088FE", "#00C49F", "#FF8042", "#FFBB28",
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40",
];

const CampaignSeasonTeamsManagement = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [data, setData] = useState([]);

  // 시즌 목록 불러오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/seasons")
      .then(res => setSeasons(res.data))
      .catch(err => console.error("시즌 데이터 로딩 실패", err));
  }, []);

  // 선택된 시즌에 따른 기부 데이터 불러오기
  useEffect(() => {
    if (!selectedSeasonId) {
      setData([]);
      return;
    }
    axios.get(`http://localhost:8080/api/donation-campaigns/season/${selectedSeasonId}`)
      .then(res => {
        const chartData = res.data.map(item => ({
          name: item.team.name,
          value: item.total,
        }));
        setData(chartData);
      })
      .catch(err => {
        console.error("데이터 로딩 실패", err);
        setData([]);
      });
  }, [selectedSeasonId]);

  const totalSum = data.reduce((sum, item) => sum + item.value, 0);

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div>
      <h3>시즌 선택 및 팀 기부 현황</h3>
      <Select
        value={selectedSeasonId}
        onChange={e => setSelectedSeasonId(e.target.value)}
      >
        <option value="">-- 시즌 선택 --</option>
        {seasons.map(season => (
          <option key={season.id} value={season.id}>
            {season.name} ({new Date(season.startDate).toLocaleDateString()} ~{" "}
            {new Date(season.endDate).toLocaleDateString()})
          </option>
        ))}
      </Select>

      {!selectedSeasonId ? (
        <p>시즌을 선택해주세요.</p>
      ) : totalSum === 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={[{ name: "데이터 없음", value: 1 }]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label="데이터 없음"
            fill="#999999"
          />
        </PieChart>
      ) : (
        <Container>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString()} separator=": " />
            <Legend />
          </PieChart>

          <List>
            <h4>팀별 기부 총액 순위</h4>
            {sortedData.map(({ name, value }, index) => (
              <ListItem
                key={name}
                highlight={index === 0}
              >
                {index + 1}. {name} - {value.toLocaleString()} 원
              </ListItem>
            ))}

            <hr />
            <ListItem style={{ fontWeight: 600, marginTop: "1rem" }}>
              총 기부 금액: {totalSum.toLocaleString()} 원
            </ListItem>
          </List>
        </Container>
      )}
    </div>
  );
};

export default CampaignSeasonTeamsManagement;
