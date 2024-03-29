# Auth Best Practice 프로젝트

목적: 로그인, 로그아웃, 회원가입, 리프레시 기능을 제대로 구현한다.

## Detail

- 로그아웃 시 jti 정보를 블랙리스트 테이블에 등록하여 jwt 강제 만료
- Global Exception Filter 구현
- 토큰 만료 기간 + now로 만료일자 계산하는 함수 구현
- jti 생성을 위한 간단한 랜덤 ID 생성 알고리즘 구현
- 블랙리스트 등록 시 토큰 만료일 보다 길게 설정하여 Batch로 삭제 가능하도록 구현
- access, refresh 토큰 생성 시 Promise.all을 써서 비동기 동작시켜 효율성 확보
- swagger 접속 시 간단한 인증 구현 적용 방법

# Issue

- JWT 만료 기간이 지났음에도 만료 에러를 발행하지 않는다.
  - iat 설정은 초 단위로 설정될 것을 기대하는데 나는 Date.now()를 그냥 쓰는 바람에 밀리초 단위로 입력되었다.
  - iat를 기반으로 만료 일자를 계산하므로 iat가 초 단위로 입력되도록 해야 토큰 만료 일자가 정상 등록된다.

## Done

- 회원가입, 로그인, 로그아웃, 리프레시 엔드포인트 구현
- AWS EC2와 RDS를 활용하여 서버 배포
- 프론트엔드(Next.js)와 테스트 완료
- Swagger 작성

## In Progress

- social login
