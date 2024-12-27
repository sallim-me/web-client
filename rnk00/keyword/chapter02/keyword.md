- React의 동작 원리
    
    ### React의 동작 원리
    
    React는 User Interface Library이다. 리액트의 핵심적인 특징은 아래와 같다.
    
    - SPA (Single Page Application)
        
        하나의 HTML 페이지에서 자바스크립트를 통해 동적으로 콘텐츠를 업데이트하는 방식
        
        페이지 전환 시 전체 페이지를 다시 로드하지 않고 필요한 부분만 업데이트 → 서버로의 불필요한 요청 감소로 효율적 자원 사용
        
        - ex
            
            사용자가 쇼핑몰에서 상품 목록 페이지에서 상품 상세 페이지로 이동할 때 
            
            일반적인 웹사이트: 새로운 HTML을 서버에서 받아온다
            
            SPA: 페이지 전환 시 서버에서 필요한 데이터만 JSON으로 받아와 기존 페이지의 일부분만 교체
            
    - User Interface Library
        
        컴포넌트 단위로 UI를 구성하고 재사용성을 극대화
        
        사용자 인터페이스 구성 요소를 쉽게 개발할 수 있도록 돕는 도구 모음   ex) React
        
        tailwind, material ui
        
        - UI
            
            사용자 인터페이스
            
            사용자가 소프트웨어나 디바이스와 상호작용하는 시작적 요소를 포함한 모든 인터페이스
            
            사용자가 시스테모가 어떻게 상호작용할 수 있는지를 정의하는 디자인과 기능의 집합
            
        - ex
            
            React 라이브러리를 사용해 버튼 컴포넌트를 만들면 이 버튼은 다양한 곳에서 재사용이 가능하고 다른 UI 요소들과 함께 결합해 더 복잡한 인터페이스를 쉽게 만들 수 있다
            
    - Functional Component (함수형 컴포넌트)
        
        단순한 자바스크립트 함수
        
        입력값인 props를 받아 JSX 형태의 UI를 반환한다
        
        JSX: html을 javascript에서 사용할 수 있는 방법
        
        클래스형 컴포넌트보다 간단하고 가볍다
        
        React Hook를 사용하여 상태와 라이프사이클을 처리할 수 있다
        
        - 상태
            
            컴포넌트의 동적인 데이터 관리
            
            상태가 변경될 때마다 React는 자동으로 해당 컴포넌트를 다시 렌더링하여 UI를 업데이트 → 사용자와의 상호작용을 반영하고 애플리케이션의 최신 상태를 표시
            
        - 라이프사이클
            
            컴포넌트가 생성(mount), 업데이트, 제거(unmount)되는 과정
            
            → 특정 타이밍에 맞춰 작업을 수행할 수 있다
            
        - ex
            
            ```jsx
            function Button(props) {
              return <button>{props.label}</button>;
            }
            //Button이라는 버튼 UI를 생성하고 label값을 받아 화면에 출력
            ```
            
            ```jsx
            import React, { useState } from 'react';
            
            function Counter() {
                const [count, setCount] = useState(0); // 상태 초기화
            
                return (
                    <div>
                        <p>현재 카운트: {count}</p>
                        <button onClick={() => setCount(count + 1)}>증가</button>
                    </div>
                );
            }
            // useState로 상태 관리
            ```
            
    - Virtual DOM (가상 DOM)
        
        DOM을 직접 조작하는 대신 가상의 DOM을 메모리에 유지하고 변경 사항만 실제 DOM에 최소한으로 적용 → 성능을 최적화하고 불필요한 DOM 업데이트를 방지
        
        변경사항을 확인하는 것이 diffing
        
        - ex
            
            사용자가 버튼을 클릭하여 하나의 항목을 삭제하는 상황
            
            전통적인 DOM 조작: 모든 항목을 다시 그린다
            
            React: Virtual DOM에서 변경된 항목만 파악하여 그 부분만 실제 DOM에 반영
            
    - 동시성 렌더링
        
        브라우저가 비동기적으로 여러 작업을 동시에 수행할 수 있도록 지원하는 기능
        
        - 비동기적
            
            작업을 수행할 때 하나의 작업이 완료될 때까지 기다리지 않고 다른 작업을 동시에 진행할 수 있는 방식
            
            한 작업이 끝나길 기다리는 동안 다른 작업을 실행할 수 있는 방식
            
        
        React는 이 개념을 도입해, 사용자가 느끼지 못할 정도로 부드럽고 빠르게 UI를 업데이트
        
        주요 작업을 먼저 처리하고, 덜 중요한 작업은 나중에 처리하는 방식으로 동시성 렌더링을 최적화
        
        - ex
            
            사용자가 데이터를 입력하는 동안 대용량 이미지를 로드해야 하는 상황
            
            React는 입력 이벤트를 우선적으로 처리하고, 나중에 이미지를 로드한다
            

### JSX 문법에 대해 배워보자! 🍠

- JSX 사용시 유의 사항 (기초)
    
    ### 1. React에서 JSX를 반환할 때 꼭 하나의 태그만 반환해야한다.
    
    **`⭕️ 가능한 경우`**
    
    ```jsx
    function App() {
      return (
         <strong>상명대학교</strong>
      )
    }
    
    export default App
    ```
    
    **`❌ 불가능한 경우`**
    
    ```jsx
    import './App.css'
    
    function App() {
      return (
         <strong>상명대학교</strong>
         <p>매튜/김용민</p>
      )
    }
    
    export default App
    
    ```
    
    <aside>
    💡
    
    여러개를 반환하고 싶은 경우는 어떻게 해야 할까요?
    코드와, 이유를 간략하게 작성해주세요.
    
    </aside>
    
    - 답변 🍠
        
        ```jsx
        import './App.css'
        
        function App() {
          return (
        		<>
        	     <strong>상명대학교</strong>
        	     <p>매튜/김용민</p>
        	  </>
          )
        }
        
        export default App
        ```
        
        <aside>
        💡
        
        이유: JSX는 JavaScript의 확장 버전이고 JavaScript는 여러 개의 값을 반환할 수 없기 때문이다.
        
        virtual DOM에서 비교할 때 하나씩 비교해야 하기 때문
        
        <>,</>로 감싸도 된다.
        
        </aside>
        
    - 해설
        
        ```jsx
        function App() {
          return (
             <>
              <strong>상명대학교</strong>
              <p>매튜/김용민</p>
             </>
          )
        }
        
        export default App
        ```
        
        많은 분들이 `<> 빈 태그(Fragment)`를 활용할 수 있다는 부분을 모르실 것 같습니다. 스타일링을 하거나, 부모태그가 필요한 경우가 아닌, 다수의 태그를 반환하고 싶은 경우는 `<> 빈 태그를 활용`해도 좋습니다.
        
    
    또한 React에서는 HTML에서 사용하신 다양한 태그를 사용할 수 있습니다~!!
    
    ### 2. React에서 스타일링 방법
    
    1. className을 활용한 스타일링
    
    ```jsx
    //App.jsx
    import './App.css'
    
    function App() {
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p>매튜/김용민</p>
         </>
      )
    }
    
    export default App
    ```
    
    ```jsx
    //App.css
    .school {
      background-color: blue;
      color: white;
      font-size: 10rem;
    }
    ```
    
    ![스크린샷 2024-09-09 오후 4.58.48.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/2d957261-4c70-4d89-bf9c-549fbfc1aca7/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_4.58.48.png)
    
    1. Inline-Styling을 활용한 스타일링
    
    ```jsx
    import './App.css'
    
    function App() {
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
         </>
      )
    }
    
    export default App
    ```
    
    위와 같이, **`style`** 이후 중괄호를 두번 연 후, 카멜 표기법을 사용하여, css 코드를 작성할 수 있습니다.
    
    중괄호를 두개 쓰는 이유는, 아래와 같습니다.
    
    1. 바깥쪽 중괄호는 자바스크립트 문법임을 나타낸다.
    2. 안쪽 중괄호는 자바스크립트의 객체임을 나타낸다.
    
    **`HTML 방식과 유사하지만 살짝 다르므로, 주의해주세요!!`**
    
    ```jsx
    // HTML 방식 (케밥 표기법)
    <div style="background-color: purple">
    	고구마
    </div>
    
    // JSX 방식 (카멜 표기법)
    <div style={{backgroundColor: 'purple'}}>
    	고구마
    </div>
    ```
    
    ### 3. local variable (로컬 변수) 선언
    
    ```jsx
    import './App.css'
    
    function App() {
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
         </>
      )
    }
    
    export default App
    ```
    
    여기서, 이제 매튜라는 이름을, `nickname` 이라는 변수를 할당 받아서, 사용해보고자 합니다.
    
    ```jsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>매튜/김용민</p>
         </>
      )
    }
    
    export default App
    ```
    
    매튜/김용민 → 이 부분을 **`nickname/김용민`** 이렇게 쓴다면 당연히, 문자열로 인식 할 것 입니다.
    
    `nickname`이라는 변수에 접근해서, `nickname`의 변수가 갖고 있는 매튜라는 닉네임에 접근하고 싶기에 이러한 경우에는 **`중괄호{}`** 를 사용하면 됩니다.
    
    ```jsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>
    	      {nickname}/김용민
    	     </p>
         </>
      )
    }
    
    export default App
    
    ```
    
    제대로 동작함을 확인할 수 있고, `nickname` 안의 값도 자유롭게 변경하면, 그에 맞춰서 `nickname`이 변경됨을 확인할 수 있습니다.
    
- JSX 사용시 유의 사항 (심화)
    
    ### 1. 문자열과 함께 변수 사용하기
    
    `중괄호{}`와 ```를 활용`하여, 문자열과 함께 변수를 사용할 수 있습니다.
    
    자주 사용하는 패턴이니 꼭 익숙해지시길 바랍니다!
    
    ```jsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
         </>
      )
    }
    
    export default App
    
    ```
    
    ![스크린샷 2024-09-09 오후 5.16.19.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/da56da7b-3210-4644-b4fd-4872afd15bad/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.16.19.png)
    
    ### 2. 배열의 요소를 나타내는 방법.
    
    - map
        
        자바스크립트에서 배열의 각 요소를 순회하면서 특정 작업을 할 때 사용
        
        배열의 각 요소에 대해 특정 작업을 수행하고, 그 결과로 새로운 배열을 반환하는 함수
        
    
    ```jsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
          <ul>
            {array.map((yaho, idx) => {
              return <li key={idx}>{yaho}</li>
            })}
          </ul>
         </>
      )
    }
    
    export default App
    
    ```
    
    map은 yaho를 인자로 받아서, 값을 반환합니다. **`중괄호를 사용한 경우에는 꼭 return을 적어주어야`** 반환하는 값이 제대로 보입니다. 많은 분들이, 이 부분에서 어려움을 많이 겪기에, 혹시라도 본인이 작업한 내용이 잘 보이지 않는다면 중괄호인지, 소괄호인지를 먼저 찾아보세요!
    
    ```jsx
          <ul>
            {array.map((yaho, idx) => {
              return <li key={idx}>{yaho}</li>
            })}
          </ul>
    ```
    
    소괄호를 활용한 경우에는 return을 생략할 수 있습니다.
    
    ```jsx
          <ul>
            {array.map((yaho, idx) => (
               <li key={idx}>{yaho}</li>
            ))}
          </ul>
    ```
    
    map을 활용하는 경우에는, `key`라는 `props를 설정`해야 함
    
    key값은 각 원소들마다 가지고 있는 **`고유값`**으로 설정
    
    현재는 map 함수에서 제공해주는 index를 활용해주었지만 실제로 인덱스를 활용한 경우, 값이 삭제되는 기타 동작의 경우 문제가 발생하기 떄문에 보통 서버에서 제공해주는 고유한 id 값을 사용
    
    `yaho`와, `idx`와 같은 경우는 정해진 이름은 없습니다. 본인이 원하는 이름을 사용해서 반환해주어도 좋습니다.
    
    ```jsx
    // 보통은 복수와 단수를 잘 활용하는게 좋습니다.
    const numbers = [1, 2, 3, 4, 5];
    
    // 단수를 인자로.
    numbers.map((number, index) => return { // 작업들 } ));
    ```
    
    ![스크린샷 2024-09-09 오후 5.27.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/7a3741ba-5f49-4af9-95a1-0c773825accf/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.27.56.png)
    
- 첫 컴포넌트 만들어보기
    
    ### 첫 컴포넌트 만들어보기
    
    React에서는 컴포넌트를 통해 UI를 재사용 가능한 개별적인 여러 조각으로 나누고, 각 조각을 개별적으로 관리할 수 있습니다.
    
    위에서 순서대로 진행했더라면, 현재 우리의 코드는 아래와 같습니다.
    
    ```jsx
    import './App.css'
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
          <ul>
            {array.map((yaho, idx) => (
               <li key={idx}>{yaho}</li>
            ))}
          </ul>
         </>
      )
    }
    
    export default App
    ```
    
    실제로, yaho를 반환하는 부분을 **`List 컴포넌트`**로 만들어 보겠습니다.
    
    ```jsx
    <li key={idx}>{yaho}</li>
    ```
    
    **`src 폴더 내부`**에 **`components`** 폴더를 하나 만들어주겠습니다. 그 후 **`List.jsx 파일`**을 만들어보겠습니다.
    
    ![스크린샷 2024-09-09 오후 5.35.51.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/d9a6330d-3f0b-43c1-b1b1-d39ad37f85c6/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.35.51.png)
    
    우리가 궁극적으로 만들고 싶은 내용은 아래와 같습니다.
    
    ![스크린샷 2024-09-09 오후 5.37.05.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/e20d1131-591b-4581-802f-03a75ebb4fa2/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.37.05.png)
    
    기존에 작업하던, App.jsx로 가서
    
    ```jsx
    import './App.css'
    // List Component를 Import 
    import List from './components/List';
    
    function App() {
      const nickname = '매튜'
      const sweetPotato = '고구마'
      const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
      return (
         <>
          <strong className='school'>상명대학교</strong>
          <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김용민</p>
          <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
          <ul>
            {array.map((yaho, idx) => (
              // <li key={idx}>{yaho}입니다.</li> 대신
              <List /> // 를 쓴다
            ))}
          </ul>
         </>
      )
    }
    
    export default App
    ```
    
    각각의 **`컴포넌트는 props`**를 활용하여 데이터를 전달 받을 수 있습니다.
    
    저희는, 일단 map 방식은 키를 전달해주어야 하기 때문에 List 컴포넌트에 key를 전달해 줄 것 입니다.
    
    ```jsx
    <List key={idx} />
    ```
    
    추가적으로, 각 List에 화면에 보여줄 데이터를 전달해주기 위해 특정 이름으로 데이터를 전달해 줄 것입니다.
    
    기술 스택을 전달해주므로, **`문맥상 맞게 tech라는 props의 이름`**으로 전달해주겠습니다.
    
    ```jsx
    <List key={idx} tech={yaho} />
    ```
    
    이렇게 하고 화면을 실행시켜 봅시다.
    
    ![스크린샷 2024-09-09 오후 5.41.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/7bd5e857-40f6-401f-b9fa-178e46ce149e/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.41.47.png)
    
    당연히 현재 List 컴포넌트는 아래와 같기에 아무것도 반환되지 않습니다.
    
    ```jsx
    const List = () => {
      return (
        <>
          
        </>
      )
    }
    
    export default List
    
    ```
    
    전달받은 props를 활용해보고자 합니다.
    
    ```jsx
    const List = (props) => {
       console.log(props)
      return (
        <>
          
        </>
      )
    }
    
    export default List
    
    ```
    
    앞으로 프론트엔드 개발을 진행하시면서, **`console.log()`**를 통하여, 자주 본인이 하는 것들을 확인하는 습관이 매우 중요합니다. props의 내용이 무엇이 들었는지 **`Chrome → F12`** 개발자도구를 통해 만든 웹사이트에서 확인해보겠습니다.
    
    ![스크린샷 2024-09-09 오후 5.43.17.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/99ecfc9e-0a76-462f-8174-a3fd8a0a6a41/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.43.17.png)
    
    우리가 아까 **`<List key={idx} tech={yaho} />`** 이런 식으로 값을 전달해주었기에 props를 호출 했을 때 tech라는 이름에 요소 하나하나의 값이 들어가 있음을 확인할 수 있습니다.
    
    여기서 주의하셔야 합니다.
    
    실제로 우리가 props를 호출 했을 때 { tech: ‘REACT’ } 라는 결과값이 나왔습니다.
    
    그럼 우리가 해당 값을 활용할 떄는 {tech}를 활용하는 것이 아닌, **`{props.tech}`**를 통해 값에 접근해야 합니다. **`(해당 내용이 이해가 안가면, 자바스크립트 워크북 객체에 대해 공부하셔야 합니다.)`**
    
    ```jsx
    // props를 호출했을 때 
    const List = (props) => {
       console.log(props)
      return (
        <li>
          {props.tech}
        </li>
      )
    }
    
    export default List
    
    ```
    
    ![스크린샷 2024-09-09 오후 5.46.22.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/765780fd-dd7d-483a-a8c4-cba2f856fae9/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.46.22.png)
    
    @@@@@@@여기서 현재는 [props.tech](http://props.tech) 하나밖에 없기에 불편함을 크게 못느끼기겠지만, 전달받은 props가 tech 이외에, name, food 등 여러가지라면 매번 props.tech, props.name, [props.food](http://props.food) 이런식으로 값을 활용하는 것은 매우 귀찮을 것 입니다.
    
    우리는 이것을 해결하기 위해 **`JS 구조분해 할당에 대해 이전에 학습`**했습니다. 어떤 식으로 활용하면 좋을지 본인이 직접 해보고 아래에 **`List.jsx`** 파일을 넣어주세요.
    
    - 구조분해 할당 활용 **`List.jsx`**
        
        객체나 배열의 값을 쉽게 추출할 수 있게 해준다. 
        
        React 컴포넌트에서도 props를 간편하게 사용할 수 있다
        
        - ex
            
            items라는 배열을 props로 받아서 목록을 출력하는 List 컴포넌트
            
            구조 분해 할당을 사용하여 props에서 필요한 값을 쉽게 추출
            
        
        ```jsx
        import React from 'react';
        
        function List({ items }) { // 구조 분해 할당을 통해 items 추출
          return (
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li> // 각 항목을 리스트로 출력
              ))}
            </ul>
          );
        }
        
        export default List;
        ```
        
        `List` 컴포넌트를 사용할 `App` 컴포넌트
        
        `items` 배열을 정의하고 `List` 컴포넌트에 props로 전달
        
        ```jsx
        import React from 'react';
        import List from './List';
        
        function App() {
          return (
            <div>
              <h1>과일 목록</h1>
              <List items={items} /> {/* List 컴포넌트에 items 전달 */}
            </div>
          );
        }
        
        export default App;
        ```
        
        - ex
            
            todos에 id, task가 있는 경우
            
            ```jsx
            todos.map((todo, _) =>{
            	<h4 key={todo,id}>
            		{todo.id}. {todo.task}
            	</h4>
            }
            ```
            
            대신
            
            ```jsx
            {todos.map(({id, task}, _) =>{
            	<h4 key={todo,id}>
            		{id}. {task}
            	</h4>
            }
            ```
            
            라고 해도 같은 기능을 한다
            
        - **구조 분해 할당**: `List` 컴포넌트의 매개변수에서 `{ items }`를 사용하여 `props` 객체에서 `items` 배열을 간편하게 추출했습니다.
        - **map() 메서드**: `items` 배열을 순회하면서 각 항목을 `<li>` 요소로 변환하여 목록을 생성했습니다.
        - **key 속성**: 각 `<li>` 요소에 `key` 속성을 부여하여 React가 각 항목을 고유하게 식별할 수 있도록 했습니다. 이를 통해 리렌더링 시 성능을 최적화할 수 있습니다.
        
        이와 같은 방식으로 구조 분해 할당을 활용하면 코드의 가독성이 높아지고, props를 더 편리하게 사용할 수 있습니다.
        
    - 해설
        
        첫번째 방식
        
        ```jsx
        // 직접 props를 받는 부분에서 구조 분해 할당을 진행하는 방법.
        const List = ({tech, food, yaho}) => {
          return (
            <li>
              {tech}
            </li>
          )
        }
        
        export default List
        
        ```
        
        두번쨰 방식
        
        ```jsx
        // props를 전달 받고, 그 이후에 구조 분해 할당을 하는 방법.
        const List = (props) => {
          const { tech, food, yaho } = props;
          return (
            <li>
              {tech}
            </li>
          )
        }
        
        export default List
        
        ```
        
    
    이제 각 컴포넌트에 해당하는 스타일링을 진행하면 좋습니다. 스타일링은 크게 많이 하지 않을 것이고, 거슬리는 부분만 제거해보고자 합니다.
    
    일단은 **`<ul>`**일때 자동으로 부여해주는 **`﹒`**이 좀 거슬리므로, 해당하는 것들을 삭제해보겠습니다.
    
    ```jsx
    const List = (props) => {
      const { tech } = props;
      return (
    	  // listStyle을 통해 제거할 수 있습니다.
        <li style={{listStyle: 'none'}}>
          {tech}
        </li>
      )
    }
    
    export default List
    
    ```
    
    이런식으로, 컴포넌트를 분리하여, 스타일링이 가능하다. 구조 분해 할당을 통해 조금 더 깔끔하게 코드를 작성할 수 있다를 알아주시면 됩니다!
    

### 나의 첫 번째 react-hook 🍠

<aside>
💡

리액트 함수 컴포넌트에서 가장 중요한 개념은 훅입니다.

함수형 컴포넌트 이전에 클래스 컴포넌트에서 가능했던, state, ref와 같은 리액트의 핵심 기능들을 함수에서도 간결하게 사용 가능하게 만들었습니다.

우선, 다양한 Hook 중 **`useState`**에 대해서 배워보고자 합니다.

</aside>

- **`useState` 기초**
    
    ### useState 기초
    
    - `useState`
        
        함수형 컴포넌트 안에서 상태를 정의하고, 이 상태를 관리할 수 있게 하는 훅
        
        기본적인 사용법
        
        ```jsx
        import { useState } from 'react';
        
        const [state, setState] = useState('초기값');
        ```
        
        반환 값은 배열
        
        첫 번쨰 원소로 state를 사용할 수 있다
        
        그냥 `state`를 사용하면 `useState`의 괄호안에 정의한 초기값이 나온다
        
        두번째 `setState`를 쓰면 `state의 값을 변경`할 수 있다.
        
    
    ### useState 실습 진행
    
    글로만 보면 잘 이해가 되지 않을 것 입니다. 간단한 카운터를 만들어보며 실습을 진행해보겠습니다.
    
    App.jsx에 아래와 같이 내용을 수정해봅시다.
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      return (
         <>
          <h1>{count}</h1>
         </>
      )
    }
    
    export default App
    
    ```
    
    우리가 **`useState`**의 초기값을 0이라고 했기에, 당연히 현재 웹을 실행시켜보면, 0이 화면에 출력됩니다.
    
    그럼 해당 숫자를 어떠한 방식으로 증가 시킬까요?
    
    `react`에서는, `JS`의 `onclick`과 같은, 기능을 제공해줍니다.
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      return (
         <>
          <h1>{count}</h1>
          <button onClick={() => {}}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    
    ```
    
    **`onClick`**을 활용하여, 클릭할 때 추가적인 행동을 정의 할 수 있다. 우리가 값(상태)을 변화하고 싶을 때는 `useState` 배열의 두 번쨰 인자를 사용한다고 했다.
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      return (
         <>
          <h1>{count}</h1>
          <button onClick={() => setCount(count + 1)}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    
    ```
    
    ![스크린샷 2024-09-09 오후 6.24.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/5862b26a-8b90-4d41-86de-dc6801be00e9/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.24.59.png)
    
    이러한 식으로, `setState`를 활용하여 값을 증가 시켜줄 수 있다.
    
- **`useState`** 심화
    
    ### useState 심화
    
    일단, 이전에 기초에서 만든 코드를 살짝 수정해보겠습니다. **`handleIncreaseNumber`**라는 함수를 만들어, **`onClick`**에 인자로 전달해주고자 합니다.
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      const handleIncreaseNumber = () => {
        setCount(count + 1)
      }
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ```
    
    동일하게 동작함을 확인 할 수 있을 것 입니다!! 간단한 작업인 경우, 이전과 같이 작성해도 크게 문제 없으나, 뭔가 복잡한 작업이 많은 경우에는 이러한 식으로, 따로 함수를 만들어 관리하면 다른 사람이 **`해당 코드를 읽기에 숫자를 증가하는 기능`**이구나 하고 이해하기 쉬울 것 입니다.
    
    아래 코드의 동작을 예측해봅시다. 버튼을 누를 때 마다, 몇 씩 증가하게 될 까요?
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      const handleIncreaseNumber = () => {
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
      }
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    ㄸ
    ```
    
    **`setCount`**를 6번 호출 했기에, 6씩 증가할 것 같으나, 실제로는 1씩 증가합니다 .이는 자바스크립트의 **`클로저`**와 깊은 연관이 있습니다. 
    
    https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures
    
    ![스크린샷 2024-09-09 오후 6.35.30.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/2bb27390-3b77-4ae1-9781-7713b9189b88/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6.35.30.png)
    
    먼저 왜 그런지 설명하기에 앞서서 **`Lexical Environment`**에 대해서 설명하고자 합니다.
    
    **`Lexical Environment`**란 함수가 실행될 때, 그 함수 안에서 참조할 수 있는 **변수나 상태 값의 저장소**라고 생각하면 됩니다. 이 환경은 함수가 호출될 때마다 새로운 환경이 생성되는 것이 아니라, 함수가 선언될 당시의 변수를 기억하고 있습니다. (즉, count = 0)
    
    React는 상태를 즉시 업데이트하지 않고, 함수를 실행할 당시의 상태를 기억해 두는 **`렉시컬 환경(Lexical Environment)`**이라는 것을 사용합니다. 그래서, `handleIncreaseNumber` 함수가 실행될 때마다 함수가 실행된 시점의 상태(여기서는 `count = 0`)를 기준으로 값을 계산하게 됩니다.
    
    쉽게 말해, **`handleIncreaseNumber` 함수 안에서 `count`는 0으로 고정된 것처럼 작동**하는 거죠.
    
    ```jsx
    setCount(count + 1); -> 0 + 1
    setCount(count + 1); -> 0 + 1
    setCount(count + 1); -> 0 + 1
    setCount(count + 1); -> 0 + 1
    setCount(count + 1); -> 0 + 1
    setCount(count + 1); -> 0 + 1
    
    // 최종 결과: 1
    ```
    
    우리가 원하는 것은 버튼 클릭 하나에 6씩 증가하는 동작을 원합니다. 
    
    `setState`의 업데이트를 하는 두번째 방식을 활용하면, 지금 문제점을 해결할 수 있습니다!
    
    ```jsx
    // setState는 두가지 방식으로 활용할 수 있다.
    
    // 1. 한번에 값을 업데이트 (batch 방식)
    setCount(count + 1);
    
    // 2. 이전 상태 값을 인자로 전달하여 업데이트 (prev라는 이름은 자유롭게 변경 가능);
    setCount(prev => prev + 1);
    ```
    
    아래와 같이 활용하면 됩니다.
    
    ```jsx
    import './App.css'
    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0)
      const handleIncreaseNumber = () => {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
      }
      return (
         <>
          <h1>{count}</h1>
          <button onClick={handleIncreaseNumber}>숫자 증가</button>
         </>
      )
    }
    
    export default App
    
    ```
    
    정상적으로 6씩 증가함을 확인하시면 됩니다.
    
- **`useState`** 객체 상태 업데이트
    
    ### useState로 객체 상태 변화하기
    
    **`useState`**는 위에서 실습해본 숫자가 아닌, 객체 또한 변화 시킬 수 있습니다.
    
    이 때 사용되는 개념이 얕은 복사, 깊은 복사 개념과 이전에 자바스크립트 워크북에서 배운 전개 연산자를 활용하면 매우 유용하게 값을 업데이트 할 수 있습니다.
    
    객체는 숫자와 다르게 **참조 타입**이기 때문에, 객체 상태를 업데이트할 때 **얕은 복사**와 **깊은 복사** 개념을 잘 이해하는 것이 중요합니다.
    
    ### 1. 얕은 복사
    
    얕은 복사는 **한 단계만 복사**하는 방식입니다. 
    
    복사된 객체는 원래 객체와 같은 참조를 가지기 때문에, **내부에 중첩된 객체가 변경되면 원본 객체에도 영향을 미칠 수 있습니다.**
    
    ```jsx
    const [person, setPerson] = useState({
      name: "김용민",
      age: 26,
      nickname: "매튜"
    });
    
    const newPerson = {...person}; // 얕은 복사
    newPerson.nickname = "야호";
    
    console.log(person.nickname); // 여전히 "매튜" 임을 확인할 수 있다.
    ```
    
    ### 2. 깊은 복사
    
    깊은 복사는 객체 내부의 중첩된 모든 값까지 **완전히 새로운 복사본**을 만드는 방식입니다. 이 경우, 복사본을 수정해도 **원본 객체에는 전혀 영향이 없습니다.**
    
    깊은 복사는 **재귀적으로** 객체의 모든 속성을 복사해야 하므로, 직접 구현하거나 `lodash`와 같은 라이브러리의 `cloneDeep`을 활용하거나, **`JSON 방식을 이용`**해서 **`깊은 복사`**를 진행합니다.
    
    ```jsx
    const newPersonDeep = JSON.parse(JSON.stringify(person)); // 깊은 복사
    ```
    
    객체가 단순한 경우 이 방법을 사용할 수 있지만, 함수나 `undefined` 값이 있을 때는 적합하지 않습니다.
    
    ### 실습. useState를 활용하여 객체를 업데이트하기
    
    ```jsx
    import { useState } from 'react';
    
    function App() {
      // 초기 상태로 '김용민', 26, '매튜'를 가진 person 객체를 초기값으로 생성합니다.
      const [person, setPerson] = useState({
        name: "김용민",
        age: 26,
        nickname: "매튜"
      });
    
      // city 값을 새로 추가하여 업데이트하는 함수
      const updateCity = () => {
        setPerson(prevPerson => ({
          ...prevPerson,   // 이전 person 객체의 복사본 생성
          city: "서울"      // 새로 city 값을 추가하거나 업데이트
        }));
      };
    
      // age 값을 1씩 증가시키는 함수
      const increaseAge = () => {
        setPerson(prevPerson => ({
          ...prevPerson,   // 이전 person 객체의 복사본을 생성합니다.
          age: prevPerson.age + 1  // 다른 key의 value는 유지, age 값을 기존 값에서 1 증가
        }));
      };
    
      return (
        <>
          <h1>이름: {person.name}</h1>
          <h2>나이: {person.age}</h2>
          <h3>닉네임: {person.nickname}</h3>
          {person.city && <h4>도시: {person.city}</h4>}
          <button onClick={updateCity}>도시 추가</button>
          <button onClick={increaseAge}>나이 증가</button>
        </>
      );
    }
    
    export default App;
    
    ```
    
    ![스크린샷 2024-09-09 오후 7.03.11.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/510e5b89-e5c0-4da9-baa6-01ad4d4ca7ab/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-09_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_7.03.11.png)
    
    버튼을 눌렀을 때, 객체의 상태를 안전하게 업데이트 할 수 있습니다. **`전개 연산자를 활용`**하여, **`기존 상태를 복사`**하면서, 일부 속성만 업데이트 할 수 있기에 **`불변성을 유지`**하며 상태를 관리할 수 있습니다.
    

# 🔥 실습 - ToDoList 만들며 useState 익히기 🍠

<aside>
💡

이번 실습은 위에서 학습한 jsx 문법과 **`useState`**를 활용하여 TodoList를 만들어보고자 합니다.

개발 하면서 필수라고 말할 수 있는

1. 추가
2. 수정
3. 삭제

3 가지 요소를 배워보고자 합니다.

스스로 만들어 보는 것이 매우 좋으나, WEB 파트 같은 경우, 아직 HTML, CSS, JS에 익숙하지 않은 사람이 매우 많기에, 여러 번 되돌려서 볼 수 있도록 강의 형태로 제공해 드리는 점 참고 바랍니다.

처음부터 막히고, 매우 어려운 것이 당연하며, 좌절하지 마시고, 여러 번 만들어 보시면 금방 이해하실 수 있습니다!

최대한 자세하게 설명을 드리려고, 강의 영상 자체가 조금 깁니다.

너무 강의 영상에 의존하지 말고, 혼자 구글링을 하시며, 만들어 보고자 노력하시면 좋겠습니다!

**- UMC 7th 중앙 WEB 파트장 매튜/김용민 -**

</aside>

https://www.youtube.com/watch?v=8pm6o5dXtw0&t=3182s

https://www.youtube.com/watch?v=8pm6o5dXtw0&t=1032s

수정하기 부분에서 자바스크립트의 얕은 복사, 깊은 복사에 대해 많이 헷갈리시는 분이 있을 것 이라고 생각합니다. 이에 대해 한번 정리해주시면 좋을 것 같습니다!

- 얕은 복사 🍠
    
    객체 내부의 참조형 데이터가 그대로 복사 → 원본과 복사본이 같은 참조형 데이터를 공유 → 참조형 데이터의 변경이 원본과 복사본 양쪽에 영향을 미침
    
- 깊은 복사 🍠
    
    객체 내부의 모든 데이터를 새롭게 복사하여 원본과 복사본이 완전히 독립적 → 복사된 객체의 변경이 원본 객체에 영향을 주지 않는다