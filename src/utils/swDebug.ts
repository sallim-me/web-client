// Service Worker 디버깅 및 재등록 유틸리티
export const debugServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // 현재 등록된 Service Worker 정보 출력
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log('현재 등록된 Service Workers:', registrations.length);
      registrations.forEach((registration, index) => {
        console.log(`SW ${index + 1}:`, {
          scope: registration.scope,
          active: registration.active?.state,
          installing: registration.installing?.state,
          waiting: registration.waiting?.state
        });
      });
    });
  }
};

export const unregisterAllServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map(registration => registration.unregister())
    );
    console.log('모든 Service Worker 등록 해제 완료');
  }
};

export const clearAllCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    );
    console.log('모든 캐시 삭제 완료');
  }
};

export const forceRefreshPWA = async () => {
  await unregisterAllServiceWorkers();
  await clearAllCaches();
  window.location.reload();
};

// 개발자 도구에서 사용할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).debugSW = debugServiceWorker;
  (window as any).unregisterAllSW = unregisterAllServiceWorkers;
  (window as any).clearAllCaches = clearAllCaches;
  (window as any).forceRefreshPWA = forceRefreshPWA;
}
