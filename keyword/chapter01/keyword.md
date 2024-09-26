- 원시 타입 🍠
    
    ### 원시 타입 (Primitive Type)
    
    객체가 아닌 다른 모든 타입
    
    객체가 아니기 때문에 원시 타입은 메서드가 없다
    
    - boolean
        
        true 또는 false
        
        조건문에서 많이 사용
        
        true / false와 같은 boolean 형의 값 외에도 조건문에서 마치 true와 false 처럼 취급되는 truthy, falsy 값이 존재한다.
        
        falsy 예시: null / undefined / 공백이 없는 빈 문자열 등 
        
        ```jsx
        if (1) { // 1을 true로 사용할 수 있다. }
        if (0) { // 0을 false로 사용할 수 있다. }
        
        if (NaN) { // NaN을 false로 사용할 수 있다. }
        ```
        
        비교 결과를 저장할 때 사용한다
        
        ```jsx
        let isGreater = 2 > 1;
        alert(`2 > 1: ${isGreater});  // 2 > 1 : true
        ```
        
    - null
        
        아직 값이 없거나, 비어 있거나 알 수 없는 값
        
        의도적으로 변수에 값이 없음을 표현하고 싶을 때 사용
        
        ```jsx
        let matthew = null;
        console.log(matthew);  // null
        ```
        
        타입을 체크했을 때, ‘object’가 반환 된다
        
        ```jsx
        typeof null === 'object'; // true
        ```
        
        왜 이렇게 개발했을지 의문을 충분히 갖을 수 있습니다. 이는, 초창기 자바스크립트 개발 시 발생한 문제이고 **`typeof null을 진짜로 null로 표현하고자 하는 많은 시도`**가 있었지만, 호환성 문제가 다른 코드에 영향을 주어 받아들여지지 않았다.
        
        [Why is typeof null "object"?](https://stackoverflow.com/questions/18808226/why-is-typeof-null-object)
        
    - undefined
        
        선언한 후 값을 할당하지 않은 변수
        
        ```jsx
        let matthew;
        matthew // undefined;
        
        const matthewObject = {};
        matthewObject.key; // undefined
        ```
        
    - number 🍠
        
        자바스크립트는 bigint가 등장하기 전에는, 모든 숫자를 number라는 타입에 넣기 시작했다.
        
        ECMAScript 표준에 따르면 
        
        $$
        -(2^{53}-1)과 2^{53}-1
        $$
        
        사이의 값을 저장할 수 있다.
        
        ```jsx
        42; // 정수 리터럴
        3.14159; // 부동 소수점 리터럴
        0b1010; // 2진수 리터럴 (binary literal)
        0o755; // 8진수 리터럴 (octal literal)
        0x1A3; // 16진수 리터럴 (hexadecimal literal)
        
        // 천 단위를 읽기 쉽게 해주는 표현(가독성)
        1_000_000; // 숫자 구분 기호 (Numeric Separators)
        ```
        
        Infinity, NaN 같은  특수 숫자 값을 포함한다
        
        - JS에서 사칙연산을 하는 방법을 작성해주세요. 🍠
            - 더하기
                
                a+b
                
            - 빼기
                
                a-b
                
            - 곱하기
                
                a*b
                
            - 나누기
                
                a/b
                
            - 나머지 구하기
                
                a%b
                
            - 거듭 제곱
                
                a**b
                
            
            자바스크립트에서 수학 연산은 안전하다
            
            ```c
            1/0   //Infinity
            "숫자 아님"/2    //NaN
            ```
            
            0으로 나누거나 문자열을 숫자로 취급하는 등의 연산이 가능하다
            
        - JS에서 비교 연산을 하는 여러가지 방법을 조사하여 정리해주세요. 🍠
            - 동등 연산자(==)
                
                두 값이 같으면 true를 반환한다
                
                비교하는 것의 타입이 다르면 형변환 후 비교한다
                
                - 숫자와 문자열
                    
                    문자열을 숫자로 변환
                    
                - 숫자와 불리언
                    
                    불리언을 0 또는 1로 변환
                    
                - 객체와 원시 타입
                    
                    객체가 원시 값으로 변환된다
                    
            - 엄격 동등 연산자(===)
                
                값과 타입이 모두 같을 때 true
                
            - 부등 연산자(!=)
                
                값이 다르면 true
                
            - 엄격 부등 연산자(!==)
                
                값 또는 타입이 다르면 true
                
            - >, <, >=, <=
            
            ```jsx
            null == undefined;  //true
            null === undefined;   //false
            null == 0;   //false
            undefined == 0;   //false
            ```
            
        - JS에서 증가/감소 연산을 하는 여러가지 방법을 조사하여 정리해주세요. 🍠
            - 증가 연산(++)
                - 전위 증가 연산자
                    
                    변수 값을 1 증가시킨 후의 값을 사용한다
                    
                - 후위 증가 연산자
                    
                    현재 값을 사용한 후 값을 1 증가시킨다
                    
            - 감소 연산(--)
                - 전위 감소 연산자
                    
                    변수 값을 1 감소시킨 후의 값을 사용한다
                    
                - 후위 감소 연산자
                    
                    현재 값을 사용한 후 값을 1 감소시킨다
                    
            - +=, -=
                
                특정 값만큼 증가 또는 감소시킨다
                
        - 연산자 우선순위에 대해 작성해주세요. 🍠
            
            
            | **우선순위** | **연산자** | **설명** |
            | --- | --- | --- |
            | 1 | `::` |  |
            | 2 | `.` `[]` `()` `?.` | 객체 접근, 배열 인덱스, 함수 호출, 옵셔널 체이닝 |
            | 3 | `++` `--` | 후위 증가/감소 |
            | 4 | `++` `--` `+` `-` `~` `!` | 전위 증가/감소, 부호, 비트 NOT, 논리 NOT |
            | 5 | `**` | 거듭제곱 |
            | 6 | `*` `/` `%` | 곱셈, 나눗셈, 나머지 |
            | 7 | `+` `-` | 덧셈, 뺄셈 |
            | 8 | `<<` `>>` `>>>` | 비트 시프트 |
            | 9 | `<` `<=` `>` `>=` `instanceof` `in` | 비교, 객체 인스턴스, 속성 확인 |
            | 10 | `==` `!=` `===` `!==` | 동등, 일치 비교 |
            | 11 | `&` | 비트 AND |
            | 12 | `^` | 비트 XOR |
            | 13 | `|` | 비트 OR |
            | 14 | `&&` | 논리 AND |
            | 15 | `||` | 논리 OR |
            | 16 | `??` | Null 병합 연산자 |
            | 17 | `? :` | 삼항 연산자 |
            | 18 | `=` `+=` `-=` `*=` `/=` 등 | 할당 연산자 |
            | 19 | `,` | 쉼표 연산자 |
        
    - bigint 🍠
        
        길이에 상관없이 정수를 나타낼 수 있다
        
        정수 리터럴 끝에 n을 붙이면 BigInt형 값임을 뜻한다
        
        BigInt형과 일반 숫자를 섞어 사용할 수 없다  ex) 1n+2
        
        함께 써야 한다면 BigInt() 또는 Number()를 통해 형변환한 후에 쓴다
        
        단항연산자 +value를 사용하면 value를 쉽게 숫자형으로 바꿀 수 있는데 이는 BigInt에서는 일어나지 않는다
        
        비교 연산자는 가능하다
        
        1 == 1n은 true지만 1 === 1n은 false이다
        
        if 안에서 0n은 falsy, 나머지는 truthly이다
        
    - string 🍠
        
        “(큰 따옴표) 또는 ‘(작은 따옴표) 또는 `(백틱)으로 묶는다
        
        “와 ‘는 같은 기능을 한다
        
        ` 안에 변수나 표형식을 ${ } 안에 넣으면 원하는 변수나 표현식을 넣을 수 있다
        
        ```jsx
        let name = "willow";
        alert(`Hello, ${name}.`);  //Hello, willow.
        alert(`1 + 2 = ${1 + 2}`);
        ```
        
        참고> 자바스크립트에서는 char형은 없다
        
    - symbol
        
        ### Symbol
        
        ES6에서 새롭게 추가된 7번쨰 타입
        
        중복되지 않는 고유한 값들을 나타내기 위해 만들어 졌다
        
        심벌 생성: `Symbol()`
        
        symbol 사용 이유: 중복되지 않는 고유한 값을 나타낸다.
        
        ex) 용민, 수아가 둘 다 영어 이름이 Matthew인 상황
        
        ```jsx
        const yongmin = 'Matthew';
        const sua = 'Matthew';
        ```
        
        둘을 `일치 연산자(===)`로 비교하면 true가 나온다
        
        ```jsx
        yongmin === sua // true
        ```
        
        하지만 우리는 용민과 수아는 다른 사람이기 때문에 false가 나오기를 원한다. 이런 경우 **`Symbol을 활용`**할 수 있다.
        
        ```jsx
        const yongmin = Symbol('Matthew');
        const sua = Symbol('Matthew');
        yongmin === sua // false
        ```
        
- 객체 타입 🍠
    
    ### 객체 타입 (Object Type)
    
    위의 7개 원시 타입 제외 자바스크립트를 이루고 있는 대부분의 타입
    
    배열, 함수, 정규식, 클래스 등
    
     **`객체 타입은 참조를 전달`**하기에, **`참조 타입`**으로도 불린다
    
    ```jsx
    const hello1 = () => {}; 
    const hello2 = () => {};
    ```
    
    위의 내용을 보면 실제로, 함수의 내용이 같아 보입니다. 하지만, 서로의 참조가 다르기에 false가 반환됨을 알 수 있습니다.
    
    ```jsx
    hello1 === hello2 // false
    ```
    
    - 배열
        
        배열 만드는 방법
        
        1. **`배열 리터럴 []`** 
        
        ```jsx
        let matthew = [];
        
        // 각각 인덱스를 [] 안에 넣어, 배열 안에 값을 할당할 수 있다.
        matthew[0] = 'kim';
        matthew[1] = 'yong';
        matthew[2] = 'min';
        
        // i = 0 부터, matthew의 길이 총 3(['kim', 'yong', 'min'], i++ (하나씩 증가)
        for (let i = 0; i < matthew.length; i++) {
        	console.log(matthew[i]);
        }
        ```
        
        ![스크린샷 2024-08-19 오후 2.37.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/60b44166-84c0-44c0-9b7c-59b0ccf931ce/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-08-19_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_2.37.59.png)
        
        ```jsx
        // 배열 생성 (초기 값 할당)
        let arr = ['kim', 'yong', 'min'];
        
        // 배열의 크기를 미리 지정하기
        let arr = [,,,]; // undefined가 출력된다.
        ```
        
        1. **Array() 생성자 함수로 배열 생성**
        
        배열 생성
        
        ```jsx
        // 배열 생성
        let arr = new Array();
        
        arr[0] = 'kim';
        arr[1] = 'yong';
        arr[2] = 'min';
        
        for (let i = 0; i < arr.length; i++) {
        	console.log(arr[i]);
        }
        
        // 값을 할당한 채로 배열을 생성할 수 있다.
        let arr = new Array('kim', 'yong', 'min');
        
        // 배열의 크기를 지정하여 생성
        let arr = new Array(3);
        
        // 배열의 크기를 지정하여 생성한 후 원하는 값으로 채워넣을 수 있다.
        new Array(20).fill(0);
        
        // output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ```
        
        - 다양한 `Array method`에 대해 정리해주세요. 🍠
            - sort 🍠
                
                배열을 정렬한다
                
                배열의 모든 요소를 문자열로 변환하고 유니코드 순서에 따라 정렬한다
                
                숫자를 올바르게 정렬하기 위해서는 정렬 기준 함수를 넣어야 한다
                
                ```jsx
                let arr = [3,1,5];
                arr.sort();  //[1,3,5]
                
                let arr2 = [10, 21, 2, 11];
                arr2.sort((a,b)=>a-b);   //[2,10,11,21]
                ```
                
            - join 🍠
                
                배열의 모든 요소를 문자열로 결합하고 하나의 문자열을 반환한다
                
                구분자를 지정할 수 있다. 기본값은 쉼표
                
                ```jsx
                let arr = ['hello', 'world'];
                arr.join(' '); //hello world
                ```
                
            - reverse 🍠
                
                배열 순서를 뒤집는다
                
                ```jsx
                let arr = [1,2,3];
                arr.reverse();   //[3,2,1]
                ```
                
            - splice 🍠
                
                요소를 추가, 제거 또는 교체한다
                
                첫번째 인자로 시작 index, 두번째 인자로 삭제할 요소의 개수, 세번째부터는 item이 나온다
                
                ```jsx
                let arr = [1, 2, 3, 4];
                arr.splice(1, 2);  // [1, 4] 
                arr.splice(1, 0, 10, 20);  // [1, 10, 20, 4]
                ```
                
            - slice 🍠
                
                배열 일부분을 새 배열로 반환한다
                
                slice(startIdx, endIdx)를 하면 startIdx에서부터 endIdx-1까지를 새 배열로 반환한다
                
                ```jsx
                let arr = [1, 2, 3, 4, 5];
                let newArr = arr.slice(1, 3);  // [2, 3] 
                ```
                
            - find 🍠
                
                첫번째로 조건을 만족하는 요소를 반환한다
                
                조건을 만족하는 것이 없으면 undefined를 반환
                
                ```jsx
                let arr = [5, 12, 8, 130];
                let found = arr.find(num => num > 10);  // 12
                ```
                
            - filter 🍠
                
                조건을 만족하는 모든 요소를 새로운 배열로 반환
                
                ```jsx
                let arr = [5, 12, 8, 130];
                let filtered = arr.filter(num => num > 10);  // [12, 130]
                ```
                
            - map 🍠
                
                배열의 각 요소에 함수를 적용하여 새 배열 반환
                
                ```jsx
                let arr = [1, 2, 3];
                let doubled = arr.map(num => num * 2);  // [2, 4, 6]
                ```
                
            - reduce 🍠
                
                배열의 모든 요소를 하나의 값으로 만든다
                
            - some  🍠
                
                배열의 요소 중 하나라도 조건을 만족하면 true를 반환한다
                
                ```jsx
                let arr = [1, 2, 3];
                let hasEven = arr.some(num => num % 2 === 0);
                // 2가 짝수이므로 true
                ```
                
            - every 🍠
                
                배열의 모든 요소가 조건을 만족하면 true
                
                ```jsx
                let arr = [1, 2, 3];
                let allEven = arr.every(num => num % 2 === 0);  // false
                ```
                
            - forEach 🍠
                
                배열의 각각의 요소에 대해 주어진 함수를 실행하지만 새 배열을 반환하지는 않는다
                
                ```jsx
                let arr = [1, 2, 3];
                arr.forEach(num => console.log(num));  // 1, 2, 3 출력
                ```
                
    - 함수
        
        ### 함수 선언문
        
        ```jsx
        function subtraction(a, b) {
        	return a - b;
        }
        
        subtraction(5, 3); // 2
        ```
        
        함수 선언문은 표현식이 아닌 일반 문(statement)으로 분류
        
        ### 함수 표현식
        
        ```jsx
        let subtraction2 = function (a, b) {
            return a - b;
        }
        
        subtraction2(5, 3); // 2
        ```
        
        함수 표현식은, 함수를 변수에 할당했다.
        
        ### 화살표 함수
        
        ```jsx
        let subtraction3 = (a, b) => {
        	return a - b;
        }
        
        subtraction3(5, 3); // 2
        ```
        
        ES6에 추가된 화살표 함수도 많이 사용한다.
        
        ### 호이스팅 (Hoisting) 🍠
        
        호이스팅은 실행될 때 변수와 함수 선언이 코드의 최상단으로 올라가는 것을 의미한다
        
        함수 선언문은 작성된 위치에 상관없이 호이스팅된다
        
        함수 표현식, 화살표 함수는 호이스팅 되지 않기 때문에 선언 전에 호출할  수 없다
        
    - 클래스
        
        ### 클래스 (class)
        
        class 키워드를 이용해서 선언해주고, constructor 생성자를 이용해서, 나중에 object를 만들 떄 필요한 데이터를 전달
        
        전달 받은 데이터를 class에 존재하는 필드에, 전달된 데이터를 바로 할당해줍니다.
        
        ```jsx
        // 클래스 선언
        class Student {
        	constructor(name, school) {
        		// 필드
        		this.name = name;
        		this.school = school;
        	}
        }
        ```
        
        전달받은 클래스의 이름과, 학교명을 갖고, 자기소개를 하는 **`methods`**
        
        ```jsx
        // 클래스 선언
        class Student {
        	constructor(name, school) {
        		// 필드
        		this.name = name;
        		this.school = school;
        	}
        	
        	// 메소드
        	introduction() {
        		console.log(`안녕하세요, ${this.name}입니다. ${this.school}에 다니고있습니다`)
        	}
        }
        ```
        
        아래와 같이 만든 클래스를 이용하여, **`new 키워드`**를 통해 새로운 object를 만들 수 있습니다. name과, school을 맞는 위치에 같이 전달해주면 됩니다.
        
        ```jsx
        const matthew = new Student('matthew', '상명대학교');
        console.log(matthew.name);
        console.log(matthew.school);
        matthew.introduction();
        ```
        
        ![스크린샷 2024-08-19 오후 3.59.50.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f1912130-0409-4e90-a90f-6091ae253e73/4df14540-faeb-4238-940f-241c42af9c83/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-08-19_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_3.59.50.png)
        
        ### 아래 내용에 대해 추가적으로 학습 후 정리해보아요! 🍠
        
        <aside>
        💡 위의 예시의 코드를 활용해서, 코드를 작성해주시고, 설명 또한 작성해주세요!
        
        </aside>
        
        - getter 🍠
            
            객체 속성을 가져온다
            
            특정 로직을 수행한 뒤 가져오게 할 수도 있다
            
            ```jsx
            get getSchool(){
            	return `학교: ${this.school}`;
            }
            ```
            
        - setter 🍠
            
            객체 속성을 설정한다
            
            값이 변경될 때 로직을 실행한다
            
            ```jsx
            set setSchool(newSchool){
            	this.school = newSchool;
            }
            ```
            

### react에서 자주 사용하는 자바스크립트 문법

- 구조 분해 할당(Destructuring assignment)
    
    ### 구조 분해 할당 (배열)
    
    구조 분해 할당 구문은, 배열이나 객체의 속성을 해체하여 그 값을 개별 변수에 담게 하는 JS 표현식입니다.
    
    먼저, react에서는 컴포넌트에 state 변수를 추가할 수 있는 React Hook인 `useState`를 활용합니다.
    
    react를 아직 자세히 모르시는 분은, 이런 것을 나중에 배우는구나 라고 생각하며 이해만 하시면 됩니다. **`useState`**의 구조는 아래와 같습니다.
    
    ```jsx
    const [yongmin, setYongmin] = useState('초기값')
    ```
    
    `useState`는 2개의 배열을 반환하는 함수이며, 첫 번쨰 값을 value 두번쨰 값을 value를 변경하는 setter로 사용이 가능합니다.
    
    ```jsx
    const UMC = ['WEB', 'SPRING', 'NODE', 'iOS', 'Android', 'PLAN', 'DESIGN'];
    
    const [first, , , , , last] = UMC;
    
    first; // 'WEB'
    last; // 'DESIGN'
    ```
    
    배열의 구조 분해 할당은 **`,의 위치에 따라 값이 결정`**됩니다.
    
    위의 방식은, 길이가 긴 배열일 경우,  실수를 할 가능성이 매우 크기에, 배열의 길이가 작은 경우 많이 활용합니다. 배열의 구조 분해 할당은 기본 값을 선언할 수 있습니다.
    
    ```jsx
    const array = [1, 2];
    const [a = 'KIM', b = 'YONG', c = 'MIN'] = array;
    
    // a 1
    // b 2
    // c MIN (준비된 배열의 길이가 총 2개이지만, c는 3번째이기에, 미리 할당한 'MIN'을 출력)
    ```
    
    만약 먼저 선언한 배열의 길이보다, 사용하고자 하는 배열의 길이가 짧거나 값이 없는 경우에는 **`undefined`** 기본값을 사용합니다.
    
    특정 값 이후의 값을 다시 배열로 선언하고 싶은 경우에는 전개 연산자를 활용할 수 있습니다.
    
    ```jsx
    const UMC = ['WEB', 'SPRING', 'NODE', 'iOS', 'Android', 'PLAN', 'DESIGN'];
    const [first, ...etc] = UMC;
    
    first // 'WEB'
    etc // ['SPRING', 'NODE', 'iOS', 'Android', 'PLAN', 'DESIGN']
    ```
    
    ### 구조 분해 할당 (객체)
    
    객체의 구조 분해 할당은, 객체에서 값을 뽑아온 뒤 할당하는 것을 의미합니다. 배열과는 다르게, 객체는, 객체의 내부 이름을 통해 뽑아온다는 차이점이 있습니다.
    
    ```jsx
    const myName = {
    	kim: '김',
    	yong: '용',
    	min: '민',
    }
    
    const { kim, ...rest } = myName;
    
    // kim => '김'
    // rest => { yong: '용', min: '민' }
    ```
    
    기본 값 할당 또한 배열과 동일하게 가능합니다.
    
    ```jsx
    const myName = {
    	yong: '용',
    	min: '민',
    }
    
    const { yong = '야', min = '호', yaho = '야호' } = myName
    
    yong // '용'
    min // '민'
    yaho // '야호'
    ```
    
    리액트에서 어떠한 값들을 전달 할 떄, props를 통해 부모에서 자식 컴포넌트로 값을 전달할 떄 많이 활용되는 방식이므로 꼭 알고 있어야 하는 문법입니다.
    
    ```jsx
    // props.name, props.age 이러한 식으로 접근해야하지만
    // 구조 분해 할당을 통해서 name, age로 접근이 가능합니다.
    function ChildComponent({ name, age }) {
    	return (
    		<>
    			<h1>안녕하세요 {name}입니다.<h1/>
    			<span>{age}살 입니다.</span>
    		</>
    	)
    }
    ```
    
    위의 리액트 코드는 웹을 처음 접하시면 당연히 이해할 수 없지만, 이러한 방식으로 많이 활용된다는 점을 이해해주시면 됩니다.
    
- 전개 연산자 (Spread Operator)
    
    ### 전개 연산자 (Spread Operator)
    
    React를 활용하여 웹 프로젝트를 진행하다보면, 배열 간에 합성을 해야 할 경우가 상당히 많이 생깁니다. 전개 연산자가 나오기 이전에는 배열 간 합성을 하기 위하여 `push`, `splice`, `concat`과 같은 배열 메서드를 사용해야 했습니다. 그러나, 전개 연산자를 활용하면, 배열을 쉽게 합성할 수 있습니다.
    
    ```jsx
    const yaho = ['y', 'a']
    const realYaho = [...yaho, 'h', 'o'] // ['y', 'a', 'h', 'o']
    ```
    
    여기서, 살짝 참조에 관한 개념을 짚고 넘어가겠습니다.
    
    ```jsx
    const yongmin = ['Kim', 'Yong', 'Min'];
    const yongmin2 = yongmin;
    
    yongmin === yongmin2; // true
    ```
    
    위의 결과 값이 true가 나온 이유는 무엇일까요? 내용이 아닌 **`객체의 참조 주소를 복사하기에 true가 반환`**됩니다.
    
    하지만, 전개 연산자를 활용하게 되면, 기존 배열에 영향을 미치지 않고, 배열을 복사하는 것이 가능합니다.
    
    ```jsx
    const yongmin = ['Kim', 'Yong', 'Min'];
    const yongmin2 = [...yongmin];
    
    yongmin === yongmin2; // false
    ```
    
    실제로 값만 복사하고, 참조가 다르기에 false가 반환됩니다.
    
    ### 전개 구문 (객체)
    
    ```jsx
    const KIM_YONG_MIN = {
    	Kim: '김',
    	Yong: '용',
    	Min: '민'
    }
    
    const KIM_YONG_MIN_2 = {
    	Ma: '매',
    	tthew: '튜'
    }
    
    const EN_KO_NAME = { ...KIM_YONG_MIN, ...KIM_YONG_MIN_2 };
    // {Kim: '김', Yong: '용', Min: '민', Ma: '매', tthew: '튜'}
    ```
    
    객체를 새로 만들 때 전개 구문을 활용할 수 있고, 객체를 합성하는 데 편리함을 제공해준다.
    
    ```jsx
    const kim = {
    	k: 'K',
    	i: 'I',
    	m: 'M',
    }
    
    const object1 = {
    	...kim,
    	m: 'N'
    } // {k: 'K', i: 'I', m: 'N'}
    
    const object2 = {
    	m: 'N',
    	...kim
    } // {m: 'M', k: 'K', i: 'I'}
    ```
    
    전개 연산자 이후, 값을 할당한다면, 전개 연산자를 값 할당 이전에 활용하냐, 이후에 활용하냐에 따라, 결괏값이 완전히 달라짐을 유의하자.
    
- 객체 초기자(object shorthand assignment)
    
    ### 객체 초기자
    
    객체 초기자 또한, 상당히 많이 활용하는 방식이다.
    
    객체에 집어 넣고자 하는 키와 값을 가지고 있는 변수가 이미 존재한다면, 해당 값을 매우 간단하게 넣을 수 있는 방식이다.
    
    ```jsx
    const easy = 'easy';
    const hard = 'hard';
    
    const difficulty = {
    	easy,
    	hard,
    }
    
    // {easy: 'easy', hard: 'hard'}
    ```
    
- Array 프로토타입의 메서드
    - map
        
        ### map
        
        map은 인수로 전달받은 배열과 동일한 길이의 새로운 배열을 반환하는 메서드입니다. 배열의 아이템을 순회하면서, 콜백으로 연산한 결과의 새로운 배열을 만들 수 있습니다.
        
        ```jsx
        const numbers = [1, 2, 3, 4, 5, 6];
        
        const numbersPlusTwo = numbers.map((number) => number + 2);
        // [3, 4, 5, 6, 7, 8]
        ```
        
        React에서는 data들을, 배열에 담아, 해당 내용들을 리액트 요소로 반환할 떄 많이 사용합니다.
        
        ```jsx
        const KimYongMin = ['김', '용', '민'];
        
        const ReturnElement = KimYongMin.map((name) => {
        	return <div key={name}>{name}</div>
        });
        ```
        
    - filter
        
        ### filter
        
        `filter()` 메서드는 주어진 배열의 일부에 대한 얕은 복사본을 생성하고, 주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다.
        
        ```jsx
        // 길이가 5 이하인 단어만 출력하는 방법
        const words = ['sweetPotato', 'Potato', 'haha', 'yaho'];
        
        const answer = words.filter((word) => word.length < 6);
        // ['haha', 'yaho']
        ```
        
    - reduce
        
        ### reduce
        
        map, filter를 쉽다고 생각하셨으면 reduce와 같은 경우는 조금 어렵게 느껴지실 수 있습니다. 해당 메서드는 콜백 함수이외에 initial value (초깃값)을 추가로 인수를 받습니다.
        
        초깃값이 무엇인지에 따라 어떠한 타입의 무엇인가를 반환할 수 있는 메서드가 바로 reduce 입니다.
        
        보통, 어떠한 값을 누적해서 더할 떄 많이 사용합니다.
        
        ```jsx
        const numbers = [10, 20, 30, 40, 50];
        
        // result의 초기값은 0이라고 생각하면 쉽다.
        const sum = numbers.reduce((result, number) => {
        	return result + number;
        }, 0);
        
        sum // 150
        ```
        
        reducer 콜백 함수의 첫 번쨰 인수는 초깃값의 현재값을 의미, 두 번쨰 인수는 현재 배열의 아이템이다.
        
    - forEach
        
        ### forEach
        
        `forEach` 함수는 콜백 함수를 받아 배열을 순회하면서, 단순히 해당 콜백 함수를 실행만 하는 메서드입니다.
        
        ```jsx
        const Matthew = ['M', 'A', 'T', 'T', 'H', 'E', 'W'];
        
        Matthew.forEach((alpha) => console.log(alpha));
        
        // M, A, T, T, H, E, W
        ```
        
        forEach는 아무런 반환값이 없습니다. 단순히 콜백함수를 실행만 시키고, map 처럼 결과를 반환하는 작업은 하지 않습니다. (forEach의 반환값은 undefined로 의미가 없다.)
        
    - length
        
        ### length
        
        **`length`** 데이터 속성은 해당 배열의 요소 수를 나타냅니다. 
        
        ```jsx
        const Matthew = ['M', 'A', 'T', 'T', 'H', 'E', 'W'];
        
        Matthew.length // 7
        ```
        
- 삼항 조건 연산자 (Ternary Operator)
    
    ### 삼항 조건 연산자
    
    **조건 (삼항) 연산자**는 JavaScript에서 세 개의 피연산자를 받는 유일한 연산자입니다. 앞에서부터 조건문, 물음표(`?`), 조건문이 참(truthy)일 경우 실행할 표현식, 콜론(`:`), 조건문이 거짓([falsy](https://developer.mozilla.org/ko/docs/Glossary/Falsy))일 경우 실행할 표현식이 배치됩니다. 해당 연산자는 [`if...else`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/if...else)문의 대체재로 빈번히 사용됩니다.
    
    ```jsx
    const number = 27;
    
    const isOdd = number % 2 !== 0 ? true : false 
    // true (27은 홀수 이므로)
    ```
    
    아래와 같은 기준이라고 생각하면 이해하기 쉽다.
    
    ```jsx
    조건문 ? 조건문이 참인 경우 값 : 조건문이 거짓인 경우 값;
    ```
    

### DOM 조작 🍠

<aside>
💡

웹 개발에서 매우 중요한 개념

미션 1을 수행하는 데 필수적인 내용을 다루고 있다

React와 같은 프론트엔드 라이브러리와 밀접하게 연관

DOM 조작은 브라우저 상에서 HTML 문서의 구조를 동적으로 수정하고, 사용자와의 상호작용을 처리하는 중요한 방법론

JavaScript를 통해 DOM을 조작하는 방법을 정확히 이해하고 익히는 것이 앞으로의 학습에 큰 도움이 될 것입니다.

React에서의 상태 관리와 컴포넌트 렌더링 최적화 역시 DOM 조작의 원리를 기반으로 하고 있기 때문에, 시간을 들여 꼼꼼히 학습하시길 바랍니다.

- UMC 7th 중앙 WEB 파트장 매튜/김용민 - 

</aside>

- DOM
    
    document object model
    
    HTML이나 XML 문서의 구조화된 표현을 제공하는 프로그램이 인터페이스
    
    웹 페이지가 로드되면 브라우저는 해당 페이지의 구조를 트리 형식으로 변환한다. 이를 DOM트리라고 한다
    
- 태그 가져오기
    
    DOM에서 특정 태그나 요소를 선택
    
    ```jsx
    // id로 요소 가져오기
    const element = document.getElementById('myId');
    
    // 클래스명으로 요소 가져오기
    const elements = document.getElementsByClassName('myClass');
    
    // 태그명으로 요소 가져오기
    const tags = document.getElementsByTagName('div');
    
    // querySelector로 CSS 선택자 방식으로 가져오기
    const elem = document.querySelector('.myClass');
    ```
    
- 이벤트 리스너 추가하기
    
    사용자와의 상호작용(클릭, 키보드 입력 등)을 처리하기 위한 메서드
    
    ```jsx
    const button = document.querySelector('button');
    button.addEventListener('click', () => {
      console.log('Button clicked!');
    });
    ```
    
- 이벤트 리스너 제거하기
    
    이벤트가 발생하지 않게 한다
    
    ```jsx
    function handleClick() {
      console.log('Button clicked!');
    }
    
    button.addEventListener('click', handleClick);
    button.removeEventListener('click', handleClick);
    ```
    
- 키보드와 마우스 이벤트
    
    ```jsx
    // 키보드
    document.addEventListener('keydown', (event) => {
      console.log(`Key pressed: ${event.key}`);
    });
    
    // 마우스
    document.addEventListener('click', (event) => {
      console.log(`Mouse clicked at position (${event.clientX}, ${event.clientY})`);
    });
    ```
    
- 태그 속성 다루기
    
    HTML을 읽거나 수정
    
    ```jsx
    const img = document.querySelector('img');
    
    const src = img.getAttribute('src');
    img.setAttribute('alt', '새로운 대체 텍스트');
    ```
    
- 부모와 자식 태그 찾기
    
    요소 간의 관계 찾기
    
    ```jsx
    const parent = element.parentElement;
    const children = element.children;
    ```
    
- 새로운 태그 만들기
    
    javascript로 HTML을 생성하고 DOM에 추가
    
    ```jsx
    const newElement = document.createElement('div');
    newElement.textContent = 'div태그를 javascript로 생성';
    document.body.appendChild(newElement);
    ```
    
- 태그 복제하기
    
    원래 있던 DOM 요소를 복제하여 새 요소로 사용
    
    ```jsx
    const original = document.querySelector('.original');
    const clone = original.cloneNode(true); // true는 하위 요소까지 복제
    document.body.appendChild(clone);
    ```