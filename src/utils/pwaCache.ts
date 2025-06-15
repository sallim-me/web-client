// PWA 캐시 관리 유틸리티
export class PWACacheManager {
  private static instance: PWACacheManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.initializeServiceWorker();
  }

  static getInstance(): PWACacheManager {
    if (!PWACacheManager.instance) {
      PWACacheManager.instance = new PWACacheManager();
    }
    return PWACacheManager.instance;
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        this.registration = registration || null;
        if (!this.registration) {
          this.registration = await navigator.serviceWorker.register('/sw.js');
        }
      } catch (error) {
        console.error('Service Worker 등록 실패:', error);
      }
    }
  }

  // 캐시 강제 새로고침
  async forceCacheRefresh(): Promise<void> {
    if (this.registration) {
      // Service Worker 업데이트 확인
      await this.registration.update();
      
      // 새 Service Worker가 대기 중이면 활성화
      if (this.registration.waiting) {
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }

    // 모든 캐시 삭제
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }

    // 페이지 새로고침
    window.location.reload();
  }

  // 버전 체크 및 업데이트 확인
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return !!this.registration.waiting;
    } catch (error) {
      console.error('업데이트 확인 실패:', error);
      return false;
    }
  }

  // 현재 캐시 상태 확인
  async getCacheInfo(): Promise<{ size: number; keys: string[] }> {
    if (!('caches' in window)) {
      return { size: 0, keys: [] };
    }

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalSize += keys.length;
    }

    return {
      size: totalSize,
      keys: cacheNames
    };
  }

  // 특정 URL의 캐시 삭제
  async deleteCacheForUrl(url: string): Promise<boolean> {
    if (!('caches' in window)) return false;

    const cacheNames = await caches.keys();
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const deleted = await cache.delete(url);
      if (deleted) return true;
    }
    
    return false;
  }

  // 앱 버전 정보 가져오기
  getAppVersion(): string {
    return process.env.REACT_APP_VERSION || '1.0.0';
  }

  // 빌드 시간 가져오기
  getBuildTime(): string {
    return process.env.REACT_APP_BUILD_TIME || Date.now().toString();
  }
}

// 전역 PWA 캐시 매니저 인스턴스
export const pwaCacheManager = PWACacheManager.getInstance();

// 개발자 도구에서 사용할 수 있는 글로벌 함수
if (typeof window !== 'undefined') {
  (window as any).forcePWARefresh = () => pwaCacheManager.forceCacheRefresh();
  (window as any).checkPWAUpdates = () => pwaCacheManager.checkForUpdates();
  (window as any).getPWACacheInfo = () => pwaCacheManager.getCacheInfo();
}
