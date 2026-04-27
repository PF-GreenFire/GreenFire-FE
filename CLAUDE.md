# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

초록불 (Green Fire) — A React-based web application for environmental challenges and community engagement. Pairs with the Spring Boot backend in `../../greenfire-be/GreenFire-BE`.

## Commands

```bash
npm install
npm start          # Dev server on http://localhost:3000
npm run build      # Production build
npm test           # react-scripts / Jest (watch mode)
```

The dev server does **not** proxy — it talks directly to the backend via `REACT_APP_API_URL`. Backend must be running on `localhost:8080` for the app to function end-to-end.

## Tech Stack

- **React 18** (Create React App / `react-scripts` 5)
- **react-router-dom 7** — flat route table in `src/App.js`
- **Redux** (classic `createStore` + `redux-thunk` + `redux-logger`) with the `redux-actions` library for action/reducer wiring
- **@tanstack/react-query** — used for the auth/session hook (`useAuth`)
- **Ant Design 5** + **react-bootstrap** + **Sass** — mixed UI libraries
- **Axios** — single shared instance in `src/apis/axios.js`
- **Supabase JS client** — used only for storage/realtime helpers (auth itself is JWT, not Supabase)

## Architecture

### Authentication

JWT-based, **not** Supabase auth. Tokens are handled in two layers:

- **Access token**: in-memory only (`let accessToken` inside `src/apis/axios.js`). Set via `setAccessToken(...)` after login/refresh, attached to every request via the request interceptor.
- **Refresh token**: HttpOnly cookie set by the backend (`withCredentials: true` is on the axios instance).
- **401 handling**: response interceptor calls `POST /api/auth/refresh` once, queues concurrent failed requests, retries them with the new token. On refresh failure it clears the in-memory token and dispatches a `session-expired` window event — `SessionExpiredModal` (mounted in `App.js`) listens and prompts re-login.
- **Session hook**: `src/hooks/useAuth.js` exposes `{ user, isLoggedIn, isLoading, role, isSessionExpired, onLoginSuccess, onLogout, clearSessionExpired }`. `user.userId` (UUID) is the canonical identifier — match it against backend-returned host/owner UUIDs.
- **Protected routes**: `src/components/common/ProtectedRoute.js` wraps routes that need login or a specific role (`requiredRole="ADMIN"`).

There is **no `localStorage.token`** anywhere in the live code. Older docs/comments referencing it are outdated — do not reintroduce.

### Routing (src/App.js)

Routes are flat under three top-level groupings:

```
/signup, /find-email, /reset-password         — auth pages (no layout)
/notices, /notices/:noticeCode[/edit|/new]    — notice pages (no layout)
/admin/*  → AdminPageLayout (ADMIN-only)
  ├ dashboard, notices, members, reports, feed, banners
/  → CustomLayout (mobile-first 563px container)
  ├ index → MainPage
  ├ nearby → NearbyMain
  ├ challenges, challenges/:id, challenge (regist, login required)
  ├ feed, feed/create (login required), feed/:postCode
  └ store/:storeCode
/mypage  → MypageLayout (login required)
  └ scrapbook, achievements, challenges, eco-memories, info, withdrawal
```

`SessionExpiredModal` is mounted at the App root, outside `<Routes>`, so it overlays any page.

### State Management

- Store in `src/store.js` (`createStore(rootReducer, applyMiddleware(thunk, logger))`).
- Reducers live in `src/modules/*Reducer.js` and are combined in `src/modules/root.js`. Existing reducers: `Category`, `Challenge`, `Feed`, `Follow`, `Mypage`, `Scrapbook`, `Store`.
- Reducer pattern uses `redux-actions`:

  ```js
  export const {
    challenge: { getChallenges },
  } = createActions({
    [GET_CHALLENGES]: (result) => ({
      challenges: result.data.challenges || result.data,
      totalCount: result.data.totalCount || result.data.length,
    }),
  });

  const challengeReducer = handleActions(
    { [GET_CHALLENGES]: (state, { payload }) => payload },
    initialState,
  );
  ```

- React Query coexists with Redux — used for auth/session state via `useAuth`. Don't migrate one to the other without a deliberate reason.

### API Layer (src/apis/)

- `axios.js` — shared instance + interceptors (above).
- `SupabaseClient.js` — lazily memoized Supabase client (reads `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY`).
- One module per domain: `authAPI`, `adminAPI`, `bannerAPI`, `categoryAPI`, `challengeAPI`, `feedAPI`, `followAPI`, `mypageAPI`, `noticeAPI`, `reportAPI`, `scrapbookAPI`, `storeAPI`.
- Two coexisting styles:
  - **Thunk style** (used when the response should hydrate Redux): exported function returns `async (dispatch) => { ... dispatch(action(result)) }`. Components call it with `dispatch(getChallengesAPI({...}))`.
  - **Plain async** (used when the caller handles the response locally): exported function returns a Promise of `result.data`.
- All paths use the `/api/...` prefix — backend `SecurityConfig` is built around it. Anything calling `/v1/...` is a stale leftover and should be fixed (only `scrapbookAPI` still has `/v1/scraps` calls — those are intentionally untouched until the BE scrap endpoint is finalized).

### Component Organization

```
src/
├── apis/             # axios + per-domain API modules
├── components/
│   ├── common/       # NavBar, AppBar, Header, Footer, Banner, ProtectedRoute, SessionExpiredModal
│   ├── item/         # card/, title/ — reusable item cards & titles
│   └── main/         # main-page-only sections (Challenge, Feed)
├── hooks/            # useAuth.js (React Query session hook)
├── layouts/
│   ├── common/       # CustomLayout (root Outlet)
│   ├── AdminPageLayout
│   └── MyPageLayout
├── modules/          # Redux reducers + root.js
├── pages/            # admin/, auth/, challenge/, feed/, map/, mypage/, notice/, store/, MainPage, ExDesign
├── store.js
└── App.js            # All route definitions live here
```

### Styling

- Bootstrap 5 via `react-bootstrap` for layout.
- Ant Design 5 for richer widgets (modals, tables, forms in admin).
- Sass for custom theming (`custom.scss`); per-feature CSS files (`App.css`, `AppBar.css`).
- Mobile-first: `CustomLayout` clamps content to `max-width: 563px`.

### Environment Variables (.env / .env.local)

| Key | Purpose |
|---|---|
| `REACT_APP_API_URL` | Backend base URL — set to `http://localhost:8080/api` for local dev |
| `REACT_APP_SUPABASE_URL` | Supabase project URL (storage/realtime only) |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anon key |

Supabase keys are not committed; ask a teammate or set them in `.env.local`.

## Conventions

- Don't reintroduce `localStorage.removeItem("token")` style cleanup — there is no `token` key in localStorage. Just call `onLogout()` from `useAuth`.
- New API calls go through the shared axios instance — don't `import axios from "axios"` directly.
- Host/ownership checks compare `user?.userId` from `useAuth()` against the UUID returned by the backend (e.g. `challenge.hostUser`).
- New top-level pages: add an import + `<Route>` in `src/App.js` under the appropriate layout group; wrap with `<ProtectedRoute>` when login or a role is required.
