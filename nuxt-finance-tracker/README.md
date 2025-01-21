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

## Nuxt-Finance-Tracker

1. **Nuxt-Ui**

   - based on Tailwind CSS (Auto imported)
   - CSS color-scheme이 자동 설정된다 (color-scheme이 light dark인 경우, 시스템이 dark mode이면 background-color black, color white로 지정해주는 속성)
   - config 등의 설정을 수정하고 싶으면, 1) `app.config.ts` 파일에 지정, 2) `nuxt.config.ts` 파일에서 appConfig 설정, 3) 태그에 직접 `:ui={ 속성: 바꿀 값 }`을 입력해주는 것도 가능하다

2. **Supabase**

   - PostgreSQL 기반의 데이터베이스 플랫폼, 서비스형 백엔드
   - 백엔드 서버 배포 필요 없음, 서버리스!
   - 관계형 DB 생성, 인증/로그인/소셜로그인, 저장소, 실시간 등 제공
   - RLS(Row-Level-Security): 행 수준 보안 => 행 단위로 발생하는 CRUD 행위를 사용자별로 제한할 수 있음, 제한 적용을 위해 policy 추가

3. **Zod**

   - 데이터 검증(validation) 라이브러리
   - \*사용 가능한 기타 라이브러리 : Yup, Joi, Valibot, Superstruct, etc.
   - schema : 입력받기를 원하는 데이터의 구조를 정의(타입 및 형식)
   - 폼 검증할 때, API 응답 검증할 때, 입력값이 특정 형식인지 확인할 때 사용
   - Nuxt UI의 `<UForm />`의 경우, 자동으로 Zod 검증을 처리해주므로 태그에 `:schema="schema이름"`만 연결해주면 된다

4. **Nested Routes**

   - 파일 구조 : 부모페이지 이름과 자식 컴포넌트가 위치한 폴더의 이름이 같아야 한다
     ```
     -| pages/
     ---| parent/
     -----| child.vue
     ---| parent.vue
     ```
   - 부모 페이지에서 자식 컴포넌트를 보여주기 위해서는 `<NuxtPage />` 컴포넌트를 사용한다

5. **Proxy**

6. **기타**

   1. Intl(자바스크립트 표준 내장 객체)

      - 언어에 민감한 문자열 비교, 숫자 서식, 날짜 및 시간 서식 등을 제공하는 국제화 API 구성
      - 모든 프로퍼티와 메서드는 정적임
      - 인자 => (locale 코드, 포맷팅 옵션 객체)
      - ```javascript
        // example
        const koDtf = new Intl.DateTimeForamt("ko", { dateStyle: "long" });
        koDtf.format(new Date());
        ```

   2. tailwind 기반 다크모드 관리 시 useHead(htmlAttrs에서 class computed로 바꾸기)

   3. '?' 연산자

      1. 옵셔널 체이닝 연산자 `a ?. b`

         - ```javascript
           const elem = null;
           const value = elem?.value;

           console.log(value);
           // undefined

           const elem2 = {
             value: "hello",
           };
           const value2 = elem2?.value;

           console.log(value2);
           // hello
           ```

         - a가 null or undefined인 경우 undefined를 반환, 그렇지 않다면 오른쪽 프로퍼티인 b의 참조를 이어간다

      2. null 병합 연산자 `a ?? b`
         - ```javascript
           let a = a !== null && a !== undefined ? a : b;
           ```
         - a가 null도 아니고 undefined도 아니라면 a
         - null이나 undefined면 b
