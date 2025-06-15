import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA 캐싱 기능을 완전히 비활성화했습니다.
// Service Worker와 모든 캐싱 로직이 제거되었습니다.

console.log('PWA 캐싱 기능이 비활성화되었습니다.');
console.log('모든 리소스는 항상 최신 버전으로 로드됩니다.');
