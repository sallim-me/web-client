- Tanstack-Query 🍠
    
    클라이언트 측 데이터 상태 관리와 서버 데이터를 효율적으로 가져오는 데 특화된 React 라이브러리
    
    서버 상태를 관리한다
    
    - 특징
        - 자동 캐싱
            
            데이터를 가져오면 같은 요청에 대해 네트워크 요청을 생략하고 캐시된 데이터를 사용
            
        - 자동 리페칭
            
            데이터가 오래되거나 특정 조건이 발생하면 자동으로 새 데이터를 요청
            
        - 배경 업데이트
            
            UI를 블로킹하지 않고 데이터가 업데이트되도록 지원
            
        - 데이터 의존성 관리
            
            복잡한 데이터 구조에서도 필요한 부분만 요청하거나 업데이트를 처리할 수 있다
            
    - Tanstack-Query 초기 세팅 방법
        
        ```bash
        npm install @tanstack/react-query
        ```
        
        ```bash
        import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
        
        const queryClient = new QueryClient();
        
        function App() {
            return (
                <QueryClientProvider client={queryClient}>
                    <YourApp />
                </QueryClientProvider>
            );
        }
        ```
        
    - Query-DevTools?
        
        React Query 상태를 시각화하고 디버깅을 도화주는 도구
        
        - 기능
            
            현재 쿼리 상태(로딩, 성공, 실패)를 한눈에 볼 수 있다
            
            어떤 데이터가 캐시되어 있는지, 갱신 조건이 무엇인지 확인할 수 있다
            
        - 사용 사례
            
            복잡한 API 호출 디버깅
            
            캐시 갱신 문제를 확인할 때 유용
            
    - useQuery
        
        데이터를 가져오는 훅으로 캐싱, 리패치 등을 관리한다
        
        - 장점
            
            데이터 요청, 캐싱을 동시에 처리
            
            로딩 상태(`isLoading`), 에러 상태(`isError`)를 명확히 구분할 수 있다
            
            `staleTime`, `refetchInterval` 같은 옵션으로 데이터 갱신 주기를 세밀하게 제어할 수 있다
            
    - useInfiniteQuery
        
        무한 스크롤 등에 사용되는 훅
        
        데이터를 페이지 단위로 가져오는 경우에 사용
        
        무한 스크롤이나 점진적 데이터 로드에 적합합니다.
        
        `getNextPageParam` 함수를 통해 다음 페이지 요청 조건을 정의
        
    - queryKey
        
        쿼리별로 고유한 식별자를 부여하여 데이터를 구분하거나 갱신
        
        동일한 `queryKey`를 사용하면 데이터가 공유되며, 다른 키를 사용하면 별도 요청이 발생한다
        
- Pagination 🍠
    - Pagination은 무엇인가요?
        
        데이터를 페이지 단위로 나눠 보여주는 방식
        
        → 사용자가 모든 데이터를 한번에 불러오지 않고 일부만 불러오도록 제한한다, 원하는 데이터를 빠르게 찾을 수 있게 돕는다
        
    - Pagination을 어떠한 방식으로 구현할 수 있을까요?
        
        마지막 항목의 식별자를 기준으로 다음 데이터를 요청한다
        
        `?cursor=lastId&limit=10`
        
    - Pagination의 장점과 단점에 대해 정리해주세요.
        
        장점: 데이터 전송량 감소, 빠른 로드
        
        단점: 페이지 이동 시 상태 유지 어려움, 무한 스크롤 대비 구현 복잡도 상승
        
- Infinite Scroll 🍠
    - Intersection Observer는 무엇인가요?
        
        특정 요소가 화면에 보이는지 확인하는 브라우저 API
        
        주로 무한 스크롤에 사용
        
    - Infinite Scroll은 무엇일까요?
        
        사용자가 스크롤을 내릴 때 데이터가 자동으로 추가로 로드되는 ui 패턴
        
    - Inifinite Scroll은 어떻게 구현할까요?
        
        ```jsx
        const loadMore = () => { /* 데이터 추가 로드 */ };
        
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) loadMore();
        });
        
        observer.observe(targetElement);
        ```
        
    - Infinite Scroll의 장점과 단점에 대해 정리해주세요.
        
        장점: 페이지 로드와의 병합으로 서버 요청 감소 가능
        
        단점: 특정 데이터로 바로 이동하기 어려움