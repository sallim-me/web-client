# PWA 캐시 업데이트

### 1. Service Worker 캐싱 전략 개선
- **Network First**: HTML 문서는 항상 네트워크에서 최신 버전을 가져옴
- **Cache with Update**: JS/CSS는 캐시를 사용하되 백그라운드에서 업데이트
- **Dynamic Cache Names**: 각 빌드마다 새로운 캐시 이름 사용

### 2. 자동 업데이트 시스템
- 30초마다 자동으로 새 버전 확인
- 새 버전 감지 시 자동 활성화 (`skipWaiting()`)
- 모든 클라이언트에서 즉시 새 Service Worker 적용 (`clients.claim()`)

### 3. 캐시 무효화 강화
- 빌드 시간 기반 버전 관리
- HTTP 캐시 헤더로 브라우저 캐시 제어
- Manifest 파일에 쿼리 파라미터 추가

### 4. 사용자 친화적 업데이트 UI
- Material-UI Snackbar로 업데이트 알림
- 사용자가 선택할 수 있는 업데이트 옵션

## 사용법

### 자동 업데이트
새 버전이 배포되면 30초 이내에 자동으로 감지되어 업데이트됩니다.

### 수동 강제 새로고침
개발자 도구 콘솔에서 다음 명령어 사용:
\`\`\`javascript
// Service Worker 상태 확인
debugSW()

// 모든 Service Worker 제거
unregisterAllSW()

// 모든 캐시 삭제
clearAllCaches()

// 완전 새로고침 (Service Worker + 캐시 모두 제거)
forceRefreshPWA()
\`\`\`

## 📱 모바일 PWA 효과

이제 모바일에서 "홈 화면에 추가"된 PWA 앱에서도:
- ✅ 새 버전이 즉시 반영됨
- ✅ 캐시된 이전 버전 문제 해결
- ✅ 사용자에게 업데이트 알림 제공
- ✅ 자동 또는 수동 업데이트 선택 가능

## 🔍 개발자를 위한 디버깅

### Service Worker 상태 확인
\`\`\`javascript
navigator.serviceWorker.getRegistrations().then(console.log)
\`\`\`

### 캐시 상태 확인
\`\`\`javascript
caches.keys().then(console.log)
\`\`\`

### 강제 업데이트
\`\`\`javascript
navigator.serviceWorker.getRegistrations().then(regs => 
  Promise.all(regs.map(reg => reg.update()))
)
\`\`\`

## 빌드 설정

버전 정보가 자동으로 포함되도록 빌드 스크립트가 개선되었습니다:
\`\`\`json
{
  "scripts": {
    "build": "cross-env REACT_APP_VERSION=$npm_package_version REACT_APP_BUILD_TIME=$(date +%s) craco build"
  }
}
\`\`\`
