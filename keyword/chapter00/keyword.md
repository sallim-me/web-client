- HTML이란?
    
    ### HTML
    
    HTML 이란 무엇인가?
    
    **`Hyper Text Markup Language`**
    
    웹사이트 표시를 위해 개발된 마크업 언어
     
    즉, 문서의 내용을 태그를 사용하여 구성합니다
    
    **`Hyper Text`**의 의미는 하이퍼링크를 통해 한문서에서 다른 문서로 즉시 접근하게 해준다는 의미이다. 즉 **`<a> 태그의 역할`**과 비슷하다고 보면 된다.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <!-- meta태그를 사용하여, 다양한 속성 지정 가능 -->
      <!-- 문자열 세트 (charset): UTF-8 인코딩 : 다양한 언어 꺠짐 현상을 나타냄 -->
      <meta charset="UTF-8">
      <!-- http-equiv IE 주소바에 호환성 안보이게 content, Edge렌더링 엔진 쓰게 -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <!-- 사용자의 디바이스 크기에 맞게 콘텐츠를 표시할 수 있도록 명시 -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <!-- 123 -->
      <div>123</div>
    </body>
    </html>
    ```
    
- 시맨틱 태그란?
    - div 태그로만 페이지를 구조화 하는 것이 좋은가? 🍠
        
        아니다. 명확한 구분을 위해 header, nav, article, section, footer 등을 같이 사용하는 것이 좋다
        
    - div태그를 남용하지 않기 위해 자주 사용하는 태그.
        
        `header`, `nav`, `article`, `section`, `aside`, `footer` 와 같은 태그들을 주로 사용합니다.
        
    - 멀티미디어 요소를 나타내는 태그
        
        <aside>
        💡 이전, IE를 사용하던 시대는, Active X나 플래시를 설치하여, 영상을 보던 시대가 있었습니다. 하지만, `audio`, `video`, `canvas` 태그가 나오며, Active X 플러그인이 따로 필요 ❌
        
        </aside>
        
    - IE에서 사용되던 불필요한 태그 제거
        
        `acronym`, `applet`, `dir`, `isindex`… 등
        
    - 기타 태그 추가 정리해보기 🍠
        - html
            
            HTML문서의 루트
            
            모든 태그를 감싼다
            
        - head
            
            메타 데이터, style, script 등을 포함한다
            
        - body
            
            콘텐츠가 들어가는 영역을 감싼다
            
        - title
            
            제목을 넣는 태그
            
        - meta
            
            charset, viewport, description, og, keyword 등 HTML 문서에 대한 정보를 담는다
            
        - a
            
            링크
            
        - script
            
            스크립트 파일을 만들어 링크할 때 사용
            
        - link
            
            외부 소스럴 연결할 때 사용
            
        - img
            
            이미지
            
        - span
            
            인라인 요소를 묶는 태그
            
        - p
            
            문단을 구분
            
        - li
            
            리스트
            
        - ul, ol
            
            ul은 순서가 없고 ol은 순서가 있다
            
        - style
            
            css
            
        - br
            
            줄바꿈
            
        - h1~h6
            
            제목
            
        - input
            
            사용자의 입력을 받을 수 있다
            
        - form
            
            input을 담는다
            
        - nav
            
            네비게이션 링크
            
            주로 사이트 메뉴를 담는다
            
        - footer
            
            사이트 정보, 주소 , 이메일, 연락처 등이 들어간다
            
        - header
            
            사이트 로고, 메뉴, 배너
            
        - button
            
            버튼
            
        - strong
            
            굵은 글씨
            
        - i
            
            이텔릭체
            
- HTML 구성 요소
    
    ### HTML 구성 요소
    
    HTML 문서는 HTML 요소(elements) 들로 구성됨
    
    1. **`HTML 요소는 태그 한 쌍`**으로 이루어 짐
    
    ```tsx
    // p => paragraph (단락, 절) 시작/종료 태그로 이루어짐
    <p>야호야호야호야호야호야호!!</p>
    ```
    
    1. **`속성`**도 들어있을 수 있음. (시작태그 안에 명시)
    
    ```tsx
    <태그 속성1='값 1'>컨텐츠 보이는 요소</태그>
    ```
    
    1. **`태그 안에 태그`** 중첩 요소도 사용 가능
    
    ```tsx
    <p>Hello <strong>World!</strong></p>
    ```
    
    1. **`컨텐츠가 없는 태그`**도 사용 가능
    
    ```tsx
    <img src="image.png" alt="profile" />
    // 컨텐츠가 없는 태그도 있음.
    ```
    
- head 태그
    
    # <head>
    
    `<head>`는, 페이지를 열 떄 브라우저에 표시되는 `<body>` 요소와 다르게, `<head>`의 내용은 페이지에 표시되지 않습니다. 대신에 `<head>`의 내용이 하는 일은, 페이지에 대한 metadata를 포함하는 것 입니다.
    
    ![스크린샷 2024-07-15 오후 2.27.45.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f06cfc61-ceaa-4a7c-8750-90e1ddf15de5/70003598-c4a5-49e5-b100-aed87b971081/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-15_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.27.45.png)
    
    ### <head>에서 주로 사용하는 태그들의 간단 설명
    
    1. 이 파일의 문서는 HTML이다.
    
    ```html
    <!DOCTYPE html>
    ```
    
    1. html 태그 작성 언어 정의
    
    ```html
    <html lang='ko'>
    // 문서에서 주로 사용하는 언어
    ```
    
    [List of ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
    
    1. head 태그
    
    ```html
     // 문서의 메타데이터 + UI상으로 보여지지 않는 정보들.
     // SEO (타이틀, 설명, 저자), CSS 스타일, JS 링크
     // meta 태그를 통해 다양한 속성을 지정 가능.
    <head>
      <!-- meta태그를 사용하여, 다양한 속성 지정 가능 -->
      <!-- 문자열 세트 (charset): UTF-8 인코딩 : 다양한 언어 꺠짐 현상을 나타냄 -->
      <meta charset="UTF-8">
      <!-- http-equiv IE 주소바에 호환성 안보이게 content, Edge렌더링 엔진 쓰게 -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <!-- 사용자의 디바이스 크기에 맞게 콘텐츠를 표시할 수 있도록 명시 -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    ```
    
    ### <body>
    
    `<body>` 태그 내부에 이제 화면에서 보여질 내용들을 작성해주면 됩니다. (자세한 설명은 아래 토글에)
    
    ```html
    <body>
    	문서의 UI 구성 요소들.
    </body>
    
    ```
    
- body 태그 (Semantic Tag 활용)
    
    ### <body>
    
     **`body 태그`**에는 웹사이트의 내용이 들어가있다. (즉, 사용자들이 화면으로 볼 수 있는 내용 )
    
     우리가, **`웹 사이트`**, **`웹 어플리케이션`**을 만들고자 할 때, 해당 서비스가 어떠한 목적(ex. 영상 서비스를 제공하는 유튜브, 사용자들의 게시글, 광고 게시글을 관리하는 페이스북, 인스타그램 etc)을 갖고 있는지에 따라, 어떻게 웹 사이트를 구조화하여 나타낼 것인지 달라질 수 있습니다.
    
     웹 사이트는, 사용자의 설계 목적에 따라, 매우 달라질 수 있으므로, 정해진 골격을 활용하는 것이 아닌, 내가 어떠한 부분을 사용자에게 어필할 것인지에 따라, 구조가 달라짐으로, 사**`용자에게 의미있는 부분을 시각적으로 나타내는 것이 매우 중요`**합니다.
    
    **`Ambiguous Sections` 처럼 div 태그만 남발하는 것 보다 웹 브라우저가 HTML을 해석하기 쉽고, 웹 접근성을 고려한 `Clear Sections` 처럼, 시멘틱 태그를 잘 활용하여, `시멘틱 태그를 사용할 떄의 장점`을 충분히 활용하는 것을 추천합니다.**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f06cfc61-ceaa-4a7c-8750-90e1ddf15de5/73f82818-771e-415d-aeae-e7d21ae3cac7/Untitled.png)
    
    - **`Sementic Tag`**를 잘 활용하였을 때 장점은? 🍠
        
        페이지의 내용을 더 쉽게 구분지어 파악할 수 있다
        
    
- 태그 정리
    - `element` vs `container`
        
        ### element level
        
        element level의 태그들은 아래와 같다.
        
        ```tsx
        <h1>
        <h2>
        .
        .
        <h6>
        
        <address>
        <blockquote>
        <p> : UI를 나타내는 것
        <pre>
        <table>
        <ol>
        <ul>
        <a>
        <abbr> : 축약을 나타냄
        <audio>
        <b>
        <span>
        <cite>
        <code>
        <data>
        <i>
        <mark> : UI를 나타내는 것
        ```
        
        ### container level
        
        여러가지를 담을 수 있는 것을 container 요소라고 한다.
        
        ```tsx
        <div>
        <section>
        <article>
        <header>
        <footer>
        <aside>
        <nav>
        <main>
        ```
        
        - Element Level과 Container Level은 무엇을 의미하며, 어떤 것이 다른지 정리해주세요.
        
        <aside>
        💡 모든 html 태그를 암기할 필요도 없고, 암기하는 것은 쉽지 않습니다. 
        많이 사용하는 Tag 위주로, 기억해두고, 나중에 필요할 때 아래의 mdn과 같은 자료를 활용하면 매우 좋습니다.
        
        </aside>
        
        https://developer.mozilla.org/ko/docs/Web/HTML/Element
        
    - `block` vs `inline`
        
        ### block
        
        **`block`** 요소는 요소가 한 줄을 꽉 차지함.
        
        ![스크린샷 2024-07-17 오전 7.37.29.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f06cfc61-ceaa-4a7c-8750-90e1ddf15de5/f2672c25-642f-4adb-b8a7-b350cbf2de52/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-17_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_7.37.29.png)
        
        ```html
        <h1>
        <h2>
        <h3>
        <h4>
        <h5>
        <h6>
        
        <address>
        
        <blockquote>
        
        <p>
        
        <pre>
        
        <table>
        
        <ol>
        
        <ul>
        ```
        
        ### inline
        
        **`inline`** 요소는 본인의 크기 만큼 딱 차지한다. ( 단, 본인의 크기 만큼 남은 공간이 없을 경우, 다음 줄로 넘어간다. )
        
        ![스크린샷 2024-07-17 오전 7.37.56.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f06cfc61-ceaa-4a7c-8750-90e1ddf15de5/62d49404-42e4-433e-bb62-43c6f026d345/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-17_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_7.37.56.png)
        
        ```html
        <a>
        
        <abbr>
        
        <audio>
        
        <b>
        
        <span>
        
        <cite>
        
        <code>
        
        <data>
        
        <i>
        
        <mark>
        ```