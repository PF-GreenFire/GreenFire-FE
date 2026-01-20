# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

초록불 (Green Fire) - A React-based web application for environmental challenges and community engagement. The app includes features for nearby stores, challenges, feeds, and user profiles with Supabase authentication.

## Commands

### Development
```bash
npm start          # Start development server (localhost:3000)
npm run build      # Production build
npm test          # Run tests in watch mode
```

### Backend Configuration
The app expects a backend API running at `http://localhost:8080/api` (configurable via `REACT_APP_API_URL` in `.env`).

## Architecture

### State Management
- **Redux** with `redux-thunk` for async actions and `redux-logger` for debugging
- Store configured in `src/store.js`
- Root reducer combines all reducers in `src/modules/root.js`
- Redux actions follow the `redux-actions` library pattern with `createActions` and `handleActions`

### Routing Structure
- **React Router v7** with nested routes
- Main layout wrapper: `CustomLayout` (src/layouts/common/CustomLayout.js)
- Conditional AppBar rendering based on route paths (/, /nearby, /challenges, /feed, /mypage)
- All routes wrapped in CustomLayout with Outlet pattern

Main Routes:
- `/` - MainPage
- `/nearby` - NearbyMain (map/stores)
- `/challenges` - ChallengeMain (list view)
- `/challenges/:id` - ChallengeDetail
- `/challenge` - RegistChallenge (create)
- `/feed` - FeedMain
- `/mypage` - MypageMain

### API Layer
- Centralized axios instance in `src/apis/axios.js` with base URL from env
- API modules follow naming pattern: `{feature}API.js`
- Authentication uses Supabase (`authAPI.js`) with JWT tokens stored in localStorage
- Redux thunk pattern: API functions return async action creators that dispatch Redux actions

Example API pattern:
```javascript
export const getSomethingAPI = (params) => {
    return async (dispatch, getState) => {
        const result = await api.get('/endpoint');
        if(result.status === 200) {
            dispatch(actionCreator(result));
        }
    }
}
```

### Authentication Flow
- Supabase auth integration (currently commented out in SupabaseClient.js but used in authAPI.js)
- Token management: access_token stored in localStorage with key 'token'
- Axios Authorization header set automatically after login
- Login/logout functions in `src/apis/authAPI.js`

### Component Organization
```
src/components/
├── common/          # Shared layout components (NavBar, AppBar, Header, Footer, Banner)
├── item/            # Reusable item components (cards, titles)
│   ├── card/        # Card components (FeedPostCard, StoreInfoCard)
│   └── title/       # Title components (HighlightedTitle)
└── main/            # Main page sections (Challenge, Feed)
```

### Page Structure
Pages are organized by feature domains:
- `auth/` - Authentication (LoginPopup)
- `challenge/` - Challenge management
- `feed/` - Feed/posts
- `map/` - Location services (AddressSearch, LocationMap, NearbyMain)
- `mypage/` - User profile

### Styling
- **Bootstrap 5** via `react-bootstrap` for layout/components
- **Sass** for custom styling (custom.scss)
- Scoped CSS files for specific features (App.css, AppBar.css)
- Mobile-first: max-width 563px container in CustomLayout

### Redux Module Pattern
Reducers use `redux-actions` library:
```javascript
// Action creators with createActions
export const { feature: { action1, action2 }} = createActions({
    [ACTION_TYPE]: result => ({ data: result.data })
});

// Reducer with handleActions
const reducer = handleActions({
    [ACTION_TYPE]: (state, {payload}) => payload
}, initialState);
```

### Environment Variables
Required in `.env` or `.env.local`:
- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_SUPABASE_URL` - Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development Notes

- Backend API must be running for full functionality
- Supabase credentials should be configured in `.env.local` (not committed)
- The project uses Create React App - avoid ejecting unless absolutely necessary
- Category management is implemented with full CRUD via Redux (get, add, delete)
