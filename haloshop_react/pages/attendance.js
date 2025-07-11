import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  CheckCircleTwoTone,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

const holidays2025 = new Set([
  "2025-01-01",
  "2025-01-27",
  "2025-01-28",
  "2025-01-29",
  "2025-01-30",
  "2025-03-01",
  "2025-03-03",
  "2025-05-05",
  "2025-05-06",
  "2025-06-06",
  "2025-08-15",
  "2025-10-03",
  "2025-10-05",
  "2025-10-06",
  "2025-10-07",
  "2025-10-08",
  "2025-10-09",
  "2025-12-25",
]);

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const getMondayStartDayIndex = (jsDayIndex) =>
  jsDayIndex === 0 ? 6 : jsDayIndex - 1;

export default function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [attendance, setAttendance] = useState({});

  // 오늘 날짜 정보
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

  useEffect(() => {
    const saved = localStorage.getItem("attendance");
    if (saved) setAttendance(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfWeek = getMondayStartDayIndex(new Date(year, month, 1).getDay());
  const lastDate = new Date(year, month + 1, 0).getDate();
  const totalCells = 42;

  const changeMonth = (offset) =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));

  const toggleAttendance = (day) => {
    const key = formatDate(year, month + 1, day);
    setAttendance((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= lastDate; d++) calendarDays.push(d);
  while (calendarDays.length < totalCells) calendarDays.push(null);

  return (
    <Container>
      <Header>
        <NavButton onClick={() => changeMonth(-1)} aria-label="이전 달">
          <LeftOutlined />
        </NavButton>
        <Title>{year}년 {month + 1}월</Title>
        <NavButton onClick={() => changeMonth(1)} aria-label="다음 달">
          <RightOutlined />
        </NavButton>
      </Header>

      <WeekHeader>
        {dayNames.map((day, i) => (
          <WeekDay key={day} weekend={i === 6} saturday={i === 5}>
            {day}
          </WeekDay>
        ))}
      </WeekHeader>

      <Grid>
        {calendarDays.map((day, i) => {
          const isEmpty = day === null;
          const dateKey = formatDate(year, month + 1, day);
          const attended = attendance[dateKey];
          const jsDay = day !== null ? new Date(year, month, day).getDay() : -1;
          const isSunday = jsDay === 0;
          const isSaturday = jsDay === 6;
          const isHoliday = day !== null && holidays2025.has(dateKey);
          const isToday = day !== null && dateKey === todayStr;

          return (
            <Cell
              key={i}
              onClick={!isEmpty ? () => toggleAttendance(day) : undefined}
              role="button"
              tabIndex={isEmpty ? -1 : 0}
              aria-pressed={!!attended}
              weekend={isSunday || isSaturday}
              holiday={isHoliday}
              attended={attended}
              today={isToday}
              title={
                isEmpty
                  ? ""
                  : isHoliday
                  ? `${day}일 – 공휴일`
                  : attended
                  ? "출석 체크됨"
                  : "출석 체크 안됨"
              }
            >
              {!isEmpty && (
                <>
                  <DateNumber>{day}</DateNumber>
                  {isHoliday && <HolidayDot />}
                  {attended && <CheckMark />}
                </>
              )}
            </Cell>
          );
        })}
      </Grid>
    </Container>
  );
}

/* Styled Components */

const Container = styled.div`
  width: 30vw;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  font-family: "Noto Sans KR", sans-serif;
  border: 1px solid #e0e0e0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  color: #1976d2;
  transition: background 0.2s;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  color: #333;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  margin-bottom: 8px;
`;

const WeekDay = styled.div`
  padding: 10px 0;
  color: ${({ weekend, saturday }) =>
    weekend ? (saturday ? "#1976d2" : "#d32f2f") : "#444"};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const Cell = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: ${({ attended, today }) =>
    today ? "#c8e6c9" : attended ? "#e8f5e9" : "#fafafa"};
  border-radius: 10px;
  border: ${({ today }) => (today ? "2px solid #388e3c" : "1px solid #e0e0e0")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: ${({ holiday, attended }) =>
    holiday ? "#d32f2f" : attended ? "#2e7d32" : "#333"};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ today }) => (today ? "#b2dfdb" : "#f0f0f0")};
  }

  &:focus {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }
`;

const DateNumber = styled.span`
  z-index: 1;
`;

const HolidayDot = styled.span`
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #d32f2f;
  border-radius: 50%;
`;

const CheckMark = styled(CheckCircleTwoTone).attrs({
  twoToneColor: "#52c41a",
})`
  position: absolute;
  font-size: 1.8rem !important;
`;
