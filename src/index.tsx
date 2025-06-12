import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './utils/swDebug'; // Service Worker 디버깅 도구 로드

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker 등록 (PWA) - 개선된 버전
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // 기존 Service Worker 정리 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('기존 SW 등록 수:', registrations.length);
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // 캐시 우회하여 항상 최신 SW 로드
      });
      
      console.log('SW registered successfully:', registration);
      
      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('새 Service Worker 감지됨');
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('SW state changed:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 새 버전 사용 가능 - 자동으로 업데이트 적용
              console.log('새 버전이 감지되었습니다. 3초 후 업데이트를 적용합니다.');
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          });
        }
      });

      // 주기적으로 업데이트 확인 (30초마다)
      setInterval(async () => {
        try {
          await registration.update();
        } catch (error) {
          console.error('SW 업데이트 확인 실패:', error);
        }
      }, 30000);

      // 첫 로드 시 즉시 업데이트 확인
      registration.update().catch(error => {
        console.error('초기 SW 업데이트 확인 실패:', error);
      });

    } catch (error) {
      console.error('SW registration failed:', error);
    }

    // Service Worker 메시지 수신
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        window.location.reload();
      }
    });
  });

  // Service Worker 제어 변경 감지 (새 SW가 활성화됨)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker controller 변경됨');
    window.location.reload();
  });
}

const version = process.env.REACT_APP_VERSION || '1.0.0';
const buildTime = process.env.REACT_APP_BUILD_TIME || Date.now().toString();
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = `${process.env.PUBLIC_URL}/manifest.json?v=${version}&t=${buildTime}`;
document.head.appendChild(manifestLink);

// 개발 환경에서 디버깅을 위한 로그
if (process.env.NODE_ENV === 'development') {
  console.log('PWA Cache Manager initialized');
  console.log('App Version:', version);
  console.log('Build Time:', buildTime);
}
