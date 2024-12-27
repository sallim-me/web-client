### 키워드 정리 🍠

- `useEffect`  🍠
    
    컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있도록 해준다
    
    React 컴포넌트의 생명 주기를 관리하는 강력한 도구
    
    - 렌더링
        
        UI를 화면에 그리는 과정
        
    
    ```jsx
    useEffect(() => {
      // 실행할 함수
      return () => {
        // 정리 작업 (Cleanup)
      };
    }, [dependency]);
    ```
    
    인자 두 개를 받는다
    
    - 첫번째 인자: **실행할 함수**
        
        컴포넌트가 렌더링될 때 호출된다
        
        렌더링 후 특정 작업을 수행하도록 예약한다
        
        `return` 문으로 정리 작업(Cleanup)을 정의할 수 있다
        
    - 두번째 인자: **의존성 배열**
        
        특정 값들의 배열
        
        배열에 값이 
        
        없다 → 컴포넌트가 처음 렌더링될 때만 실행
        
        있다 → 값이 업데이트될 때마다 다시 호출된다
        
        배열을 생략하면 모든 렌더링 시점에 `useEffect`가 실행된다
        
    - 예제 1: 처음 렌더링될 때만 실행
        
        ```jsx
        useEffect(() => { console.log("컴포넌트가 처음 렌더링되었습니다.");}, []);
        ```
        
    - 예제 2: 특정 상태 값(`count`) 변경 시 실행
        
        ```jsx
        const [count, setCount] = useState(0);
        
        useEffect(() => { console.log("count가 변경되었습니다:", count); }, [count]);
        ```
        
    - 예제 3: 정리 작업 (Cleanup)
        
        ```jsx
        useEffect(() => { const timer = setInterval(() => { console.log("1초마다 실행되는 작업");}, 1000);
        
          return () => {
            clearInterval(timer);
            console.log("타이머 정리");
          };
        }, []);
        ```
        
        컴포넌트가 제거될 때 타이머 정리 → 메모리 누수 방지
        
    
    사용 예시
    
    - API 호출
        
        데이터를 불러오기 위해 서버와 통신
        
    - 구독 설정
        
        웹소켓 또는 이벤트 리스너 등을 설정하고, 필요 시 정리
        
    - 타이머 설정
        
        일정 시간마다 실행되는 작업 정의, 타이머 정리
        

- `try, catch, finally` 구문  🍠
    
    오류가 발생할 수 있는 코드를 안전하게 실행하고 오류를 처리하기 위한 구문
    
    ```jsx
    try {
      // 예외가 발생할 가능성이 있는 코드
    } catch (error) {
      // 예외가 발생했을 때 실행할 코드
    } finally {
      // 예외 발생 여부와 관계없이 항상 실행할 코드
    }
    ```
    
    **try**
    
    오류가 발생할 가능성이 있는 코드를 작성
    
    **catch**
    
    try 블록에서 오류가 발생했을 때 실행되는 블록
    
    오류 객체(error)를 인자로 받아, 오류 정보를 로그로 출력하거나 사용자에게 알릴 수 있다
    
    **finally**
    
    try 블록에서 오류가 발생하든 안 하든 무조건 실행 → 정리 작업(cleanup)을 수행한다
    
    ex) 리소스 해제, 파일 닫기
    

- `axios`  🍠
    
    브라우저나 Node.js 환경에서 HTTP 요청을 쉽게 보낼 수 있도록 도와주는 JavaScript 라이브러리
    
    주로 REST API와 통신하기 위해 사용된다
    
    비동기 요청을 처리하고 데이터를 가져오거나 서버에 데이터를 보낼 때 사용
    
    - 비동기 요청
        
        요청을 보내고 나서 해당 작업이 완료될 때까지 기다리지 않고 다른 작업을 수행하는 방식의 요청
        
    
    - 특징
        - Promise 기반
            
            `axios`는 `Promise` 기반으로 작성되어 `async`, `await`를 사용해 비동기 요청을 쉽게 관리
            
            - Promise
                
                비동기 작업의 완료 또는 실패를 처리해주는 객체
                
        - JSON 데이터 자동 변환
            
            요청과 응답 데이터를 자동으로 JSON 형식으로 변환한다
            
        - 브라우저, Node.js 모두에서 사용 가능
            
            → 서버와 클라이언트 양쪽에서 쓸 수 있다
            
        - 요청 취소(Cancellation)
            
            요청 취소 가능 → 긴 요청 시간을 방지
            
        - 인터셉터(Interceptor) 지원
            
            요청이나 응답을 가로채 처리 가능
            
            ex) 모든 요청에 공통으로 인증 토큰을 추가하는 작업
            
        - 응답 시간 제한 (Timeout)
            
            타임아웃을 설정 → 네트워크 성능 조절
            
    
    `npm install axios` 로 설치
    
    - 사용 예시
        
        ```jsx
        import axios from 'axios';
        
        /* GET 요청 예제
        axios.get을 통해 서버에서 데이터를 불러온다
        요청이 성공하면 .then()의 response.data에 데이터를 가져온다
        */
        axios.get('<https://jsonplaceholder.typicode.com/posts>')
          .then(response => {
            console.log(response.data); // 응답 데이터를 출력
          })
          .catch(error => {
            console.error("오류 발생:", error); // 오류 처리
          });
        
        /* POST 요청 예제
        axios.post를 통해 데이터를 서버에 보낸다
        두 번째 인자로 보내고자 하는 데이터를 JSON 형식으로 전달하며, 요청이 성공하면 서버의 응답을 출력한다.*/
        axios.post('<https://jsonplaceholder.typicode.com/posts>', {
            title: 'New Post',
            body: 'This is the body of the post',
            userId: 1
          })
          .then(response => {
            console.log(response.data); // 생성된 데이터 응답 출력
          })
          .catch(error => {
            console.error("오류 발생:", error); // 오류 처리
          });
        
        ```
        

- `fetch`  🍠
    
    JavaScript에서 네트워크에 요청을 보내고 응답을 받을 수 있게 해주는 함수
    
    주로 REST API와 통신하기 위해 사용
    
    비동기 방식으로 데이터를 요청하고 처리할 수 있다
    
    - 특징
        - Promise 기반
            
            비동기 요청을 위한 `Promise`를 반환하여 `then`이나 `catch`로 체이닝하거나 `async/await`으로 처리할 수 있다
            
        - 유연한 옵션 설정
            
            다양한 HTTP 요청 메소드와 헤더, 바디 설정 가능
            
        - 내장된 JSON 변환 없음
            
            자동으로 JSON 변환을 하지 않으므로, 수동으로 `.json()` 메서드를 호출해 변환해야 한다
            
        
        장점
        
        비동기 요청을 쉽게 처리할 수 있다
        
        브라우저에서 기본적으로 지원하여 추가 설치가 필요 없다
        
        단점
        
        요청이 실패한 경우에도 `catch` 블록에서 처리되지 않아 따로 확인해야 한다
        
        특정 기능(예: 요청 타임아웃)을 기본적으로 지원하지 않는다
        
    
    - 사용 예시
        
        ```jsx
        //Get 요청
        fetch('<https://api.example.com/data>')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // 응답을 JSON으로 변환
          })
          .then(data => {
            console.log(data); // 데이터 사용
          })
          .catch(error => {
            console.error('Error:', error); // 오류 처리
          });
        
        ```
        
        ```jsx
        //Post 요청
        fetch('<https://api.example.com/data>', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
          },
          body: JSON.stringify({
            key: 'value' // 보낼 데이터
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        
        ```
        

- `axios` vs `fetch`   🍠
    - 공통점
        
        비동기 HTTP 요청을 보내기 위해 사용되는 도구
        
    - 차이점
        
        1. 설치 및 사용
        
        - Axios
            - 별도로 설치해야 한다
            - Node.js와 브라우저에서 사용할 수 있다
        - Fetch
            - 별도의 설치가 필요 없다
            - 모든 브라우저에서 사용할 수 있다
        
        2. 기본 사용법
        
        - Axios
            
            ```jsx
            import axios from 'axios';
            
            axios.get('<https://api.example.com/data>')
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            
            ```
            
        - Fetch
            
            ```jsx
            fetch('<https://api.example.com/data>')
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                console.log(data);
              })
              .catch(error => {
                console.error('Error:', error);
              });
            
            ```
            
        
        3. 기본 기능
        
        - Axios
            - 자동으로 JSON 데이터 변환
            - 타임아웃 설정 가능
        - Fetch:
            - 자동 JSON 변환이 없음
                
                응답을 JSON으로 변환하려면 명시적으로 `.json()` 메서드를 호출해야 한다
                
            - 타임아웃 기능 없음
        
        4. 오류 처리
        
        - Axios
            
            HTTP 오류(예: 404, 500)는 자동으로 `reject` 상태가 되므로 `catch` 블록에서 처리할 수 있다
            
        - Fetch
            
            `response.ok`를 사용해 HTTP 상태를 확인해야 하며, 네트워크 오류만 `catch`에서 처리된다
            
        
    
    Axios
    
    더 많은 기능과 더 나은 기본 지원을 제공하므로 복잡한 애플리케이션에서 유용하다
    
    자동 JSON 변환, 요청 취소, 인터셉터 등의 기능이 필요하다면 `axios`가 더 적합하다
    
    Fetch
    
    기본적으로 제공되며, 간단한 HTTP 요청을 수행하는 데 충분하다
    
    추가 설치가 필요 없고, API를 간단하게 사용하고자 할 때 적합하다
    

- `.env` 파일에는 어떤 내용들을 관리할까요?  🍠
    
    환경 변수를 정의하는 데 사용되는 파일
    
    애플리케이션의 구성 설정이나 비밀 정보를 관리
    
    민감한 정보를 관리하고, 다양한 환경에서의 구성 설정을 유연하게 관리하는 데 매우 유용합니다.
    
    1. **API 키**
        
        ```jsx
        API_KEY=your_api_key
        ```
        
    2. **비밀 정보**
        
        ```jsx
        DB_PASSWORD=your_database_password
        ```
        
    3. **데이터베이스 연결 정보**
        
        ```jsx
        DB_HOST=localhost //DB 주소
        DB_USER=root //사용자 이름
        DB_PASS=password //비밀번호
        DB_NAME=my_database //DB 이름
        ```
        
    4. **서버 및 포트 정보**
        
        애플리케이션이 실행될 서버 주소나 포트 번호.
        
        ```
        SERVER_HOST=127.0.0.1
        SERVER_PORT=3000
        ```
        

- `custom hook`
    
    재사용 가능한 상태 관리 및 로직을 캡슐화하는 함수
    
    React 훅을 사용하여 특정 기능을 모듈화하고, 다른 컴포넌트에서 쉽게 재사용할 수 있도록 한다
    
    사용자가 직접 정의할 수 있는 훅
    
    - 훅(Hook)
        
        상태(state) 및 생명주기(lifecycle) 기능을 함수형 컴포넌트에서 사용할 수 있게 해주는 특수한 함수
        
        ### 주요 훅
        
        1. **useState**
            
            컴포넌트의 상태 관리
            
        2. useEffect
            
            컴포넌트의 생명주기(마운트, 업데이트, 언마운트)와 관련된 사이드 이펙트를 처리
            
        3. useContext
            
            전역 상태를 관리
            
        
        ### 주의사항
        
        훅은 최상위 레벨에서만 호출해야 한다
        
        조건문이나 반복문 내에서는 호출하면 안 된다
        
    
    - 기본 구조
        
         `use`로 시작하는 함수로 정의
        
        내부에서 React의 기본 훅(`useState`, `useEffect` 등)을 사용 가능
        
    
    1. 재사용성
        
        여러 컴포넌트에서 공통으로 사용하는 로직을 하나의 훅으로 만들 수 있어 코드 중복을 줄인다
        
    2. 가독성 향상
        
        로직을 함수로 캡슐화하여 코드의 가독성을 높인다
        
    3. 테스트 용이성
        
        커스텀 훅을 별도로 테스트할 수 있어 코드의 품질을 향상시킨다
        

### useNavigate, useLocation

- useNavigate, useLocation
    
    ### useNavigate
    
    페이지를 이동할 때 사용
    
    - react-router의 `Link`  vs  `useNavigate`
        
        **`Link`**
        
        UI 요소로 사용되어 사용자가 클릭할 수 있는 링크를 생성한다
        
        사용자가 클릭하는 방식으로 경로를 변경할 때 적합하다
        
        **`useNavigate`**
        
        프로그래밍적으로 경로를 변경할 때 사용
        
        특정 이벤트나 조건에 따라 동적으로 경로를 변경하고자 할 때 적합하다
        
    
    어떠한 이벤트(클릭, 더블클릭, 키보드 입력 etc..)가 일어난 이후 페이지를 이동시키고 싶거나, 페이지 이동 후 추가적인 로직이 필요한 경우 `useNavigate`을 활용한다
    
    ```jsx
    <button onClick={() => navigate('/profile', {
      replace: false,
      state: { userId: 123, userName: 'JohnDoe' }
    })}>
      View Profile
    </button>
    ```
    
    인자 2개를 받는다
    
    - **replace**
        - `replace: true`
            
            현재의 히스토리 항목을 새로운 URL로 대체
            
            → 사용자가 뒤로 가기 버튼을 누르면 방금 이동한 페이지가 아니라 이동 전의 페이지가 아닌 경우에는 메인 페이지("/")로 돌아간다. 
            
            브라우저의 히스토리에 새로운 항목이 추가되지 않으므로 사용자가 이전 페이지로 돌아가지 못한다
            
        - `replace: false`
            
            false로 설정하거나 생략 → 기본값 적용
            
            이동한 페이지가 브라우저의 히스토리에 새로운 항목으로 추가된다. 
            
            사용자가 뒤로 가기 버튼을 눌렀을 때, 방금 이동한 페이지로 돌아갈 수 있다. 
            
    - state
        
        위 예시에서 버튼을 클릭하면 사용자는 `/profile` 페이지로 이동합니다. 이때 `state` 객체를 통해 `userId`와 `userName` 정보를 전달하게 됩니다. 이 정보는 `/profile` 페이지에서 `useLocation` 훅을 사용해 접근할 수 있습니다.
        
        ```jsx
        import { useLocation } from 'react-router-dom';
        
        const ProfilePage = () => {
          const location = useLocation();
          const { userId, userName } = location.state || {}; // state를 안전하게 접근
        
          return (
            <div>
              <h1>Profile Page</h1>
              <p>User ID: {userId}</p>
              <p>User Name: {userName}</p>
            </div>
          );
        };
        ```
        
    
    `ProfilePage` 컴포넌트에서는 `useLocation` 훅을 통해 `state`에 접근하여 `userId`와 `userName`을 출력합니다. 이 정보를 이용해 페이지에서 사용자 관련 데이터를 동적으로 표시할 수 있습니다.
    

### useParams

- useParams
    
    ### useParams
    
    우리가, 만약에 `Dynamic Routing`을 설정했다고 가정해보겠습니다.
    
    ```jsx
    {
        path: '/movie/:movieId',
        element: <MovieDetailPage/>
    }
    ```
    
    이전에, 제가 설명드린 내용에서, `Dynamic Routing`은 `:`을 앞에 붙인 형태로, 작성된다고 말씀드렸고, `뒤의 이름을 기억`해야 한다고 전달해드렸습니다.
    
    ```jsx
    import { useParams } from 'react-router-dom';
    
    const MovieDetailPage = () => {
      const params = useParams();
      console.log(params)
    
      return (
        <div className="test">
          <p>현재 페이지의 파라미터는 { params.movieId } 입니다.</p>
        </div>
      )
    }
    
    export default MovieDetailPage;
    ```
    
    ![스크린샷 2024-09-14 오전 1.37.32.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/7ae8b375-053b-43b4-8507-8c05feaecd82/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-14_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_1.37.32.png)
    
    이런식으로, `params`의 값이 입력됨을 알 수 있다. 우리가 실제로 위에서 설정한 `movieId` 라는 이름으로, 파라미터의 값이 전달됨을 확인할 수 있습니다.
    
    조금 더 깔끔하게 적기 위해서, `구조분해 할당`을 활용할 수 있습니다.
    
    ```jsx
    import { useParams } from 'react-router-dom';
    
    const MovieDetailPage = () => {
      const {movieId} = useParams();
    
      return (
        <div className="test">
          <p>현재 페이지의 파라미터는 { movieId } 입니다.</p>
        </div>
      )
    }
    
    export default MovieDetailPage;
    ```
    
    보통, `데이터 개별 조회`를 하는 경우에, 이 `해당하는 ID를 활용`해서, 데이터 조회 요청을 하므로, 매우 유용한 패턴이니 꼭 익히시길 바랍니다!