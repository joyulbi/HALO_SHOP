import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  CheckCircleTwoTone,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

/* ===== styled-components (외부 UI) ===== */
const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: #333;
  margin-bottom: 12px;
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  font-size: 1rem;
  margin-bottom: 32px;
`;

const StatusPanel = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatusBox = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  text-align: center;
  min-width: 160px;
`;

const StatusLabel = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 8px;
`;

const StatusValue = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #1976d2;
`;

/* ===== styled-components (달력) ===== */
const Container = styled.div`
  width: 30vw;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e0e0;
  font-family: "Noto Sans KR", sans-serif;
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
  background: ${({ today, attended }) =>
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
  transition: background 0.2s;
  &:hover {
    background: ${({ today }) => (today ? "#b2dfdb" : "#f0f0f0")};
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

const Footer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const CheckinButton = styled.button`
  background-color: ${({ checked, animate }) =>
    animate
      ? "#4caf50" // 애니메이션 중 초록
      : checked
      ? "#9e9e9e" // 출석 완료 후 비활성 회색
      : "#1976d2"}; // 기본 파랑

  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: ${({ checked }) => (checked ? "default" : "pointer")};
  transition: background 0.2s ease;
  animation: ${({ animate }) => (animate ? "bounce 0.4s" : "none")};

  &:hover {
    background-color: ${({ checked }) =>
      checked ? "#9e9e9e" : "#1565c0"};
  }

  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
`;

/* ===== 유틸 ===== */
const formatDate = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const getMondayStartDayIndex = (jsDay) => (jsDay === 0 ? 6 : jsDay - 1);
const getAttendanceCount = (attendance) =>
  Object.values(attendance).filter(Boolean).length;

const holidays2025 = new Set([
  "2025-01-01", "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30",
  "2025-03-01", "2025-03-03", "2025-05-05", "2025-05-06", "2025-06-06",
  "2025-08-15", "2025-10-03", "2025-10-05", "2025-10-06", "2025-10-07",
  "2025-10-08", "2025-10-09", "2025-12-25",
]);

/* ===== 컴포넌트 ===== */
function AttendanceCalendar({ attendance, setAttendance, buttonText, setButtonText, animate, setAnimate, onCheckin }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfWeek = getMondayStartDayIndex(new Date(year, month, 1).getDay());
  const lastDate = new Date(year, month + 1, 0).getDate();

  const handleAttendanceButtonClick = () => {
    setAnimate(true);
    setButtonText("출석 완료");
    setAttendance((prev) => ({ ...prev, [todayStr]: true }));
    setTimeout(() => setAnimate(false), 400);
    setTimeout(() => setButtonText("출석"), 1000);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= lastDate; d++) calendarDays.push(d);
  while (calendarDays.length < 42) calendarDays.push(null);

  return (
    <Container>
      <Header>
        <NavButton onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><LeftOutlined /></NavButton>
        <Title>{year}년 {month + 1}월</Title>
        <NavButton onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><RightOutlined /></NavButton>
      </Header>

      <WeekHeader>
        {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
          <WeekDay key={day} weekend={i === 6} saturday={i === 5}>{day}</WeekDay>
        ))}
      </WeekHeader>

      <Grid>
        {calendarDays.map((day, i) => {
          const isEmpty = day === null;
          const dateKey = formatDate(year, month + 1, day);
          const attended = attendance[dateKey];
          const jsDay = day ? new Date(year, month, day).getDay() : -1;
          const isHoliday = day && holidays2025.has(dateKey);
          const isToday = dateKey === todayStr;

          return (
            <Cell
              key={i}
              tabIndex={isEmpty ? -1 : 0}
              role="button"
              title={isEmpty ? "" : isHoliday ? `${day}일 – 공휴일` : attended ? "출석 체크됨" : "출석 체크 안됨"}
              today={isToday}
              attended={attended}
              holiday={isHoliday}
              weekend={jsDay === 0 || jsDay === 6}
            >
              {!isEmpty && <><DateNumber>{day}</DateNumber>{isHoliday && <HolidayDot />}{attended && <CheckMark />}</>}
            </Cell>
          );
        })}
      </Grid>

      <Footer>
        <CheckinButton
          onClick={onCheckin}
          animate={animate}
          checked={buttonText === "출석 완료"}  // checked로 전달
          disabled={buttonText === "출석 완료"} // 버튼 비활성화
        >
          {buttonText}
        </CheckinButton>
      </Footer>
    </Container>
  );
}

/* ===== 최상위 페이지 ===== */
export default function AttendancePage() {
  const [attendance, setAttendance] = useState({});
  const [buttonText, setButtonText] = useState("출석");
  const [animate, setAnimate] = useState(false);
  const { user, isLoggedIn, loading } = useAuth();


  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

  useEffect(() => {
    if (!user?.id) return;

    async function fetchAttendance() {
      try {
        const res = await axios.get(`http://localhost:8080/api/attendances/${user.id}`);
        const data = res.data;

        const attendanceMap = {};
        data.forEach((record) => {
          attendanceMap[record.attendanceDate] = true;
        });

        setAttendance(attendanceMap);

        // 오늘 출석 여부 확인 후 버튼 상태 업데이트
        if (attendanceMap[todayStr]) {
          setButtonText("출석 완료");
        } else {
          setButtonText("출석");
        }
      } catch (err) {
        console.error("출석 기록 로드 실패:", err);
      }
    }

    fetchAttendance();
}, [user?.id, todayStr]);


  const isTodayChecked = !!attendance[todayStr];
  const totalCheckins = getAttendanceCount(attendance);

  const handleAttendance = async () => {
    if (buttonText === "출석 완료") return; // 이미 출석 완료면 무시

    try {
      setAnimate(true);
      setButtonText("출석 완료");

      await axios.post("http://localhost:8080/api/attendances", {
        accountId: user.id,
        attendanceDate: todayStr,
      });

      setAttendance((prev) => ({ ...prev, [todayStr]: true }));

      setTimeout(() => setAnimate(false), 400);
      // 텍스트는 "출석 완료"로 유지 (다시 "출석"으로 안 바꿈)
    } catch (error) {
      console.error("출석 저장 실패", error);
      alert(error.response?.data || "출석 저장에 실패했습니다.");
      setAnimate(false);
      setButtonText("출석");
    }
  };

  return (
    <PageWrapper>
      <PageTitle>출석 체크 이벤트</PageTitle>
      <Description>매일 출석하고 다양한 혜택을 받아보세요!</Description>

      <StatusPanel>
        <StatusBox>
          <StatusLabel>오늘 출석</StatusLabel>
          <StatusValue style={{ color: isTodayChecked ? "#4caf50" : "#f44336" }}>
            {isTodayChecked ? "완료" : "미완료"}
          </StatusValue>
        </StatusBox>
        <StatusBox>
          <StatusLabel>누적 출석</StatusLabel>
          <StatusValue>{totalCheckins}일</StatusValue>
        </StatusBox>
      </StatusPanel>

      <AttendanceCalendar
        attendance={attendance}
        setAttendance={setAttendance}
        buttonText={buttonText}
        setButtonText={setButtonText}
        animate={animate}
        setAnimate={setAnimate}
        onCheckin={handleAttendance}
      />
    </PageWrapper>
  );
}
