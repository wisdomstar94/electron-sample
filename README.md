# electron-sample
본 레포지토리는 일렉트론 샘플 프로젝트 입니다. 프론트는 리액트를 사용합니다.

<br />

# 본 레포지토리 구성 과정
1. 아래 명령어로 리액트 프로젝트 생성
```
npx create-react-app electron-sample --template typescript
```

2. 필요한 패키지 설치
```
npm i -D concurrently cross-env electron electron-builder wait-on
```

3. tsconfig.json 내용을 아래와 같이 편집
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "outDir": "build/react",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src/**/*"
  ]
}
```

4. tsconfig.electron.json 파일을 생성 후 아래와 같이 편집
```
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "sourceMap": true,
    "outDir": "build",
    "baseUrl": ".",
    "esModuleInterop": true,
    "paths": {
      "*": ["node_modules/*"]
    }
  },
  "include": [
    "./electron.ts"
  ]
}
```

5. package.json 을 아래와 같이 편집
```
{
  "name": "electron-sample",
  "version": "0.0.1",
  "private": false,
  "homepage": "./",
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.40",
    "@types/react": "^18.2.20",
    "@types/react-dom": "^18.2.7",
    "electron-is-dev": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "react:start": "cross-env BROWSER=none BUILD_PATH='./build/react' react-scripts start",
    "react:build": "BUILD_PATH='./build/react' react-scripts build",
    "react:test": "BUILD_PATH='./build/react' react-scripts test",
    "react:eject": "BUILD_PATH='./build/react' react-scripts eject",
    "electron:start": "electron .",
    "electron:build": "tsc --project ./tsconfig.electron.json",
    "electron:react-wait:start": "wait-on http://127.0.0.1:3000 && npm run electron:start",
    "dev": "concurrently -n react,electron \"npm run react:start\" \"npm run electron:react-wait:start\"",
    "pack": "npm run electron:build && npm run react:build && electron-builder --dir",
    "build": "npm run electron:build && npm run react:build && electron-builder build",
    "build:osx": "npm run build -- --mac",
    "build:linux": "npm run build -- --linux",
    "build:win": "npm run build -- --win"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "cross-env": "^7.0.3",
    "electron": "^25.5.0",
    "electron-builder": "^24.6.3",
    "wait-on": "^7.0.1"
  },
  "main": "./build/electron.js",
  "build": {
    "productName": "electron-sample",
    "appId": "electron-sample",
    "asar": true,
    "protocols": {
      "name": "electron-sample",
      "schemes": [
        "electron-sample"
      ]
    },
    "mac": {
      "target": [
        "default"
      ]
    },
    "dmg": {
      "title": "tournant"
    },
    "win": {
      "target": [
        "zip",
        "nsis"
      ]
    },
    "linux": {
      "target": [
        "AppImage",
        "deb",
        "rpm",
        "zip",
        "tar.gz"
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": false,
      "installerLanguages": [
        "en_US",
        "ko_KR"
      ],
      "language": "1042"
    },
    "files": [
      "build/**/*",
      "package.json"
    ],
    "directories": {
      "output": "build",
      "app": "."
    }
  }
}
```
