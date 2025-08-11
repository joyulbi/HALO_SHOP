# AWS EC2 보안 점검 보고서

## 1. 개요
본 보고서는 AWS EC2에서 운영 중인 개발 환경(리눅스 기반)에 대해,
외부 접근 가능성 및 노출된 서비스 현황을 점검한 결과를 정리한 것입니다.  
실제 서비스가 아닌 포트폴리오/개발 테스트 목적의 서버입니다.

---

## 2. 점검 대상
- **인스턴스 타입:** t2.medium (AWS EC2)
- **운영체제:** Ubuntu Linux
- **목적:** 프론트엔드(Next.js) + 백엔드(Spring Boot, .jar) 동작 확인
- **배포 구조:**  
  - 프론트: Next.js (3000 포트)
  - 백엔드: Spring Boot (8080 포트)
  - Nginx: 80 포트에서 정적 자원 서빙 및 프록시 가능
  - SSH: 22 포트

---

## 3. 로그 분석 결과
> aws 콘솔지표에서 트래픽이 순간적으로 확 튀길래 면접관님들이 방문하신 줄 알고 설레서 로그 살펴봄

### 3.1 Nginx Access Log
- 다수의 해외 IP로부터 자동화 스캐너/봇 접근 탐지
  - `/index.php`, `.env`, `/public/index.php`, `/containers/json` 등 취약점 스캐닝 시도
  - User-Agent: `libredtail-http` 등 비정상 UA
- 정상적인 브라우저 접속 로그도 일부 존재
- 특정 국가(우크라이나, 싱가포르, 중국)에서 의심 트래픽 관찰
- 대부분 백엔드 공격은 jar파일로 실행되는 백엔드덕분에 실행이 안됨, 혹은 메서드 요청이 달랐음

---

## 4. 포트 스캔 결과 (nmap)

### 4.1 오픈 포트
| 포트 | 상태 | 서비스 | 버전 |
|------|------|--------|------|
| 22/tcp   | open | ssh | OpenSSH 9.6p1 (Ubuntu) |
| 80/tcp   | open | http | nginx 1.24.0 (Ubuntu) |
| 3000/tcp | open | http | Next.js |
| 8080/tcp | open | http-proxy | Spring Boot 내장 Tomcat |
| 443/tcp  | closed | https | - |

### 4.2 보안 의미
- 22: **publickey 인증만 허용**, 패스워드 로그인 불가 → 무차별 대입 방지
- 3000/8080: 직접 외부 노출됨 → 내부망 전환 필요
- 443: 미사용, HTTPS 미구현 상태

---

## 5. 서비스별 점검

### 5.1 프론트엔드 (3000 포트 / Next.js)
- `X-Powered-By: Next.js` 노출
- 빌드 모드: 프로덕션(소스맵 접근 시 404)
- 번들 분석 결과:
  - 내부 경로 `/api/item` 노출
  - 백엔드 주소 `http://43.202.189.108:8080` 하드코딩
- `/api/item` 호출 시 404, `/api/items`는 백엔드 연결로 데이터 응답

### 5.2 백엔드 (8080 포트 / Spring Boot)
- 응답 헤더:
  - `XSRF-TOKEN` 쿠키 발급 (SameSite=None)
  - 보안 헤더 양호 (CSP, X-Frame-Options, X-Content-Type-Options 등)
- `/api/items`:
  - HTTP 200, 상품 목록 JSON 응답
  - S3 퍼블릭 이미지 URL 포함 (`yoonhalo12345.s3.ap-northeast-2.amazonaws.com`)
- `/api/item`, `/api/v1/items`:
  - HTTP 404 (경로 없음)

---

## 6. 보안 취약점 및 노출 가능성

### 6.1 외부 노출
- 3000/8080 포트가 직접 외부 접근 가능
  - 프론트/백 분리 배포 환경에서는 보통 내부망에서만 통신
  - 현재는 IP만 알면 직접 API 호출 가능

### 6.2 정보 노출
- 프론트 빌드에 백엔드 절대경로 포함
- `/api/items`로 상품 데이터 및 S3 URL 직접 수집 가능
- S3 버킷은 개별 객체 읽기 가능, 목록 조회는 차단(403)

### 6.3 HTTPS 미사용
- HTTP로만 통신 → 세션 쿠키, CSRF 토큰이 암호화되지 않음
- `SameSite=None` 쿠키는 HTTPS에서만 정상 동작 (Secure 플래그 필요)

---

## 7. 개선 권고 사항

1. **네트워크 접근 제어**
   - AWS 보안그룹(Security Group)에서 80/443만 외부 허용
   - 22, 3000, 8080은 내부망 또는 특정 IP만 허용

2. **리버스 프록시 구성**
   - Nginx(80/443)에서만 외부 요청 처리
   - `/api/*` 요청은 내부 8080으로 프록시
   - 3000은 빌드된 정적 파일로만 배포

3. **HTTPS 적용**
   - 443 포트 열기
   - Let’s Encrypt 등 무료 SSL 인증서 적용
   - 쿠키에 Secure 플래그 설정

4. **프론트 보안 헤더 강화**
   - `next.config.js`에 `poweredByHeader: false` 설정
   - 소스 빌드 시 불필요한 API 경로/URL 제거

5. **스토리지 보안**
   - S3 버킷 정책 재검토 (퍼블릭 접근 최소화)
   - 이미지 외 다른 파일 노출 여부 점검

6. **모니터링**
   - CloudTrail 관리 이벤트 활성화 (무료)
   - CloudWatch Logs로 Nginx/앱 로그 중앙 수집
   - VPC Flow Logs는 필요 시 구간 제한 적용

---

## 8. 결론
현재 서버는 개발 환경으로, 일부 API와 정적 리소스가 퍼블릭하게 노출되어 있음  
