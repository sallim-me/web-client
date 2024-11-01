# 🎯 핵심 키워드

---

<aside>
💡 주요 내용들에 대해 조사해보고, 자신만의 생각을 통해 정리해보세요!
레퍼런스를 참고하여 정의, 속성, 장단점 등을 적어주셔도 됩니다.
조사는 공식 홈페이지 **Best**, 블로그(최신 날짜) **Not Bad**

</aside>

### Styled-Components에 대한 학습 🍠

- **Styled-Components**
    
     지금까진 `style={{ ‘key’: ‘property’ }}` , `className`  과 같은 인라인 스타일링 방식 **`CSS-in-CSS`** 방식으로 스타일링했다
    
    컴포넌트를 스타일링하는 다른 방식은 **`CSS-in-JS`**로 자바스크립트 파일을 활용하여 스타일을 선언한다
    
    대표적인 방식 중 하나가 바로 **`Styled-Component`**이다.
    
    React에서 CSS 스타일을 컴포넌트 수준에서 직접 정의할 수 있도록 도와주는 라이브러리이다
    
    CSS 파일을 사용하지 않고 자바스크립트 파일 내에서 스타일을 작성한다
    
    ### 🍠 실습 : Styled Component로 버튼 꾸미기
    
    - 기본 설정
        
        라이브러리 설치
        
        ```tsx
        yarn add styled-components
        npm install styled-components
        ```
        
        yarn add를 npm intall로 바꿔주면 npm 방식으로 사용할 수 있다
        
        vite를 설치하려면 해당 폴더로 이동한 후 `npm create vite`
        
         **`src/components`** 폴더에, **`custom-button.jsx`** 파일 생성
        
        ![스크린샷 2024-09-12 오전 2.02.40.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/9070dd1c-1507-40ae-86df-b85dc884abe4/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_2.02.40.png)
        
        ```tsx
        // custom-button.jsx
        
        const CustomButton = () => {
            return (
                <button>
                    커스텀 버튼
                </button>
            );
        };
        
        export default CustomButton;
        
        ```
        
         **`App.jsx`**에 **`custom-button`** 컴포넌트 연결
        
        ```tsx
        // App.jsx
        
        import './App.css'
        import CustomButton from "./components/custom-button.jsx";
        
        function App() {
            return (
                <>
                    <CustomButton/>
                </>
            )
        }
        
        export default App
        
        ```
        
        `cd vite-project` `npm install` `npm run dev`
        
        ![스크린샷 2024-09-12 오전 2.05.15.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/6ef6df0a-25ed-4580-9b54-78615b5b4c24/0e408650-e7c5-491f-83c2-12b46d8c1908.png)
        
    
    ### Styled-Component 문법 설명
    
    ### 1. 스타일 요소 정의 이후 사용 방법
    
    **`styled.태그명`** 다음 **`백틱(``)를 활용`**해서 스타일 지정
    
    스타일 속성들은 **`CSS-Property`**와 동일
    
    ```jsx
    // button 태그를 만들고 싶을 때
    const FirstStyledSweetPotato = styled.**button**`// styled.태그명
        background-color: purple;
        border: none;
        padding: 0;
        cursor: pointer;
    ` //백틱 안에 스타일 지정
    
    // div 태그를 만들고 싶을때
    const StyledDivComponent = styled.**div**`
      // ... 생략
    ```
    
    사용 방법은 간단하다. 만든 컴포넌트 명을 import 해서 일반 태그 사용하는 것 처럼 해주시면 됩니다.
    
    ```jsx
    import styled from "styled-components";
    /*styled-components 라이브러리에서 styled 함수를 가져오는 코드
    이 라이브러리는 CSS-in-JS 방식 지원*/
    
    const CustomButton = () => {
        return (
            <FirstStyledSweetPotato>
                커스텀 고구마 버튼
            </FirstStyledSweetPotato>
        );
    };
    
    export default CustomButton;
    
    const FirstStyledSweetPotato = styled.button`
        background-color: purple;
        border: none;
        padding: 0;
        cursor: pointer;
    `
    ```
    
    ### 2. CSS 의사 클래스(가상 클래스) 선택자 적용 방법
    
    마우스를 올렸을 때 해당 태그에 효과를 주고 싶을때  :hover  속성을 자주 사용한다
    
    CSS 의사 클래스는 선택자에 추가하는 키워드로, 선택하는 요소가 특별한 상태여야 만족할 수 있습니다.
    
    ```jsx
    // css 일 경우
    button:hover {
    	// 버튼에 손을 올렸을 떄, purple 글씨 색상으로 변경되는 코드.
    	color: purple;
    }
    ```
    
    **`Styled-Component`** 방식으로 쓰려면 **`자신을 선택하는 & 문자를 사용`**
    
    ```jsx
    const StyledHoverButton = styled.button`
    	&:hover {
    		text-decoration: underline;
    	}
    `
    ```
    
    ### 3. props에 전달된 속성에 따른, 스타일링 분리
    
    리액트를 활용하면서 재사용성 좋은 컴포넌트를 구현해야 한다
    
    예를들어, 두개의 버튼은 배경 색만 다르다
    
    ![스크린샷 2024-09-12 오전 2.29.06.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/1e411e40-6f0f-4f42-b26c-51a568c72330/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_2.29.06.png)
    
    이러한 것을 구현하기 위해서 컴포넌트를 두개 만든다면 매우 비합리적
    
    보라색 고구마를 위한 → `purple-button.jsx`
    
    주황색 고구마를 위한 → `orange-button.jsx`
    
    **`props`**를 활용해서 다양한 색상을 나타낼 수 있도록 dynamic한 컴포넌트를 만들어보고자 합니다. 
    
    ```jsx
    import styled from "styled-components";
    
    const CustomButton = () => {
        return (
            <>
                <FirstStyledSweetPotato color={'purple'}>
                    고구마
                </FirstStyledSweetPotato>
            </>
        );
    };
    
    export default CustomButton;
    
    // background-color에 props.color를 통해, 전달받은 색상을 활용할 수 있습니다.
    const FirstStyledSweetPotato = styled.button`
        background-color: ${props => props.color};
        border: none;
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        color: white;
    `
    ```
    
    단, color에 전달하는 props의 value에 따라 색상을 변경할 수 있다
    
    ```jsx
    import styled from "styled-components";
    
    const CustomButton = () => {
        return (
            <>
                <FirstStyledSweetPotato color={'purple'}>
                    고구마
                </FirstStyledSweetPotato>
                <FirstStyledSweetPotato color={'red'}>
                    고구마
                </FirstStyledSweetPotato>
            </>
        );
    };
    
    export default CustomButton;
    
    const FirstStyledSweetPotato = styled.button`
        background-color: ${props => props.color};
        border: none;
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        color: white;
    `
    ```
    
    단 위의 방식의 문제점은, 반드시 `color` `props`에 색상 값을 전달해야 한다는 것 입니다.
    
    ```jsx
    <FirstStyledSweetPotat>
                    고구마
    </FirstStyledSweetPotato>
    ```
    
     당연히 **`background-color에 해당하는 색상이 없기에 제대로 동작하지 않을 것`** 입니다.
    
    이때 예외 처리를 하나 해주도록 하겠습니다.
    
    ```jsx
    import styled from "styled-components";
    
    const CustomButton = () => {
        return (
            <>
                <FirstStyledSweetPotato color={'purple'}>
                    고구마
                </FirstStyledSweetPotato>
                <FirstStyledSweetPotato>
                    고구마
                </FirstStyledSweetPotato>
            </>
        );
    };
    
    export default CustomButton;
    
    const FirstStyledSweetPotato = styled.button`
        background-color: ${props => props.color || 'purple'};
        border: none;
        border-radius: 10px;
        padding: 20px;
        cursor: pointer;
        color: white;
    `
    ```
    
    **`or 연산자 ( || )`** 를 통해서 **`color props`**가 전달되지 않은 경우에는 **`purple 색상`**을 기본적으로 활용하게 만들어줄 수 있습니다.
    
    ![스크린샷 2024-09-12 오전 2.38.54.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/acd3075b-f351-4dc1-9f11-ea80fb6f6dc3/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_2.38.54.png)
    

### React Router 🍠

아래, React Router 공식문서를 먼저 읽어보시고 공식문서에 익숙해져보세요!

https://reactrouter.com/en/main

- **`React Router`**란?
    - Routing
        
        유저가 주소창에 url을 입력하면 요청된 url에 해당하는 데이터를 보내주는 것
        
        새로운 URL 경로를 입력하면 그 URL에 해당하는 새로운 페이지를 네트워크 서버상에 요청하고 서버에서 새로운 html을 받와서 페이지 전체가 업데이트 되는 것
        
    - Client Side Rendering (CSR)
        
        react router를 사용할 때 발생하는 현상 중 하나
        
        전체 페이지를 새로고침 하지 않고 페이지 내에서 특정 부분만 동적으로 업데이트한다
        
        전체 페이지는 유지하되 부분적으로 내가 원하는 부분만 경로에 해당하는 컴포넌트를 보여줄 수 있는 방법
        
        ex) 네비게이션 바, 사이드 바는 유지되고 메인 콘텐츠만 변경
        
    - Routing vs CSR
        
        새로운 경로를 입력했을 때  routing은 서버에서 새로운 페이지를 요청하고 CSR은 앱 안에서 필요한 부분만 업데이트한다
        
    
    ### React Router
    
    SPA를 유지하면서, 멀티 페이지 형태의 장점을 그대로 사용할 수 있다.
    
    - 장점
        - **WEB History 활용 가능**: URL 경로가 변경되므로 웹 브라우저의 뒤로 가기, 앞으로 가기 기능을 사용할 수 있다
        - **정확한 경로로 이동 가능**: 사용자가 URL을 직접 입력하거나 공유했을 때, 그 URL에 해당하는 정확한 위치(화면)로 이동할 수 있다.
    
- **`React Router`** 기본 사용법 (**`createBrowserRouter`**, **`RouterProvider`**)
    
    ### React Router 실습
    
    먼저, **`React Router`**를 사용하기 위해 아래의 라이브러리를 사용해보고자 합니다.
    
    ```jsx
    yarn add react-router-dom
    npm install react-router-dom
    ```
    
    `App.jsx`에  아래와 같이 코드를 입력해줍시다.
    
    ```jsx
    import './App.css'
    
    // 1. import를 해줍니다.
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    const router = createBrowserRouter([
        {
            path: '/',
            element: <h1>홈 페이지입니다.</h1>
        },
        {
            path: '/movies',
            element: <h1>영화 페이지 입니다.</h1>
        }
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    
    ```
    
     **`createBrowerRouter`** → `path`(경로)를 통해 해당 경로에 접근하면 어떤 `element`를 보여주게 될 지 정한다
    
    `path: ‘/’` : 처음 실행했을 떄 페이지(localhost:5173)
    
    `path: ‘/movies’`: 영화 페이지(localhost:5173/movies)
    
    `createBrowserRouter` → 만든 `router`를 **`RouterProvider`**의 `router`에 전달
    
    ![스크린샷 2024-09-12 오전 3.51.07.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/72740d51-338f-4be4-9028-856d0bcfa4c3/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_3.51.07.png)
    
    ![스크린샷 2024-09-12 오전 3.51.20.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/3c49a7f2-5258-4e8e-a3db-065921f4d6a1/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_3.51.20.png)
    
- **`React Router`** 지정하지 않은 경로 접근 처리 (**`errorElement`**)
    
    ### React Router 지정하지 않은 경로 접근 처리
    
    우리가, 위의 실습에서,  `‘/’`, `‘/movies’` 두개의 경로에 대한 처리를 진행했습니다. 
    
    ```jsx
    import './App.css'
    
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    const router = createBrowserRouter([
        {
            path: '/',
            element: <h1>홈 페이지입니다.</h1>
        },
        {
            path: '/movies',
            element: <h1>영화 페이지 입니다.</h1>
        }
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    ```
    
    만약 사용자가 지정한 path가 아닌 [localhost:5173/yaho](http://localhost:5173/yaho) 와 같은 경로에 접근하면?
    
    ![스크린샷 2024-09-12 오전 3.55.20.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/a67bf72d-c177-43d1-87ad-e12869aaec86/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_3.55.20.png)
    
    개발자가 지정하지 않은 경로에 접근했기 떄문에 **`404 ERROR`** 발생
    
    **`errorElement`**를 활용해서, 더 나은 UX를 만들 수 있다
    
    루트 경로에 errorElement를 두면 루트 경로 및 그 하위 경로들에서 발생하는 모든 오류를 처리할 수 있다
    
    ```jsx
    import './App.css'
    
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    const router = createBrowserRouter([
        {
            path: '/',
            element: <h1>홈 페이지입니다.</h1>,
            // 없는 경로에 들어온 처리를 해줍니다.
            errorElement: <h1>너는 없는 경로에 들어왔다 ^ㅁ^ 야호~!</h1>
        },
        {
            path: '/movies',
            element: <h1>영화 페이지 입니다.</h1>
        }
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    
    ```
    
    ![스크린샷 2024-09-12 오전 3.58.07.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/f3ad9c92-3eed-4664-ba21-78cc28247b25/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_3.58.07.png)
    
    프론트엔드 개발은, 단순히 화면 구현에만 끝나지 않습니다.
    
    로딩 처리, 에러 처리, 데이터 관련 처리 등 UX 뿐만 아니라, 성능에 관한 처리도 많이 하게 됩니다.
    
    나중에 조금 더 학습하시게 된다면 아래와 같은 처리를 해보시면 좋을 것 같습니다.
    
    1. 유저가 이상한 경로에 접근했을 떄, 홈으로 이동시킬 수 있는 버튼을 제작. (UX)
    2. 각 페이지 별 다른 에러 처리
    3. ErrorBoundary 처리
    
- **`React Router`**의 **`Outlet`** 사용법 **`Link`** 태그를 활용한 페이지 이동.
    
    ### 1. Outlet 적용 전 세팅
    
    우리가 기존에, 컴포넌트를 만들면서, `src/components` 폴더에서 해당 파일들을 관리했습니다.
    
    이번에는, **`src/pages`** 폴더에서 페이지 관련된 파일들을 관리해보겠습니다.
    
    ![스크린샷 2024-09-12 오전 4.03.45.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/db5cd4bd-eebe-498f-9ec3-1baa85a84877/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.03.45.png)
    
    총 3개의 페이지를 만들어 보고자 합니다. 
    
    1. 홈페이지
    
    ```jsx
    // home.jsx
    const HomePage = () => {
        return (
            <h1>Home Page 야호~!</h1>
        );
    };
    
    export default HomePage;
    ```
    
    1. 영화 페이지
    
    ```jsx
    const MoviesPage = () => {
        return (
            <h1>Movies Page 야호~!</h1>
        );
    };
    
    export default MoviesPage;
    ```
    
    1. 에러 페이지
    
    ```jsx
    const NotFound = () => {
        return (
            <h1>너는 찾을 수 없는 페이지 야호~!</h1>
        );
    };
    
    export default NotFound;
    ```
    
    위에서 실습하면서 제작했던 `Router`는 `elements 요소에 직접 태그를 입력`했는데 이제는 `만든 페이지들을 import 하여 연결`해주겠습니다.
    
    ```jsx
    import './App.css'
    
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    // 1. 만든 페이지들을 import
    import HomePage from "./pages/home.jsx";
    import NotFound from "./pages/not-found.jsx";
    import Movies from "./pages/movies.jsx";
    
    // 2. 연결
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage/>, 
            //element: <h1>홈 페이지입니다.</h1>,였다
            errorElement: <NotFound/>
        },
        {
            path: '/movies',
            element: <Movies/>
        }
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    
    ```
    
    아래와 같이 제대로 동작하면 성공입니다.
    
    ![스크린샷 2024-09-12 오전 4.07.20.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/1fd21330-d448-44af-9ffe-bd62af440c9c/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.07.20.png)
    
    ![스크린샷 2024-09-12 오전 4.07.29.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/5677cd07-6828-43e4-aae2-414a9827b077/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.07.29.png)
    
    ![스크린샷 2024-09-12 오전 4.07.52.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/8d4a747e-d7c0-4bb8-a10f-9b0a75c9907b/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.07.52.png)
    
    ### 2. Outlet 적용 방법
    
    먼저, `‘/’ 경로에서만 공유하는 layout`을 만들어보고자 합니다.
    
    `‘/’ 경로`에서 공유한다는 것은 `‘/movie’`, `‘/yaho’`, 등 ‘/’ 로 시작하는 모든 루트 경로에서 해당 Outlet을 공유하는 것 입니다.
    
    `src/layout` 폴더를 만든 후, `root-layout.jsx` 파일을 만들어보겠습니다.
    
    ![스크린샷 2024-09-12 오전 4.11.18.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/721db2f0-e3f8-4d60-a681-c1275a55f184/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.11.18.png)
    
    ```jsx
    import {Outlet} from "react-router-dom";
    
    const RootLayout = () => {
        return (
            <>
                <Outlet/>
            </>
        );
    };
    
    export default RootLayout;
    
    ```
    
    [화면 기록 2024-09-12 오전 4.13.20.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/8b799fb8-4c8f-4f24-a2e0-beb851411daf/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.13.20.mov)
    
    https://www.smumc.co.kr/
    
    **`Outlet`**을 활용해서 **`Single Page Application 장점`**을 살려 navbar라는 컴포넌트를 만든후, `navbar는 유지`되며, 아래에 있는 내용들만, `각 경로에 맞게 Content 내용이 변경`되도록 만들어보겠습니다.
    
    `component` 폴더에 `navbar.jsx` 라는 컴포넌트를 만든다
    
    그 후, **`react-router-dom`** 에서 제공해주는 **`Link 태그를 활용`**하면, 원하는 경로로 페이지 이동을 할 수 있다.
    
    ```jsx
    // navbar.jsx
    import {Link} from "react-router-dom";
    
    const Navbar = () => {
        return (
            <nav>
                <Link to={'/'}>홈 페이지로 이동</Link>
                <Link to='/movies'>영화 목록 페이지로 이동</Link>
            </nav>
        );
    };
    
    export default Navbar;
    
    ```
    
    만든 **`navbar`**를 **`root-layout.jsx`**에 import를 시켜주겠습니다.
    
    ```jsx
    import {Outlet} from "react-router-dom";
    import Navbar from "../components/navbar.jsx";
    
    const RootLayout = () => {
        return (
            <>
                <Navbar/>
                <Outlet/>
            </>
        );
    };
    
    export default RootLayout;
    
    ```
    
    아직은 해당 `root-layout.jsx` 파일을 어떠한 곳에도 연결해주지 않았기에, navbar가 보이지 않고, 이전과 비교하였을 떄  다른 변화가 발생하지 않습니다. 이를 이제 router에 연결해주도록 하겠습니다.
    
    ```jsx
    import './App.css'
    
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    import HomePage from "./pages/home.jsx";
    import NotFound from "./pages/not-found.jsx";
    import Movies from "./pages/movies.jsx";
    import RootLayout from "./layout/root-layout.jsx";
    
    const router = createBrowserRouter([
        {
            path: '/',
            // element: <HomePage/>,
            element: <RootLayout/>,
            errorElement: <NotFound/>
        },
        {
            path: '/movies',
            element: <Movies/>
        }
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    
    ```
    
    [화면 기록 2024-09-12 오전 4.21.30.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/bc756279-982c-4143-8725-56b12cf27aa9/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.21.30.mov)
    
    무엇인가 이상하지 않나요? 
    
    위의 영상처럼 동작하면 여러분들은 놀랍게도 맞게 따라오신 것 입니다.
    
    하지만 실제로 우리가 원하는 동작은, navbar를 통해 경로 이동시 각 path에 맞는 element가 나오기를 기대하는데 그렇게 동작하지 않습니다.
    
    원하는 방식처럼 동작하기 위해서는 아래와 같은 처리를 진행해야합니다.
    
    이처럼 해당 `RootLayout` 안에있는 `Outlet`안에 보여주길 원한다면 경로에 해당하는 element들을 외부에 표기하는 것이 아닌 `children`이라는 속성안에 자식 경로를 만들어, 표기해주어야 한다
    
    ```jsx
    import './App.css'
    
    import {createBrowserRouter, RouterProvider} from "react-router-dom";
    
    import HomePage from "./pages/home.jsx";
    import NotFound from "./pages/not-found.jsx";
    import Movies from "./pages/movies.jsx";
    import RootLayout from "./layout/root-layout.jsx";
    
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout/>,
            errorElement: <NotFound/>,
            // 1. Navbar 밑에 path에 해당하는 element를 보여주고 싶으면 아래와 같이 children을 활용
            children: [
                {
                    // 2. index: true는 위의 path: '/' 즉, 홈 경로를 의미한다.
                    index: true,
                    element: <HomePage/>
                },
                {
                    // 3. 부모의 path가 '/'이니, /를 붙이지 않아도 /movies랑 동일하게 동작한다.
                    path: 'movies',
                    element: <Movies/>
                }
            ]
        },
    
    ])
    
    function App() {
        return <RouterProvider router={router}/>
    }
    
    export default App
    
    ```
    
    [화면 기록 2024-09-12 오전 4.26.31.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/3bbb7ea1-27fc-4bf7-940b-34239f341dc9/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.26.31.mov)
    
    위와 동일하게 동작한다면 성공입니다~!
    
    - **`React Router`**로 **`Dynamic Routing`** 구현
        
        ### Dynamic Routing (동적 라우팅)
        
        ex) 쿠팡에서 상품 상세 정보 페이지를 접근
        
        상세 상품 페이지는 진열된 상품 정보는 다르지만 전체적인 UI는 비슷하다. 이러한 페이지 같은 경우 **`Dynamic Routing`**을 활용해서 구현한다.
        
        ![스크린샷 2024-09-12 오전 4.28.25.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/36bafd7f-9240-4a48-a2ac-58f6607a207d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.28.25.png)
        
        ![스크린샷 2024-09-12 오전 4.29.26.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/0f21e46f-6277-4a8a-8e3a-0fdf637dc304/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.29.26.png)
        
        위의 페이지의 URL 앞부분만 보겠습니다.
        
        ```jsx
        coupang.com/vp/products/여기 부분 숫자만 다른...
        ```
        
        `products/` 뒤의 숫자만 다르다
        
        해당 숫자를 활용하여 페이지의 정보를 구분하는 것을 `Dynamic Routing`이라고 한다
        
        React Router를 활용하여 쉽게 구현할 수 있다
        
        ```jsx
        import './App.css'
        
        import {createBrowserRouter, RouterProvider} from "react-router-dom";
        
        import HomePage from "./pages/home.jsx";
        import NotFound from "./pages/not-found.jsx";
        import Movies from "./pages/movies.jsx";
        import RootLayout from "./layout/root-layout.jsx";
        
        const router = createBrowserRouter([
            {
                path: '/',
                element: <RootLayout/>,
                errorElement: <NotFound/>,
                children: [
                    {
                        index: true,
                        element: <HomePage/>
                    },
                    {
        		            // /:을 활용해서, 동적으로 바뀌는 부분의 이름을 정의해줍시다.
                        path: 'movies/:movieId',
                        element: <Movies/>
                    }
                ]
            },
        
        ])
        
        function App() {
            return <RouterProvider router={router}/>
        }
        
        export default App
        
        ```
        
        여기서, 가장 중요한 점은 `/:` 뒤에 설정한 이름으로, 우리가 해당하는 `params`의 값을 받아올 수 있다는 것입니다.
        
        다음 주차 워크북에서, 각기 다른 영화 페이지 정보를 불러오면서, 이를 실습할테니, 이 이름을 잘 기억해야 한다 정도만 아시면 좋습니다!
        
        이렇게 설정하면 아래와 같이 movies뒤에 어떠한 값이 붙어도 동일한 구조의 페이지가 보인다는 것을 이해하시면 됩니다.
        
        [화면 기록 2024-09-12 오전 4.34.50.mov](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/867971f0-ad72-48ae-a761-5748fa488667/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_4.34.50.mov)
        

### 나의 두 번쨰 react-hook 🍠

<aside>
💡

리액트 함수 컴포넌트에서 가장 중요한 개념은 훅입니다.

함수형 컴포넌트 이전에 클래스 컴포넌트에서 가능했던, state, ref와 같은 리액트의 핵심 기능들을 함수에서도 간결하게 사용 가능하게 만들었습니다.

우선, 다양한 Hook 중 **`useState`**에 대해서 배워보고자 합니다.

</aside>

- **`useEffect`**
    - **`Effect`**
        
        특정 상황에서 컴포넌트 내부에서 발생하는 행동
        
    
    React 컴포넌트는 주로 JSX를 사용하여 사용자에게 HTML 형식으로 정보를 보여주는 역할을 한다
    
    그 외에도 부수 효과(side effect)로  백엔드의 REST API를 호출하여 데이터를 생성(Create), 조회(Read), 수정(Update), 삭제(Delete)할 수도 있다
    
    이러한 Side Effect를 특정 조건에서만 실행하기 위해 React에서는 `useEffect`라는 훅(Hook)을 사용한다.
    
    이 훅을 통해 컴포넌트가 마운트될 때나 업데이트될 때 원하는 작업을 수행할 수 있으며, 의존성 배열(dependency array)을 통해 Side Effect가 언제 실행될지를 제어할 수 있습니다.
    
    특히, 백엔드에서 데이터를 받아와야 하는 경우, 컴포넌트가 처음 화면에 나타날 때(마운트될 때)만 데이터를 불러오는 것이 적절한 상황이 많다. 하지만 컴포넌트가 리렌더링될 때마다 불필요하게 계속 데이터를 요청하는 것은 비효율적일 수 있다.
    
    ```jsx
    import { useEffect } from 'react';
    
    useEffect(() => {
    	// 부수 효과 실행.
    }, []);
    // []는 의존성 배열
    ```
    
    첫 번째 Parameter : 부수 효과를 실행하는 함수 값 지정
    
    두 번째 Parameter: 의존성 배열에 지정한 값이 변경될 떄, 부수 효과 실행. 단, [] 빈 배열인 경우, 컴포넌트가 처음 마운트될 때, 실행 된다.
    
- **`useEffect`** 로 데이터를 호출하는 방법 알아보기 🍠
    
    ### useEffect로 데이터를 호출하는 방법 알아보기
    
    <aside>
    💡
    
    Chapter.2 에서 mockData를 활용해서, movie 컴포넌트를 제작했습니다.
    이제 아래와 같이 변경을 해보고자 합니다.
    
    1. 실제로, 데이터를 호출해서 
    
    </aside>
    
    1. 먼저 TMDB 사이트에 들어가서, 회원가입 후 로그인을 해줍니다.
        
        https://developer.themoviedb.org/reference/intro/getting-started
        
        [Getting Started (themoviedb.org)](https://developer.themoviedb.org/docs/getting-started) 개발자 모드로 로그인해야 함
        
    2. 그러면 아래 **`Authenticate`** 부분에, Token이 들어가 있다-
        - Token
            
            해당 정보를 호출하기 위해, 어떠한 사용자가 접근했는지 판단할 수 있는 것
            
        
        ![스크린샷 2024-09-12 오후 8.47.54.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/352acb64-5eda-4ce8-a91e-8a3aaa083b40/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8.47.54.png)
        
    3. MOVIE LISTS의 Popular 부분을 활용해서, 영화 데이터를 받아와보겠습니다.
        
        ![스크린샷 2024-09-12 오후 8.50.38.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/b3befdfe-41bd-4c2d-9fb2-3be42c078190/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8.50.38.png)
        
        ```jsx
        curl --request GET \
             --url 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' \
             --header 'Authorization: Bearer 토큰' \
             --header 'accept: application/json'
             
        curl -Uri 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' `
             -Method GET `
             -Headers @{
                 'Authorization' = 'Bearer 토큰'
                 'accept' = 'application/json'
             }
        
        ```
        
        curl문을 통해 데이터 요청을 어떻게 해야하는지 이해해 보겠습니다.
        
        1. url을 통해, 데이터를 달라고 요청! (Client → Server)
        2. 이때 header에 2가지를 전달해주어야 한다.’
            1. Authorization: Bearer 토큰
            2. application/json
        
        4. 위의 URL을 봅시다.
        
        - `Query Parameter`
            
            ?, & 를 사용하여 부가적인 정보를 얻는것
            
            첫번째 쿼리파라미터는 ?로 시작, 그 이후에 붙는 쿼리파라미터는 &로 시작
            
        
        ![스크린샷 2024-09-12 오후 8.51.38.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/64763c33-9731-4e07-a91b-560c45120944/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_8.51.38.png)
        
        ```jsx
        --url 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' \
        ```
        
        즉 해당 URL로 만약 데이터가 정상적으로 받아와 진다면, **`영어(en-US)로 된`**, **`1 페이지에 해당하는 데이터들`**이 전달 됨을 알 수 있을 것 입니다!
        
        ### useEffect를 활용해서 데이터 받아오기
        
        아래는, 이전에 제가 작성한 MoviesPage 컴포넌트입니다.
        
        현재 동작 방식은 아래와 같습니다. 
        
        1. 이전에 MOCK DATA를 통해 영화 데이터를 받아옴.
        2. 해당 영화 데이터를 Card라는 컴포넌트에 전달.
        
        ```jsx
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        
        const MoviesPage = () => {
        
            return (
                <S.CardList>
                    {MOVIES.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
        지금, 우리의 영화 데이터는 당연히 최신화된 정보가 아닌, mock-data, 임의의 데이터로 구성되어 있습니다. 
        
        이제는 실제 API 통신을 통해, 데이터를 받아오는 방법에 대해 알아보겠습니다.
        
        먼저, **`axios`** 라이브러리를 설치해줍니다. fetch를 사용하셔도 상관없습니다만, 저는 axios를 통해 실습을 진행해보고자 합니다.
        
        ```jsx
        yarn add axios
        ```
        
        1. **`useState`**를 통해, 영화 데이터를 받아 올 상태를 선언
        
        ```jsx
        import {useState} from "react";
        
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        
        const MoviesPage = () => {
            const [movies, setMovies] = useState([])
        
            return (
                <S.CardList>
                    {MOVIES.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
        당연히, 초기에는 아무런 데이터를 받아올 수 없으니 빈 배열이겠죠?
        
        1. axios를 import하자.
        
        ```jsx
        import {useState} from "react";
        import axios from "axios";
        
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        
        const MoviesPage = () => {
            const [movies, setMovies] = useState([])
        
            return (
                <S.CardList>
                    {MOVIES.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
        1. useEffect를 통한 데이터 호출
        
        ```jsx
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        import {useEffect, useState} from "react";
        import axios from "axios";
        
        const MoviesPage = () => {
            const [movies, setMovies] = useState([])
            
            useEffect(() => {
                const getMovies = async () => {
                    const movies = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
                        headers: {
                            Authorization: `Bearer 토큰`,
                        }
                    })
                    setMovies(movies);
                }
                getMovies()
            }, []);
            
            return (
                <S.CardList>
                    {movies.data?.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
        **`axios`**를 사용하면, **`application/json`**이 자동으로 요청 헤더에 들어가기 떄문에 따로 선언을 안해주어도 좋습니다.
        
        여기서 useEffect를 사용할 때 유의 할 점이 있습니다.
        
        <aside>
        💡
        
        async await 함수는 프로미스 객체를 반환 하므로 부수효과 함수가 될 수 없다.
        
        부수 효과 함수는 함수만 반환 할 수 있으며, 반환된 함수는 부수 효과 함수가 호출되기 직전과 컴포넌트가 사라지기 직전에 호출된다.
        
        </aside>
        
        그러므로, 우리는 `useEffect` 훅에서, `async await 함수`를 사용하기 위해서, `useEffect 함수 내부에서, 다른 async/await 함수를 만들어`, 해당하는 데이터를 호출하는 것 입니다.
        
        함수만, 만들면 의미 없기에, 만든 이후에 바로 **`getMovies()`**를 통해, 해당 함수를 호출합니다.
        
        그러면, 우리가 `setMovies`를 통해, 데이터 호출시 해당하는 데이터를 받아오기에, movies에는 이제 실제로 서버에서 받아온 영화 데이터들이 담깁니다.
        
        ![스크린샷 2024-09-12 오후 9.18.07.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/3a30216a-ee1e-48e9-9cb5-a30f81897ac5/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9.18.07.png)
        
        실제로, `console.log(movies)`를 통해, 안의 데이터를 보면 성공적으로 통신이 되었다는 200 코드와 함께 정보들을 확인할 수 있다.
        
        우리가, 실제로 사용하는 mock-data의 구조와 이제 맞춰줘야한다.
        
        ```jsx
        export const MOVIES = {
            "dates": {
                "maximum": "2023-09-17",
                "minimum": "2023-07-31"
            },
            "page": 1,
            "results": [
                {
                    "adult": false,
                    "backdrop_path": "/8pjWz2lt29KyVGoq1mXYu6Br7dE.jpg",
                    "genre_ids":
        ```
        
        우리는 `MOVIES.results`를 통해, 화면에 보여주고있었는데, 이제 실제 데이터들은 `movies.data.results`안에 들어있으므로, 그에 맞게 코드를 변경해주면 된다.
        
        ```jsx
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        import {useEffect, useState} from "react";
        import axios from "axios";
        
        const MoviesPage = () => {
            const [movies, setMovies] = useState([])
        
            useEffect(() => {
                const getMovies = async () => {
                    const movies = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
                        headers: {
                            Authorization: `Bearer 토큰`
                        }
                    })
                    setMovies(movies);
                }
                getMovies()
            }, []);
        
            return (
                <S.CardList>
                    {movies.data.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
        ![스크린샷 2024-09-12 오후 9.20.24.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/a6679e95-8605-4bf2-a660-b5ed8ab23864/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-12_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9.20.24.png)
        
        혹시라도, 위와 같은 에러가 발생한다면, 당연한 것이다.
        
        여기서 알아야 할 사실은 state는 비동기라는 것 이다. 처음 화면이 켜지기 전에 동작하는데, 당연히 이 떄의 state는 값이 정의되지 않았기 때문에 undefined 이므로, 정의되지 않은 state에 접근하기에 에러가 발생하는 것 이다.
        
        이를 해결하기 위해 **`Optional Chaining`**을 활용할 수 있다.
        
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
        
        ```jsx
        import {MOVIES} from "../../mocks/movies.js";
        import Card from "../../components/Card/card.jsx";
        
        import * as S from './movies.style.js'
        import {useEffect, useState} from "react";
        import axios from "axios";
        
        const MoviesPage = () => {
            const [movies, setMovies] = useState([])
        
            useEffect(() => {
                const getMovies = async () => {
                    const movies = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
                        headers: {
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNTNkYWIyMDkxMzI2Y2Y3NTkwNTAwYjQyODNkNjZkNyIsIm5iZiI6MTcyNjE0MTU3Ny42MDM2ODcsInN1YiI6IjY0MzVmY2Y2NjUxZmNmMDBkM2RhYzNmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cFPsPRHPidq2OnJ3U-3wHJYhnGajDFqUsM8XJ_a_0bw`
                        }
                    })
                    setMovies(movies);
                }
                getMovies()
            }, []);
        
            return (
                <S.CardList>
                // Optional Chaining 활용
                    {movies.data?.results.map((movie) => (
                        <Card key={movie.id} movie={movie}/>
                    ))}
                </S.CardList>
            )
        };
        
        export default MoviesPage;
        
        ```
        
- **`useEffect`** **심화**
    
    ### useEffect의 Clean Up Function을 사용하는 이유!
    
    `useEffect`를 활용해봤거나, 기타 다른 글을 찾아보았다면, 클린업 함수라는 것이 존재한다고 들어봤을 수 있다. 일반적으로, 이 클린업 함수는 이벤트를 등록하고, 지울 떄 사용한다고 알려져있다.
    
    ```jsx
    import {useEffect, useState} from "react";
    
    const SearchPage = () => {
        const [counter, setCounter] = useState(0);
    
        const handleClick = () => {
            setCounter(prev => prev + 1);
        }
    
    		// 최초 실행
        useEffect(() => {
            const mouseClickEffectEvent = () => {
                console.log(counter);
            }
    
            window.addEventListener('click', mouseClickEffectEvent)
    
    				// 클린업 함수
    				// 클린업 함수는 다음 렌더링이 끝난 뒤에 실행.
            return () => {
                console.log('클린업 함수 실행!', counter)
                window.removeEventListener('click', mouseClickEffectEvent)
            }
        }, [counter]);
        return (
            <>
                <h1 style={{color: 'white'}}>
                    {counter}
                </h1>
                <button onClick={handleClick}>+</button>
            </>
        );
    };
    
    export default SearchPage;
    ```
    
    `useEffect`가 포함된 위의 컴포넌트를 실행하면 아래와 같은 결과가 콘솔에 찍힙니다.
    
    ![스크린샷 2024-09-13 오후 5.04.44.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/8b7c00bc-aa45-492e-800f-6282e0b0e109/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-09-13_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5.04.44.png)
    
     실제로 `처음 mount` 되었을 때 `클린업 함수 실행! 0`  이 실행됩니다. 그 이후에 콘솔에 찍힌 로그를 확인해보면, 항상 이전 counter 값, 이전 state를 참조해서, 실행되는 것을 알 수 있습니다.
    
     즉, **`클린업 함수는, 새로운 값을 기반으로 렌더링 된 뒤에 실행`**되지만, 변경된 값을 읽는 것이 아닌, 함수가 정의됐을 **`당시에 선언됐던 이전 값을 보고 실행`**하는 것 이다.
    
    아직, 잘 이해가 안된다면, 아래 마지막 정리하는 글을 읽어보세요~!
    
    ### **`useEffect`의 기본 흐름**
    
    1. **처음 마운트**될 때, `useEffect` 내부의 콜백 함수가 실행됩니다.
    2. **리렌더링**이 발생하고 의존성 배열의 값이 변경되면, `useEffect`는 다음과 같이 동작합니다:
        - 먼저, **이전의 클린업 함수**가 실행됩니다. (이전 렌더링의 상태나 값을 기준으로 실행)
        - 그 후에, 새로운 사이드 이펙트 콜백이 실행됩니다.
    
    이런 방식은 특히 **이벤트 핸들러**나 **타이머** 등을 설정할 때 유용합니다. 클린업 함수가 없으면 이벤트 핸들러가 여러 번 중복 등록되거나 메모리 누수가 발생할 수 있기 때문입니다. 클린업 함수가 **이전 상태**를 기반으로 실행되면서, 이전에 등록된 이벤트를 정리하고 새로운 이벤트를 추가하는 방식으로 동작을 제어합니다.
    
    ### **클린업 함수와 언마운트와의 차이**
    
    클래스 컴포넌트에서 `componentWillUnmount`는 컴포넌트가 **DOM에서 사라질 때** 호출됩니다. 하지만 함수형 컴포넌트의 클린업 함수는 **리렌더링이 발생할 때마다** 호출되며, 이는 언마운트와 다른 개념입니다. 클린업 함수는 리렌더링 시마다 **이전 상태**를 정리해 주는 역할을 합니다.