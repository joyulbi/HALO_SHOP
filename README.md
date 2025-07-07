# HALO_SHOP

⚾ HALOSHOP: 야구 굿즈 경매 플랫폼 리뉴얼
야구 팬 커뮤니티 기반 웹서비스를 굿즈 거래/경매 중심으로 리뉴얼하여 매출·참여도·생산성 향상을 목표로 하며,
카카오페이 연동 결제, 포인트 시스템, 출석, 경매, FCM 알림, WebSocket 실시간 처리까지 풀스택으로 구현된 플랫폼입니다.

🛠️ 기술 스택
Backend
Spring Boot 2.7.14 (Spring Security + JWT)

Java 11

MyBatis (쿼리 매핑)

MySQL

WebSocket (실시간 입찰/채팅)

FCM (푸시 알림)

KakaoPay 결제 연동

OpenAI 연동 (AI 챗봇/요약)

Frontend
Next.js 13.5

React 18.3

Redux (next-redux-wrapper)

Ant Design

Axios

Framer Motion

🚩 핵심 기능
✅ 회원/관리자 인증 (Spring Security + JWT)
✅ 마이페이지/포인트 관리
✅ 굿즈 쇼핑몰 (카테고리, 장바구니, 결제, 배송 상태)
✅ 카카오페이 결제 연동 (결제 준비/승인/취소)
✅ Mock/카드 결제 병행 가능
✅ 포인트 적립/사용 및 적립 내역 관리
✅ 실시간 경매 및 입찰 (WebSocket)
✅ 경매 종료 처리 및 낙찰자 자동 처리
✅ 출석 체크 및 포인트 보상 시스템
✅ FCM 푸시 알림 발송 연동 준비
✅ AI 요약/챗봇 서비스 (OpenAI 연동)
✅ 관리자 전용 사용자 관리 기능

🗂️ 프로젝트 구조
Backend
swift
복사
편집
src/main/java/com/company/haloshop
│
├── HaloShopApplication.java (메인)
├── payment (카카오페이, 결제/취소/승인 처리)
├── auction (경매 상품/방/입찰/메시지/서비스)
├── attendance (출석 체크, 포인트 지급)
├── ai (OpenAI 연동 챗봇/요약)
├── admin (관리자 전용 사용자 관리)
├── order (주문 관리)
├── security (JWT 인증/인가, 필터, 유틸)
└── ...
Frontend
vbnet
복사
편집
halo_react/
├── pages/ (Next.js 라우팅)
├── components/ (재사용 UI 컴포넌트)
├── store/ (Redux Store)
├── utils/ (Axios, 인증 유틸)
└── public/ (정적 파일)
🚀 실행 방법
1️⃣ Backend
DB 생성
sql
복사
편집
CREATE DATABASE haloshop CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'halo_user'@'%' IDENTIFIED BY 'halo_password';
GRANT ALL PRIVILEGES ON haloshop.* TO 'halo_user'@'%';
FLUSH PRIVILEGES;
애플리케이션 실행
application.yml 설정

DB 연결

JWT 시크릿 키

카카오페이 Admin Key

OpenAI API Key

FCM Key (필요시)

빌드 및 실행

bash
복사
편집
./mvnw clean package
java -jar target/haloshop-0.0.1-SNAPSHOT.jar
기본 API: http://localhost:8080

2️⃣ Frontend
bash
복사
편집
cd halo_react
npm install
npm run dev
기본 URL: http://localhost:3000

📦 주요 API
결제 (PaymentController)
POST /api/payment/ready: 카카오페이 결제 준비

POST /api/payment/approve: 카카오페이 결제 승인

POST /api/payment/cancel: 카카오페이 결제 취소

POST /api/payment/mock/approve: Mock 결제 승인

경매 (AuctionController)
GET /api/auction: 경매 목록

POST /api/auction: 경매 등록

POST /api/auction/bid: 실시간 입찰

POST /api/auction/end: 경매 종료

출석 (AttendanceController)
POST /api/attendance/check: 출석 체크 및 포인트 적립

GET /api/attendance/history: 출석 내역 확인

AI 요약/챗봇
POST /api/ai/chat: 챗봇 응답

POST /api/ai/summary: 텍스트 요약

🛡️ 보안
✅ JWT 기반 로그인/회원가입/인가 관리
✅ 관리자/유저 권한 분리
✅ 카카오페이 결제 Webhook 연동 보안 처리 가능
✅ CORS 설정 완료

⚡ 향후 개선 예정
TossPay, 네이버페이 연동

ElasticSearch 기반 검색

이미지 CDN (S3/CloudFront)

관리자 경매 통계 페이지

Slack/Discord 알림 연동

👥 기여 및 협업
기여 가능: 경매 고도화, 결제 연동, 관리자 대시보드, 프론트 UI 개선

Issue 등록/PR 또는 Slack 협업
