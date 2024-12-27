- State
    
    애플리케이션에서 동적인 데이터를 관리하는 방법
    
    ex) 버튼 클릭 시 카운트 값 증가 
    
    - State를 정의할 때 중요한 점은 무엇이고, 그 이유는 무엇인가요?
        
        불변성 유지
        
        상태를 직접 수정하지 않고 복사본을 만든 뒤 복사본을 수정하여 새로운 상태로 설정한다
        
        → 다시 렌더링하지 않아 react의 추적을 피할 수 있다
        
        컴포넌트 간 데이터 흐름
        
        부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달한다
        
    - React Component 생명주기에 대해 설명해주세요.
        
        Mounting
        
        컴포넌트가 처음 화면에 나타날 때 실행
        
        `constructor`, `getDerivedStateFromProps`, `render`, `componentDidMount` 등
        
        Updating
        
        컴포넌트의 상태나 props가 변경될 때 실행
        
        `getDerivedStateFromProps`, `shouldComponentUpdate`, `render`, `getSnapshotBeforeUpdate`, `componentDidUpdate` 등
        
        Unmounting
        
        컴포넌트가 DOM에서 제거될 때 실행
        
        `componentWillUnmount`
        
- Hooks
    - Hooks가 개발된 이유는 무엇인가요?
        
        클래스형 컴포넌트의 복잡한 로직을 함수형 컴포넌트에서도 사용하기 위해서
        
    - useState에 대한 간단한 설명과 사용법을 설명해 주세요.
        
        useState
        
        함수형 컴포넌트에서 상태를 선언하고 관리할 수 있게 해주는 Hook
        
        ```cpp
        const [state, setState] = useState(initialState);
        ```
        
    - SideEffect의 사전적 의미와, React에서 사용되는 의미와 함께 React에서는 왜 해당 의미를 갖는지, 그 이유를 함께 설명해 주세요.
        
        SideEffect
        
        어떤 동작이 외부 상태나 시스템의 상태에 영향을 미치는 현상
        컴포넌트 렌더링 외부에서 일어나는 동작들
        
        ex) API 호출, 타이머 설정, 이벤트 리스너 등록 등
        
        React에서 렌더링과 관련된 작업만 관리하고, 그 외의 작업은 side effect로 분리하여 관리하여 렌더링 성능 최적화
        
    - useEffect에 대한 간단한 설명과 사용법, 그리고 useEffect 함수가 실행되는 시점을 설명해 주세요.
        
        useEffect
        
        side effect를 처리하기 위해 사용되는 Hook
        
        컴포넌트가 렌더링된 후에 실된다
        
        ```cpp
        useEffect(() => {
          // side effect
        }, [dependencies]); // 변수가 변경될 때 실행됨
        ```
        
    - effect 함수가 mount, unmount가 각각 한 번만 실행되게 하려면 어떻게 해야 하나요?
        
        빈 배열을 전달한다
        
        ```cpp
        useEffect(() => {
          // 컴포넌트가 마운트될 때 한 번 실행
          return () => {
            // 컴포넌트가 언마운트될 때 실행
          };
        }, []); // 빈 배열
        ```
        
    - Hooks의 규칙들에 대해 설명해 주세요.
        
        최상위에서만 호출
        
        조건문이나 반복문 내에서 호출하지 않는다
        
        → React가 상태 관리 및 렌더링을 예측 가능하게 한다
        
        컴포넌트 내에서만 호출
        
        Hooks는 함수형 컴포넌트나 커스텀 Hook 내에서만 호출
        
        일관되게 호출
        
        렌더링 시마다 동일한 순서로 호출
        
- Props-Drilling
    
    부모 컴포넌트에서 자식 컴포넌트로, 그 자식에서 또 다른 자식으로 데이터를 전달하는 방식
    
    - 문제점
        
        데이터 전달이 깊어질수록 코드가 복잡해질 수 있다
        
    - 해결 방법
        
        Context API나 상태 관리 라이브러리(Redux, Zustand 등)를 사용
        
        → 데이터를 전역적으로 관리, 필요한 컴포넌트에만 전달
        
- Context-Api
    
    컴포넌트 트리에서 직접적으로 props를 전달하지 않고, 전역적으로 데이터를 공유할 수 있게 해준다
    
- Redux
    - 상태관리는 왜 필요한가요?
        
        애플리케이션의 여러 컴포넌트에서 데이터를 일관되게 관리하고, 변경 사항을 추적할 수 있도록 도와주기 때문
        
    - 상태 관리 툴은 어떤 문제를 해결해 주나요?
        
        복잡한 애플리케이션에서 상태 변경을 예측 가능하고 관리하기 쉽게 만들어 준다
        
        → 상태가 한 곳에서 관리
        
        → 디버깅이나 확장성에 유리
        
    - Redux의 기본 개념 세 가지에 대해 설명해 주세요.
        
        Store
        
        애플리케이션의 상태를 보관하는 객체
        
        Action
        
        상태를 변경하기 위한 이벤트
        
        `{ type, payload }` 구조
        
        Reducer
        
        Action을 받아 새로운 상태를 반환하는 함수
        
        상태를 어떻게 변형할지 정의
        
    - Store, Action, Reducer의 의미와 특징에 대해 설명해 주세요.
        
        Store
        
        애플리케이션의 모든 상태를 중앙에서 관리
        
        Action
        
        type: 상태를 어떻게 변경할지 설명
        
        payload: 추가 데이터를 담을 수 있다
        
        Reducer
        
        Action을 기반으로 이전 상태를 받아 새로운 상태를 반환하는 함수
        
        항상 불변성을 유지해야 한다
        
    - Redux의 장점을 설명해 주세요.
        
        예측 가능한 상태 관리
        
        모든 상태 변경은 Action을 통해 발생
        
        → 상태 변화 추적, 디버깅 가능
        
        중앙 집중식 상태 관리
        
        모든 상태가 하나의 Store에 모여 있음
        
        → 상태를 쉽게 관리할 수 있다
        
- Redux Toolkit
    
    <aside>
    💡 전역 상태 관리를 바로 이해하는 것은 쉽지 않으나, 차근차근, 공식문서와 블로그 등을 참고해서 꼼꼼하게 정리해 보세요! (매튜/김용민)
    
    </aside>
    
    [Getting Started | Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
    
    - redux-toolkit과 redux의 차이
        
        redux-toolkit
        
        redux의 공식 도구 모음
        
        설정을 간소화하고 코드 양을 줄여준다
        
        redux
        
        상태 관리 라이브러리
        
        복잡한 설정이 필요하고 코드 양이 다
        
    - redux-toolkit 사용법 (자세하게)
        - Provider
            
            Redux Store를 React 애플리케이션에 제공하는 컴포넌트
            
        - configureStore
            
            Store를 생성하는 함수
            
            미들웨어 설정 등을 자동으로 처리
            
        - createSlice
            
            상태 관리
            
            Action과 Reducer를 쉽게 정의할 수 있게 해주는 함수
            
        - useSelector
            
            Store에서 상태를 읽어오는 Hoook
            
        - useDispatch
            
            Action을 dispatch하는 Hook
            
        - 기타 사용 방법을 상세하게 정리해 보세요
- Zustand
    
    redux보다 간단하고 유연한 상태 관리 라이브러리
    
    간단한 API로 상태를 생성하고, 관리할 수 있으며, React의 리렌더링 성능을 최적화할 수 있다