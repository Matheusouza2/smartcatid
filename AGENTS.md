# SmartCatID — Agent Guide

Cat facial recognition app. Expo SDK 54, React Native 0.81.5, React 19.1.0. Source in **JavaScript** (no TS despite typescript in devDeps).

## Commands

| Cmd | What |
|---|---|
| `npm start` | `expo start` |
| `npm run android` | `expo run:android` (needs `npx expo prebuild --clean` first) |
| `npm run ios` | `expo run:ios` |
| `npm run web` | `expo start --web` |
| `npm run lint` | `expo lint` (ESLint 9 flat config) |
| `./build.sh` | Gradle debug APK (cd android && ./gradlew assembleDebug) |
| `eas build --platform android --profile preview` | EAS preview APK |
| `eas build --platform android --profile production` | EAS production APK |

No tests, no CI, no pre-commit hooks.

## Routes (Expo Router file-based)

Root `_layout.js` wraps `<AuthProvider>`. Auth screens at `app/auth/`. Authenticated screens under `app/(app)/` route group (protected via `Redirect` in `(app)/_layout.js`).

| Path | File | Screen |
|---|---|---|
| `/` | `app/(app)/index.js` | Home — Cadastrar / Buscar / Meus Gatos + logout |
| `/auth/login` | `app/auth/login.js` | Login |
| `/auth/register` | `app/auth/register.js` | Register (name, email, phone, address, password) |
| `/storeCat` | `app/(app)/storeCat/index.js` | Capture 3 valid cat photos |
| `/searchCat` | `app/(app)/searchCat/index.js` | Search by photo |
| `/listCats` | `app/(app)/listCats/index.js` | List registered cats |

## Architecture Traps

**Auth redirect logic is split:**
- `app/_layout.js` = bare `<AuthProvider>` wrapping `<Slot />` — NO redirects here.
- `app/auth/_layout.js` = redirects authenticated users to `/` (checks `navigationState?.key` before redirecting).
- `app/(app)/_layout.js` = redirects unauthenticated users to `/auth/login` via `<Redirect>` component. Also shows "Carregando..." while `isLoading`.
- Auth state is **in-memory only** (no token persistence) — app reload = re-login.

**`PROJECT_INFO.md` is STALE. DO NOT trust its route paths.** Routes moved under `app/(app)/` group. `listCats` route/service exist but are undocumented there.

**`Contexts/useCameraPermission.js` is legacy.** Uses `react-native-vision-camera` (uninstalled). Ignore it. All camera code uses `expo-camera`.

## Key Patterns

### Styling — NativeWind v4
- `className` on every element. Colors from custom tailwind theme: `primary-*` (yellow/amber, #f9c033) and `shark-*` (gray, #212121).
- `global.css` has `@tailwind base/components/utilities`. **Must be imported in root `app/_layout.js`** — NOT in individual screens. Importing per-screen caused the EAS production APK to ship without CSS.
- `nativewind/babel` preset set in `babel.config.js` with `jsxImportSource: "nativewind"`.

### Icons
Use `@react-native-vector-icons/*` packages (separate packages per set, not `@expo/vector-icons` directly):
- `@react-native-vector-icons/fontawesome6` → `import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6"`
- `@react-native-vector-icons/lucide` → `import { Lucide } from "@react-native-vector-icons/lucide"`
- `@react-native-vector-icons/fontawesome` → `FontAwesome`
- Also `@expo/vector-icons` re-exports some (FontAwesome in searchCat uses `@expo/vector-icons`).

### Import Aliases
babel-plugin-module-resolver: `@/` → `./`, `@components/` → `./components`, `@services/` → `./services`, `@Contexts/` → `./Contexts`, `@hooks/` → `./hooks`, `@assets/` → `./assets`.

### API Calls
- `EXPO_PUBLIC_API_URL` from `process.env.EXPO_PUBLIC_API_URL` (Expo built-in env, not react-native-dotenv).
- Image upload services use `FormData` with `multipart/form-data` Content-Type.
- Auth services use `application/json`.
- Error parsing: `await response.json().catch(() => ({}))` then read `.detail` field (FastAPI convention).
- `storeCat` S3 flow: 1) compress all 3, 2) `POST /get_upload_urls`, 3) `PUT` each to S3 presigned URL, 4) `POST /store_cat`.

### Image Pipeline
All image paths route through `services/compressImage.js`:
- `expo-image-manipulator` v14 API: `ImageManipulator.manipulate(uri).resize({ width: 1024 }).renderAsync().saveAsync({ format: SaveFormat.JPEG, compress: 0.85 })`.
- Every service that handles photos has `uri.startsWith("file://") ? uri : \`file://${uri}\`` normalization.

### Camera
- `expo-camera` `CameraView` with `active={phase === PHASE.CAMERA}` to disable camera when not capturing.
- `useCameraPermissions()` for permission flow.
- Camera capture: `cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true })`.

### Feedback Modals
Reusable `DetectionFeedbackModal`:
- Props: `visible`, `type`("success"|"error"), `title`, `message`, `onDismiss`, `onConfirm`, `confirmLabel`.
- Animated entry (spring scale + fade). Colored header bar. Only emoji icons (🐱/🔍).
- Each screen manages modal state as a single object with `visible`, handles hide/show via `useCallback`.

### Image Picker
`expo-image-picker`: call `requestMediaLibraryPermissionsAsync()` before `launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4,3], quality: 1 })`.

## Component State Patterns
- Screen-level state machine via `PHASE` constants (CAMERA → DETECTING → SENDING).
- Local `useState` only — no Redux/Zustand.
- `useCallback` for handlers to prevent re-render issues with camera refs.
- `useRef(cameraRef)` for CameraView imperative handle.

## Build / Config
- **app.json**: `newArchEnabled: true`, `edgeToEdgeEnabled: true`, `typedRoutes + reactCompiler experiments`.
- **Android package**: `com.matheusouza_2.smartcatid`, **iOS bundle**: `com.matheusouza-2.smartcatid`.
- **EAS project ID**: `05a1d4fa-1053-4b9b-a312-4cd3fdc5e8fe`.
- **Runtime version**: appVersion policy, OTA updates enabled.
- **app.json permissions**: `CAMERA` + `RECORD_AUDIO` (duplicated — both listed twice).
