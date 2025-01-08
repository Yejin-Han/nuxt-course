# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Nuxt-Portfolio

1. Nuxt 사용 시 데이터 호출
   - **$fetch**
     - node-fetch-native / fetch API
     - 단독 사용 시 서버와 클라이언트에서의 중복 호출 문제로 `Hydration mismatch` 버그 생길 가능성 농후
     - ∴ 클라이언트 사이드에서만 사용
   - **useAsyncData** (\*사용자의 선호가 높은 편)
     - setup function, plugin, route middleware에서만 사용 가능
     - key값을 지정함으로써 서버와 클라이언트 두번의 호출 방지
     - return value 중 data는 ref 객체이므로 .value를 사용해야 함
     - $fetch의 커스텀 및 API 호출에 디자인 패턴의 적용이 필요한 경우 특히 활용
   - **useFetch**
     - useAsyncData + $fetch
     - 외부 fetching 라이브러리 사용시 사용 불가
   - _**useAsyncData vs useFetch**_
     - `useFetch(url)` == `useAsyncData('', () => $fetch(url))`
     - 하지만, 동작 방식에 차이는 있음
     - useFetch는 반응성 객체 그 자체를 전달해야 하며, useAsyncData는 반응성 객체의 value값에 watch 옵션으로 반응성을 부여하여 전달해야 함
     - useFetch는 url을 문자열 형태로 직접 전달하므로 useFetch의 '호출 시점'의 url 객체만을 참조함 -> useAsyncData의 방법대로 객체를 전달해도, 호출된 시점의 객체.value값을 참조하게 됨 (Freezing)
     - useAsyncData는 콜백함수를 통해 API를 호출하므로 콜백함수가 실행되는 시점의 외부 값, 즉 변경된 page.value 값을 참조할 수 있음
2. Promise, async, await
   - **Promise**
     - 함수를 비동기적으로 만들기 위해 사용되는 생성자
     - 호출 여부와 상관없이 `new Promise()`로 생성되자마자 즉시 실행됨
     - -> 우리가 쉽게 실행 시점을 제어하기 위해서는 함수로 감싸서 Promise 생성을 return하는 방법을 사용할 수 있음
     - Promise의 반환 = "비동기 작업이 진행 중이고, 결과값은 나중에 제공된다"
     - pending 상태에서 완료될 때까지 대기
     - fulfilled 상태가 되면 결과값을 반환
     - rejected 상태가 되면 예외를 던짐 (`try...catch`로 처리 가능)
   - **async/await**
     - 명시적으로 Promise를 사용하지 않아도 Promise 기반으로 비동기 처리를 가능하게 함
     - 비동기 작업이 완료된 후에만 다음 작업으로 넘어가도록 호출 타이밍 제어
     - 비동기 작업을 동기 코드처럼 작성할 수 있어 코드의 가독성이 향상되며, Promise 체인을 쓰는 것보다 직관적임
     - `try...catch`를 사용하여 명확한 에러 핸들링 가능
   - **async**
     - Promise를 반환하는 함수를 단순화한 것
   - **await**
     - Promise가 해결될 때까지 대기하는 것을 강제함
     - -> async 함수에서 반환한 Promise를 사용하려면 await로 호출을 해줘야 한다는 소리
3. Scoped Slot
   - slot이 컴포넌트 '템플릿'의 재사용성을 늘려주기 위한 기능이라면, scoped slot은 컴포넌트 '데이터'의 재사용성을 높여주는 기능임
   - 코드 형식
     ```vue
     <!-- 하위 컴포넌트의 슬롯 태그 -->
     <slot :상위 컴포넌트로 전달할 속성 이름="하위 컴포넌트의 데이터"></slot>
     ```
     ```vue
     <!-- 상위 컴포넌트에 등록된 하위 컴포넌트 태그 부분 -->
     <child-component>
       <template v-slot={ 하위 컴포넌트에서 전달 받은 속성 이름 }>
         {{ 하위 컴포넌트에서 전달 받은 속성 이름.xxx }}
         ...
       </template>
     </child-component>
     ```
