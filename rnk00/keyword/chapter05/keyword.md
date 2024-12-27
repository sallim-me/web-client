- useRef 🍠
    
    컴포넌트 내에서 특정 DOM 요소나 값을 직접 참조할 수 있는 객체를 생성하기 위해 사용
    
    `useRef`로 생성된 객체는 컴포넌트가 다시 렌더링되어도 값이 초기화되지 않아 렌더링 사이에 유지되지만 상태 변경을 일으키지 않는 값을 다룰 때 유용하다
    
- input의 주요 프로퍼티 🍠
    
    ### 1. `type`
    
    - **설명**: 입력 필드의 종류를 설정합니다.
    - **값 예시**: `"text"`, `"password"`, `"email"`, `"number"`, `"checkbox"`, `"radio"` 등
    - **예시**: `<input type="text" />`
    
    ### 2. `value`
    
    - **설명**: 입력 필드의 값을 설정하고 제어할 때 사용됩니다. **Controlled Component**에서 자주 사용됩니다.
    - **값 예시**: 문자열 또는 숫자
    - **예시**: `<input type="text" value={value} />`
    
    ### 3. `defaultValue`
    
    - **설명**: 초기값을 설정하는 데 사용됩니다.
    - **값 예시**: 문자열 또는 숫자
    - **예시**: `<input type="text" defaultValue="초기값" />`
    
    ### 4. `onChange`
    
    - **설명**: 사용자가 입력 필드에 값을 입력하거나 변경할 때 호출되는 이벤트 핸들러입니다.
    - **값 예시**: 함수
    - **예시**: `<input type="text" onChange={(e) => setValue(e.target.value)} />`
    
    ### 5. `placeholder`
    
    - **설명**: 입력 필드가 비어 있을 때 표시되는 힌트 텍스트입니다.
    - **값 예시**: 문자열
    - **예시**: `<input type="text" placeholder="여기에 입력하세요" />`
    
    ### 6. `checked`
    
    - **설명**: 체크박스나 라디오 버튼이 선택되었는지 여부를 제어합니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="checkbox" checked={isChecked} />`
    
    ### 7. `defaultChecked`
    
    - **설명**: 체크박스나 라디오 버튼의 초기 상태를 설정합니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="checkbox" defaultChecked />`
    
    ### 8. `disabled`
    
    - **설명**: 입력 필드를 비활성화하여 사용자 입력을 막습니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="text" disabled />`
    
    ### 9. `readOnly`
    
    - **설명**: 입력 필드의 값을 읽기 전용으로 설정합니다. 사용자는 값을 변경할 수 없습니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="text" readOnly />`
    
    ### 10. `name`
    
    - **설명**: 폼 데이터를 제출할 때 서버로 전송되는 데이터의 이름을 지정합니다.
    - **값 예시**: 문자열
    - **예시**: `<input type="text" name="username" />`
    
    ### 11. `maxLength`
    
    - **설명**: 입력할 수 있는 최대 글자 수를 지정합니다.
    - **값 예시**: 숫자
    - **예시**: `<input type="text" maxLength={10} />`
    
    ### 12. `min` / `max`
    
    - **설명**: 숫자 또는 날짜 입력에서 사용할 수 있는 최소/최대 값을 지정합니다.
    - **값 예시**: 숫자 또는 날짜
    - **예시**: `<input type="number" min={1} max={10} />`
    
    ### 13. `autoFocus`
    
    - **설명**: 페이지가 로드될 때 자동으로 입력 필드에 포커스를 줍니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="text" autoFocus />`
    
    ### 14. `required`
    
    - **설명**: 입력 필드를 필수 입력으로 설정합니다. 폼을 제출할 때 이 필드가 비어 있으면 제출이 거부됩니다.
    - **값 예시**: `true` 또는 `false`
    - **예시**: `<input type="text" required />`

### **`Controlled Input`** vs **`UnControlled Input`**

- Controlled Input
    
    ### Controlled Input
    
    React의 상태(state)를 통해 입력 값 제어
    
    Input의 value가 컴포넌트의 상태에 연결되어 있고, 상태값이 달라질 떄 마다, 입력 필드의 값도 갱신된다
    
    쉽게 말해서, Input의 값은, **`React Component가 제어`**하고, 모든 입력 변화 또한, **`컴포넌트의 상태로 반영`**되어집니다.
    
    특징
    
    - 상태 값이, **`Input의 value 속성에 직접적으로 연결`** 됨.
    - **`Input`**의 **`Value`**가 **`변경`**되면, **`상태가 업데이트`**되고, **`상태가 다시 렌더링을 Trigger`** 함.
    - **`React`**가 **`Form 요소의 현재 값을 항상 알고 있기에 제어가 용이`**.
    
    ```tsx
    import { useState } from 'react';
    
    function ControlledInput() {
      const [inputValue, setInputValue] = useState('');
    
      const handleChange = (event) => {
        setInputValue(event.target.value);
      };
    
      return (
        <div>
          <input type="text" value={inputValue} onChange={handleChange} />
          <p>입력: {inputValue}</p>
        </div>
      );
    }
    
    export default ControlledInput;
    
    ```
    
    ### 장점
    
    상태를 통해 값이 직접적으로 제어 →  **`폼 데이터를 검증`**하거나 **`조작`**하기가 쉽다.
    
    **`사용자 입력을 실시간으로 검증`**하거나 **`포맷을 조정`**할 수 있습니다.
    
    ### 단점
    
    **`컴포넌트에서 상태 관리가 복잡`**해질 수 있으며, 특히 폼 데이터에 너무 많은 value들을 관리하는 경우 **`성능에 부담`**이 될 수 있습니다.
    
- UnControlled Input
    
    ### UnControlled Input
    
    DOM 자체에서 입력 값을 관리하는 방식
    
    폼의 값은 **`React 컴포넌트가 직접 관리하지 않고`**, 필요할 때 DOM에서 직접 값을 참조하는 방법입니다. 이를 위해 `ref`를 사용하여 **`DOM 요소에 직접 접근`**할 수 있습니다.
    
    ### 특징
    
    입력값이 `state`에 의존하지 않고, React의 제어 밖에서 관리
    
    폼 요소의 값은 사용자가 입력하는 대로 DOM에 저장되며, 필요할 때만 값을 읽어 옵니다.
    
    React의 상태를 사용하지 않기 때문에 폼을 간단하게 유지할 수 있습니다.
    
    ```tsx
    import { useRef } from 'react';
    
    function UncontrolledInput() {
      const inputRef = useRef(null);
    
      const handleSubmit = () => {
        console.log(`입력: ${inputRef.current.value}`);
      };
    
      return (
        <div>
          <input type="text" ref={inputRef} />
          <button onClick={handleSubmit}>제출</button>
        </div>
      );
    }
    
    export default UncontrolledInput;
    
    ```
    
    ### 장점
    
    - 상태 관리가 필요 없으므로 간단한 폼에 적합하며, **`성능적으로도 유리`**할 수 있습니다.
    - 작은 폼이나 **`상태가 필요 없는 경우 사용하기 쉽습니다.`**
    
    ### 단점
    
    - 입력 값을 **`실시간으로 검증하거나 조작하기 어려우며`**, 폼 데이터와 관련된 논리를 관리하는 데 제약이 있을 수 있습니다.
    - **`DOM에 직접 접근`**하기 때문에 **`React의 단방향 데이터 흐름을 벗어나는 경우`**가 생길 수 있습니다.
    

### react-hook-form & yup 🍠

React에서 폼을 간편하게 관리하고, 유효성 검사를 수행하는 데 유용한 라이브러리

두 개의 라이브러리를 함께 사용하면, 폼 입력 관리와 검증 과정을 매우 효율적으로 처리할 수 있다

여기서는 **`yup`**을 통한, **`validation`**을 설명하지만, **`TypeScript`**를 사용한다면 **`zod`**를 쓰는 게 조금 더 유리할 수도 있다

- **`react-hook-form`** 공식문서 설명
    
    ### react-hook-form
    
    https://react-hook-form.com/get-started
    
    주요 특징
    
    1. DX (개발자 경험)
        
        직관적이고, 기능이 완벽한 API로, 개발자가 폼을 구축할 떄 매끄러운 경험을 제공합니다.
        
    2. HTML 표준
        
        기존의 HTML 마크업을 활용하여 제약 기반 검증 API로 폼을 검증합니다.
        
    3. 가벼움
        
        패키지 크기는 매우 중요합니다. React Hook Form은 의존성이 없는 작은 라이브러리이다.
        
    4. 성능
        
        리렌더링 횟수를 최소화하고, 검증 계산을 줄이며, 더 빠른 마운팅을 제공.
        
    5. 채택 가능성
        
        폼 상태는 본질적으로 로컬에 있기 떄문에 다른 의존성 없이도 쉽게 채택 가능하다.
        
    6. UX (사용자 경험)
        
        최상의 사용자 경험을 제공하기 위해 일관된 검증 전략을 지향.
        
- **`yup`** 공식문서 설명
    
    ### yup
    
    ‣
    
    런타임 값 파싱 및 검증을 위한 스키마 빌더
    
    스키마를 정의하고, 값을 변환하여 일치시키거나, 기존 값의 형태를 검증하거나, 두 작업을 모두 수행할 수 있습니다. **`Yup 스키마`**는 매우 표현력이 뛰어나며 복잡하고 상호 의존적인 검증이나 값 변환을 모델링할 수 있습니다.
    
    주요 기능:
    
    1. 간결하면서도 표현력이 뛰어난 스키마 인터페이스로, 간단한 데이터 모델부터 복잡한 데이터 모델까지 설계 가능
    2. 강력한 TypeScript 지원: 스키마에서 정적 타입을 추론하거나, 스키마가 올바르게 타입을 구현하는지 확인
    3. 내장된 비동기 검증 지원: 서버 측 및 클라이언트 측 검증을 동일하게 모델링 가능
    4. 확장성: 타입 안정성이 보장된 메서드와 스키마를 추가할 수 있음
    5. 풍부한 오류 세부 정보 제공으로 디버깅이 쉬움