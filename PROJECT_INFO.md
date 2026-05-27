# SmartCatID - Informações do Projeto

## Visão Geral

**SmartCatID** é um aplicativo mobile para **reconhecimento facial de gatos**. Usa visão computacional e machine learning para identificar gatos por suas faces. O app permite:

- **Cadastrar novos gatos** tirando 3 fotos do rosto do gato (validadas por um serviço de backend AI)
- **Buscar gatos** tirando ou selecionando uma foto para corresponder ao banco de dados

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | React Native 0.81.5 via Expo SDK 54 |
| **Linguagem** | JavaScript (sem TypeScript no source) |
| **Navegação** | Expo Router 6 (file-based routing) |
| **Estilização** | NativeWind v4 (Tailwind CSS para React Native) |
| **Estado/Contexto** | React Context + useState |
| **Backend** | AWS Lambda (FastAPI-like) |
| **Processamento de Imagem** | expo-image-manipulator v14 |
| **Câmera** | expo-camera v17 |
| **Image Picker** | expo-image-picker v17 |
| **Animações** | React Native Animated API + react-native-reanimated ~4.1 |
| **Ícones** | @react-native-vector-icons (FontAwesome6, Lucide, Evil, FontAwesome) |
| **Build** | EAS Build (Expo Application Services) |
| **Gestos** | react-native-gesture-handler ~2.28 |
| **Variáveis de Ambiente** | react-native-dotenv (via `@env`) |
| **Lint** | ESLint 9 + expo-config |

## Estrutura de Diretórios

```
smartcatid/
├── .env                          # API_URL do backend Lambda
├── .gitignore
├── .gitattributes
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── README.MD
├── PROJECT_INFO.md
├── app.json                      # Configuração Expo
├── assets/
│   ├── android/                  # Ícones Android (mipmap-*)
│   ├── images/                   # Ícones do app, splash, favicon
│   └── models/                   # (vazio)
├── babel.config.js
├── build.sh                      # Script de build Android
├── eas.json                      # Configuração EAS Build (preview + production APK)
├── eslint.config.js              # ESLint flat config com expo-config
├── global.css                    # Diretivas Tailwind
├── metro.config.js               # Metro bundler + NativeWind
├── package.json
├── tailwind.config.js            # Tema customizado (primary & shark)
├── components/
│   └── DetectionFeedbackModal.js  # Modal animado de feedback
├── Contexts/
│   ├── AuthContext.js            # Contexto de autenticação (login/register/logout)
│   └── useCameraPermission.js    # Hook legado (react-native-vision-camera, não usado)
├── constants/                    # (vazio)
├── Hooks/                        # (vazio)
├── services/
│   ├── auth.js                   # Autenticação (login/register via API)
│   ├── compressImage.js          # Compressão de imagem (expo-image-manipulator v14)
│   ├── searchCat.js              # Busca de gato por foto
│   ├── storeCat.js               # Upload de 3 fotos (fluxo S3)
│   └── validateCat.js            # Valida se foto contém rosto de gato
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.js                # Root layout (Stack + AuthProvider + redirects)
│   ├── index.js                  # Home screen (protegida - requer login)
│   ├── auth/
│   │   ├── _layout.js            # Auth layout (Stack)
│   │   ├── login.js              # Tela de login do tutor
│   │   └── register.js           # Tela de cadastro do tutor
│   ├── storeCat/
│   │   ├── _layout.js            # Store layout (Stack)
│   │   └── index.js              # Cadastro de gato (câmera + validação + upload)
│   └── searchCat/
│       ├── _layout.js            # Search layout (Stack)
│       └── index.js              # Busca de gato (câmera + API)
├── android/                      # Projeto Android nativo (gerado)
├── ios/                          # Projeto iOS nativo (gerado)
└── node_modules/
```

## Configurações Importantes

### Variáveis de Ambiente (`.env`)
```env
EXPO_PUBLIC_API_URL=https://rwak5gaipdqnjzxxm2afehbgqm0pidlq.lambda-url.us-east-1.on.aws
```

### Aliases de Import (babel.config.js)
| Alias | Caminho |
|---|---|
| `@` | `./` |
| `@components` | `./components` |
| `@assets` | `./assets` |
| `@Contexts` | `./Contexts` |
| `@services` | `./services` |
| `@hooks` | `./hooks` |
| `@env` | `.env` (não mais usado, prefira `process.env.EXPO_PUBLIC_...`) |

### Tema Tailwind Customizado
- **primary**: Amarelo/âmbar (#f9c033 principal) - cor da marca
- **shark**: Cinza escuro (#212121 mais escuro) - fundos/texto

### app.json (Expo)
- **Nome**: smartcatid
- **Versão**: 1.0.0
- **Orientação**: Retrato apenas
- **Scheme**: smartcatid
- **iOS bundle**: `com.matheusouza-2.smartcatid`
- **Android package**: `com.matheusouza_2.smartcatid`
- **New Architecture**: Habilitada
- **EAS Project ID**: `05a1d4fa-1053-4b9b-a312-4cd3fdc5e8fe`
- **Plugins**: expo-router, expo-splash-screen (com config dark mode), expo-camera, expo-image-picker
- **Experiments**: typedRoutes, reactCompiler
- **Edge to Edge**: Habilitado no Android
- **Icone adaptativo**: Android com foreground + background + monochrome

### package.json (Dependências Principais)
- **SDK**: Expo ~54.0.27
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Navegação**: @react-navigation/native, bottom-tabs, elements
- **Câmera/Imagem**: expo-camera, expo-image-picker, expo-image-manipulator, expo-file-system, expo-image
- **Ícones**: @react-native-vector-icons (fontawesome6, lucide, evil, fontawesome)
- **Estilização**: nativewind ^4.2.3, tailwindcss ^3.4.19, react-native-css-interop
- **Animação/Gestos**: react-native-reanimated ~4.1.1, react-native-gesture-handler ~2.28
- **Outros**: expo-dev-client, expo-haptics, expo-symbols, expo-system-ui, expo-web-browser, expo-linking, react-native-dotenv, react-native-worklets, expo-constants, expo-font, expo-status-bar
- **Web**: react-dom, react-native-web
- **Dev**: ESLint 9 (expo-config), TypeScript ~5.9.2 (não usado no source), babel-plugin-module-resolver

### Scripts Disponíveis
| Script | Comando |
|---|---|
| `start` | `expo start` |
| `android` | `expo run:android` |
| `ios` | `expo run:ios` |
| `web` | `expo start --web` |
| `lint` | `expo lint` |
| `reset-project` | `node ./scripts/reset-project.js` |

## Rotas (Expo Router)

| Rota | Arquivo | Tela |
|---|---|---|
| `/` | `app/index.js` | Home - botões Cadastrar / Buscar + botão Sair (requer login) |
| `/auth/login` | `app/auth/login.js` | Login do tutor |
| `/auth/register` | `app/auth/register.js` | Cadastro do tutor |
| `/storeCat` | `app/storeCat/index.js` | Cadastro de gato (câmera + validação + upload) |
| `/searchCat` | `app/searchCat/index.js` | Busca de gato (câmera + API) |

## Serviços (Lógica de Negócio)

### services/compressImage.js
- Usa `expo-image-manipulator` v14 (API `ImageManipulator.manipulate()`)
- Redimensiona para no máximo 1024px de largura (mantém aspect ratio)
- Salva como JPEG com 85% de qualidade
- Retorna a URI comprimida

### services/validateCat.js
- Comprime a imagem via `compressImage()`
- Envia como `multipart/form-data` para `{API_URL}/validate_image`
- Retorna JSON: `{ isCat: boolean, confidence: number }`

### services/storeCat.js
- Comprime todas as 3 fotos via `Promise.all(photos.map(compressImage))`
- Chama `{API_URL}/get_upload_urls` → recebe `cat_id`, `upload_urls[]`, `s3_keys[]`
- Faz upload de cada foto via PUT diretamente para URLs pré-assinadas do S3
- Chama `{API_URL}/store_cat` com `{ cat_id, s3_keys }` para processamento backend

### services/searchCat.js
- Comprime a imagem via `compressImage()`
- Envia multipart/form-data para `{API_URL}/process_image`
- Retorna JSON: `{ data: { cat_id: string } }`

### services/auth.js
- `loginTutor(email, password)` → POST `{API_URL}/auth/login`
- `registerTutor(name, email, password)` → POST `{API_URL}/auth/register`
- Ambos usam `Content-Type: application/json`
- Tratamento de erro com `error.detail`

### Contexts/useCameraPermission.js
- Custom hook usando `react-native-vision-camera` (legado)
- **Nota**: As telas usam `expo-camera`. Este contexto não é utilizado.

## Endpoints do Backend (AWS Lambda)

| Endpoint | Método | Usado Por | Propósito |
|---|---|---|---|
| `/auth/login` | POST | `services/auth.js` | Autenticar tutor |
| `/auth/register` | POST | `services/auth.js` | Cadastrar tutor |
| `/validate_image` | POST | `storeCat/index.js` | Validar se foto contém rosto de gato |
| `/get_upload_urls` | POST | `storeCat/index.js` | Obter URLs pré-assinadas S3 |
| `/store_cat` | POST | `storeCat/index.js` | Notificar Lambda para processar uploads |
| `/process_image` | POST | `searchCat/index.js` | Buscar gato correspondente por foto |

## Telas (Screens)

### Home (`app/index.js`)
- Fundo escuro (shark-900)
- Título "SmartCatID" em primary-400
- Botão "Sair" no topo direito (shark-800)
- Dois botões grandes: "Cadastrar novo gato" (ícone FontAwesome6 "cat") e "Buscar gato" (ícone Lucide "scan-line")

### Cadastro (`app/storeCat/index.js`)
- **Fases**: CAMERA → DETECTING → CAMERA (loop) → SENDING
- Requer exatamente **3 fotos válidas** de gato
- Câmera com botão de captura e seletor de galeria
- Indicador de progresso "📸 Foto X de 3" / "✅ 3 fotos prontas!"
- Thumbnails das fotos capturadas (com botão de exclusão ✕) + placeholders (++) para fotos restantes
- Ao ter 3 fotos: botões "Cadastrar gato" (primary) e "Recomeçar" (shark)
- Overlays: "Verificando imagem..." e "Cadastrando gato..."
- Modal de sucesso a cada foto válida (com confiança)
- Modal de erro se foto inválida ou falha de conexão
- Em caso de falha no envio, modal oferece "Tentar novamente" (rechama handleSend)

### Busca (`app/searchCat/index.js`)
- **Fases**: CAMERA → SEARCHING
- Câmera com botão de captura e seletor de galeria
- Overlay: "Buscando no banco de dados..."
- Sucesso: modal mostra ID do gato encontrado
- Falha: modal mostra detalhe do erro retornado
- Botão fechar (X) no topo para resetar

### Login (`app/auth/login.js`)
- Fundo escuro (shark-900)
- Título "SmartCatID" + subtítulo "Faça login para continuar"
- Campos: Email, Senha
- Botão "Entrar" (primary-400) com loading indicator
- Link "Não tem conta? Cadastre-se" → `/auth/register`
- Exibição de erro em container estilizado (red-500)

### Registro (`app/auth/register.js`)
- Fundo escuro (shark-900)
- Título "SmartCatID" + subtítulo "Cadastre-se como tutor"
- Campos: Nome completo, Email, Senha
- Botão "Cadastrar" (primary-400) com loading indicator
- Validação local: "Preencha todos os campos"
- Link "Já tem conta? Faça login" → `/auth/login`

### DetectionFeedbackModal.js
- Modal animado reutilizável
- Entrada animada (spring scale + fade com Animated API)
- Barra de cabeçalho colorida (primary-400 sucesso, red-500 erro)
- Ícone (🐱 gato para sucesso, 🔍 lupa para erro)
- Botão Cancelar + botão de confirmação (com label customizável)
- Props: `visible`, `type`, `title`, `message`, `onDismiss`, `onConfirm`, `confirmLabel`

### Root Layout (`app/_layout.js`)
- Wraps tudo em `AuthProvider`
- `RootLayoutContent`: lê `isAuthenticated` + `segments`
- Redireciona não autenticados → `/auth/login`
- Redireciona autenticados em auth → `/`
- Stack navigator sem headers

## Fluxo de Dados

```
Usuário pressiona "Cadastrar" ou "Buscar"
        │
        ▼
    Câmera (expo-camera)
        │
        ▼
    Captura foto ou seleciona da galeria
        │
        ▼
    compressImage() (1024px, JPEG 85%)
        │
        ▼
    ┌─── Fluxo Cadastro ──────────────────────────────────────┐
    │  validateCat() → POST /validate_image                   │
    │    ├─ Se não é gato: modal erro, tentar novamente        │
    │    └─ Se é gato: modal sucesso, salva URI, repete p/ 3  │
    │                                                          │
    │  Após 3 fotos válidas:                                   │
    │  storeCat():                                             │
    │    1. Promise.all(compressImage) → comprime as 3         │
    │    2. POST /get_upload_urls → URLs + keys S3             │
    │    3. PUT cada foto diretamente no S3                    │
    │    4. POST /store_cat → { cat_id, s3_keys }              │
    │    5. Erro → modal "Tentar novamente" (rechama send)     │
    └──────────────────────────────────────────────────────────┘
    
    ┌─── Fluxo Busca ──────────────────────────────────────────┐
    │  searchCat() → POST /process_image (multipart)           │
    │    ├─ Gato encontrado: modal sucesso com ID              │
    │    └─ Não encontrado: modal erro com detail do servidor  │
    └──────────────────────────────────────────────────────────┘
```

## Observações para Modificações

1. **Câmera**: Usar `expo-camera` (não `react-native-vision-camera`)
2. **Estado**: Usar `useState` para estado local (sem Redux/Zustand)
3. **Animações**: Usar `React Native Animated API`
4. **Estilização**: JSX com sintaxe NativeWind (`className`)
5. **Importações**: Usar aliases configurados (`@/`, `@components/`, `@services/`, `@Contexts/`, `@hooks/`, `@env`)
6. **Autenticação**: Context-based (`AuthContext`). Telas em `app/auth/`. Fluxo: não autenticado → redirect `/auth/login`. Após login/register → redirect `/`. Botão "Sair" na Home. Serviço `services/auth.js` faz chamadas para `{API_URL}/auth/login` e `{API_URL}/auth/register`. Estado persiste apenas em memória (recarregar app volta para login).
7. **Testes**: Não configurados
8. **Backend**: Totalmente externo (AWS Lambda), app é apenas frontend
9. **Modal**: Usar `DetectionFeedbackModal` para feedbacks visuais
10. **Cores**: Seguir o tema Tailwind customizado (primary/shark)
11. **Ícones**: Usar `@react-native-vector-icons` (FontAwesome6, Lucide) - instalados como pacotes separados

## Git

- **Remote**: `origin` → `https://github.com/Matheusouza2/smartcatid.git`
- **Branch padrão**: `main`
- **.gitignore**: node_modules, .expo, dist, web-build, /ios, /android, .gradle, build, expo-env.d.ts
