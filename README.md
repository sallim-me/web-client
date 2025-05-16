# web-client

이 프로젝트는 TypeScript 템플릿을 사용한 [Create React App](https://github.com/facebook/create-react-app)으로 시작되었습니다.

## 프로젝트 구조 및 디자인 가이드라인

이 프로젝트는 코드 품질, 가독성, 유지보수성, 확장성을 위해 **프론트엔드 디자인 가이드라인** (cursor rule)을 따릅니다. 주요 원칙은 다음과 같습니다:

- **가독성**: 명명된 상수 사용, 복잡한 로직 추상화, 조건부 렌더링 분리, 간단한 로직의 위치 최적화
- **예측 가능성**: 반환 타입 표준화, 숨겨진 부작용 방지, 고유하고 설명적인 이름 사용
- **응집성**: 기능/도메인별 코드 구성, 매직 넘버와 로직의 연관성, 적절한 폼 응집성 선택
- **결합도**: 조기 추상화 방지, 상태 관리 범위 설정, props drilling 대신 컴포넌트 구성 사용

### 예시 구조

```
src/
├── components/ # 공유/공통 컴포넌트
├── hooks/      # 공유/공통 훅
├── utils/      # 공유/공통 유틸리티
├── domains/
│   ├── user/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── ...
└── App.tsx
```

자세한 패턴과 근거는 `cursor rule` 문서를 참조하세요.

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어를 실행할 수 있습니다:

### `npm start`

개발 모드로 앱을 실행합니다.\
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.

코드를 수정하면 페이지가 자동으로 새로고침됩니다.\
콘솔에서 린트 에러를 확인할 수 있습니다.

### `npm test`

대화형 감시 모드에서 테스트 러너를 실행합니다.\
자세한 내용은 [테스트 실행](https://facebook.github.io/create-react-app/docs/running-tests) 섹션을 참조하세요.

### `npm run build`

프로덕션용 앱을 `build` 폴더에 빌드합니다.\
React를 프로덕션 모드로 올바르게 번들링하고 최적의 성능을 위해 빌드를 최적화합니다.

빌드는 최소화되며 파일 이름에 해시가 포함됩니다.\
앱을 배포할 준비가 완료되었습니다!

자세한 내용은 [배포](https://facebook.github.io/create-react-app/docs/deployment) 섹션을 참조하세요.

### `npm run eject`

**참고: 이 작업은 되돌릴 수 없습니다. `eject`를 실행하면 되돌릴 수 없습니다!**

빌드 도구와 설정 선택에 만족하지 못한다면 언제든지 `eject`할 수 있습니다. 이 명령어는 프로젝트에서 단일 빌드 의존성을 제거합니다.

대신 모든 설정 파일과 전이 의존성(webpack, Babel, ESLint 등)을 프로젝트에 직접 복사하여 완전한 제어권을 가질 수 있게 됩니다. `eject`를 제외한 모든 명령어는 계속 작동하지만, 복사된 스크립트를 가리키게 되어 수정할 수 있습니다. 이 시점부터는 스스로 관리해야 합니다.

`eject`를 사용할 필요는 없습니다. 제공되는 기능 세트는 소규모 및 중간 규모의 배포에 적합하며, 이 기능을 사용할 의무는 없습니다. 하지만 이 도구가 필요할 때 커스터마이징할 수 없다면 유용하지 않을 것이라는 점을 이해하고 있습니다.

## 더 알아보기

[프론트엔드 디자인 가이드라인](./cursor_rule.md)과 [Create React App 문서](https://facebook.github.io/create-react-app/docs/getting-started)에서 더 자세한 내용을 확인할 수 있습니다.

React에 대해 더 알아보려면 [React 문서](https://reactjs.org/)를 확인하세요.
