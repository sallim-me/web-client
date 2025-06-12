/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

// Service Worker for Sallim PWA
const STATIC_CACHE = 'sallim-static-v2';
const DYNAMIC_CACHE = 'sallim-dynamic-v2';
const CACHE_VERSION = Date.now().toString();

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/Assets.xcassets/AppIcon.appiconset/192.png',
  '/icons/Assets.xcassets/AppIcon.appiconset/512.png'
];

// Install event - cache static resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // 즉시 활성화하여 새 버전을 바로 적용
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // 이전 캐시 정리
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      }),
      // 모든 클라이언트 즉시 제어
      self.clients.claim()
    ])
  );
});

// Fetch event - Network First strategy for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // HTML 문서는 네트워크 우선 (최신 버전 확보)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공적으로 네트워크에서 가져온 경우 캐시에 저장
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 반환
          return caches.match(request);
        })
    );
    return;
  }

  // JS, CSS 등 정적 자산은 캐시 우선이지만 네트워크에서 업데이트 확인
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // 새 버전을 캐시에 저장
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 캐시에서 반환
            return cache.match(request);
          });
      })
    );
    return;
  }

  // 기타 리소스 (이미지, 폰트 등)는 캐시 우선
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  return Promise.resolve();
}

// 클라이언트로부터의 메시지 처리
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/Assets.xcassets/AppIcon.appiconset/192.png',
      badge: '/icons/Assets.xcassets/AppIcon.appiconset/72.png',
      vibrate: [100, 50, 100],
      data: data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow('/')
  );
});
