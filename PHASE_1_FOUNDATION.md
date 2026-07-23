# Phase 1 — Foundation (Pragmatic)

A small, understandable foundation. Every file below has an immediate purpose.
**No existing app file was modified** and **nothing new is imported by the
running app**, so behavior is byte-for-byte identical until you activate the
pieces below.

## What exists after Phase 1

```
tsconfig.json          # gradual TS (allowJs) + path aliases
.eslintrc.js           # lint (lenient on legacy .js)
.prettierrc.js         # format, matched to current code style

Src/
├── app/config/
│   ├── appConfig.ts        # app metadata (no URLs)
│   └── environment.ts      # active env + auth base URL (dev/prod)
├── core/logger/
│   ├── logger.ts           # info/warn/error/debug; debug off in production
│   └── index.ts            # public export
├── types/
│   └── env.d.ts            # types the EXPO_PUBLIC_* env vars
├── design/     (empty — Phase 3: tokens + themes)
├── shared/     (empty — Phase 5/6: components, hooks, utils, assets)
├── modules/    (empty — Phase 8–11: auth, estimation, tagViewer, stockChecking)
├── services/   (empty — Phase 4/8: shared app services)
└── store/      (empty — Phase 7: Redux Toolkit)
```

The empty folders are the agreed skeleton; each gets real files in the phase
noted. (Git doesn't track empty folders, so they'll appear once their first
file lands.)

## Activation (run on your machine, project root)

Tooling isn't auto-installed because `node_modules` was built on Windows;
installing from a different OS can corrupt native binaries.

**1. Install dev tooling (pure-JS, no native builds):**

```bash
npx expo install typescript
npm i -D @types/react eslint@^8 prettier \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native \
  eslint-plugin-import eslint-config-prettier \
  babel-plugin-module-resolver
```

**2. Turn on path aliases — edit `babel.config.js` to:**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./Src/app",
            "@api": "./Src/api",
            "@core": "./Src/core",
            "@design": "./Src/design",
            "@shared": "./Src/shared",
            "@modules": "./Src/modules",
            "@services": "./Src/services",
            "@store": "./Src/store",
            "@types": "./Src/types",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      "react-native-reanimated/plugin", // must stay LAST
    ],
  };
};
```

Then: `npx expo start -c` (clean cache). Until this edit, use relative imports.

**3. (Optional) package.json scripts:**

```json
"typecheck": "tsc --noEmit",
"lint": "eslint \"Src/**/*.{js,jsx,ts,tsx}\"",
"format": "prettier --write \"Src/**/*.{js,jsx,ts,tsx}\""
```

## Usage

```ts
import { ENV, isProduction } from "@app/config/environment";
import { APP_CONFIG } from "@app/config/appConfig";
import { logger } from "@core/logger";

logger.info("app started", APP_CONFIG.version);
logger.debug("env", ENV.authBaseUrl); // silent in production
```

Nothing runs unless imported — adoption happens in later phases.
