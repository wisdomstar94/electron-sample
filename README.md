# electron-sample
본 레포지토리는 일렉트론 샘플 프로젝트 입니다. 프론트는 리액트를 사용합니다.

<br /><br />

# 본 레포지토리 구성 과정
1. 아래 명령어로 리액트 프로젝트 생성
```
npx create-react-app electron-sample --template typescript
```

2. 필요한 패키지 설치
```
npm i -D dotenv concurrently cross-env electron electron-builder wait-on cpy-cli del-cli
```
```
npm i react-router-dom app-root-path electron-log@beta
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
    "sourceMap": false,    
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

5. package.json 내용 중 아래 항목을 다음과 같이 편집
```
{
  "scripts": {
    // ...
    "react:start": "cross-env BROWSER=none BUILD_PATH='./build/react' react-scripts start",
    "react:build": "BUILD_PATH='./build/react' react-scripts build",
    "react:test": "BUILD_PATH='./build/react' react-scripts test",
    "react:eject": "BUILD_PATH='./build/react' react-scripts eject",
    "electron:start": "electron .",
    "electron:build": "tsc --project ./tsconfig.electron.json",
    "electron:react-wait:start": "wait-on http://127.0.0.1:3000 && npm run electron:start",
    "dev": "npm run del:build && npm run electron:build && npm run copy:env && concurrently -n react,electron \"npm run react:start\" \"npm run electron:react-wait:start\"",
    "copy:env": "cpy ./.env ./build --dot",
    "del:build": "del-cli ./build",
    // ...
  },
  // ...
  "main": "./build/electron.js",
  // ...
}
```

<br /><br />

# 빌드 및 배포 구성 과정 (aws s3 이용)
1. AWS s3 페이지에 접속하여 버킷 생성

https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2#

2. 버킷의 정책을 아래와 같이 편집
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAppS3Releases",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:AbortMultipartUpload",
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:GetObjectVersion",
        "s3:ListMultipartUploadParts",
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::YOUR BUCKET/*"
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "arn:aws:s3:::YOUR BUCKET"
    }
  ]
}
```

3. 버킷의 객체 소유권을 "ACL 활성화됨" 으로 설정
- "ACL이 복원된다는 것을 확인합니다." 에 체크
- 객체 소유권은 "버킷 소유자 선호" 선택

4. aws iam 에서 사용자 및 키 생성

https://us-east-1.console.aws.amazon.com/iamv2/home?region=ap-northeast-2#/users/create

5. [사용자] -> [<u>생성한 사용자이름</u>] -> [보안 자격 증명] 에 들어가 엑세스 키를 생성
- 사용 사례는 "Command Line Interface(CLI)" 을 선택합니다.

6. 사용자의 권한에 아래 JSON 정책 내용을 추가합니다.
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:PutObjectAcl",
				"s3:GetObject",
				"s3:GetObjectAcl",
				"s3:GetBucket",
				"s3:GetBucketAcl"
			],
			"Resource": "arn:aws:s3:::my-samples-bucket/*"
		}
	]
}
```

7. package.json 에 아래 내용 추가 작성
```
{
  // ...
  "script": {
    // ...
    "build": "npm run del:build && npm run electron:build && npm run react:build && npm run copy:env && electron-builder build --config electron-builder-config.js",
    "pack": "npm run build -- --publish never",
    "pack:deploy": "npm run build -- --publish always",
    "pack:win": "npm run build -- --win --publish never",
    "pack:win:deploy": "npm run build -- --win --publish always",
    "pack:mac": "npm run build -- --mac --publish never",
    "pack:mac:deploy": "npm run build -- --mac --publish always",
    "pack:linux": "npm run build -- --linux --publish never",
    "pack:linux:deploy": "npm run build -- --linux --publish always"
    // ...
  },
  // ...
}
```

8. electron-builder-config.js 파일 생성 후 아래와 같이 작성
```
require('dotenv').config();

/** @type {import('electron-builder').Configuration} */
const config = {
  productName: "electron-sample",
  appId: "electron-sample",
  asar: true,
  protocols: {
    name: "electron-sample",
    schemes: [ 
      'electron-sample',
    ],
  },
  publish: { 
    provider: "s3",
    bucket: process.env.S3_DEPLOY_BUCKET_NAME,
    region: process.env.S3_DEPLOY_BUCKET_REGION,
    acl: "public-read",
  },
  mac: {
    target: [
      "default",
    ],
  },
  dmg: {
    title: "tournant",
  },
  win: {
    target: [
      "zip",
      "nsis",
    ],
  },
  linux: {
    target: [
      "AppImage",
      "deb",
      "rpm",
      "zip",
      "tar.gz",
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: false,
    installerLanguages: [
      "en_US",
      "ko_KR",
    ],
    language: "1042",
  },
  files: [
    "build/**/*",
    "package.json",
  ],
  directories: {
    output: "build",
    app: ".",
  },
};

module.exports = config;
```

9. .env.sample 파일을 .env 으로 이름 변경 후 key 에 맞는 값 작성

| key | description |
| --- | --- | 
| S3_DEPLOY_BUCKET_NAME | 배포목적지버킷이름 |
| S3_DEPLOY_BUCKET_REGION | 배포목적지버킷리전 |

* 본 레포지토리에서는 .env 파일이 일렉트론 패키징 될 때 포함되게 설정되어 있습니다. 그러므로 클라이언트에 노출 되면 안되는 값들은 .env 파일에 기재하면 안되며 별도로 관리 해주어야 합니다.

10. AWS-CLI 설치

https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html

11. aws 환경설정 진행
```
aws configure
```
- AWS Access Key ID : 엑세스키 입력
- AWS Secret Access Key : 시크릿키 입력
- Default region name : 리전 입력
- Default output format : json

(한국 리전은 "ap-northeast-2" 입니다.)<br />
이제 이 pc 에서 s3 에 업로드 가능

12. 이제 아래 명령어들로 패키징 및 배포 가능

-- window 앱으로 패키징
```
npm run pack:win
```
<br />

-- window 앱으로 패키징하고 s3에 배포하기
```
npm run pack:win:deploy
```
<br />

-- mac 앱으로 패키징
```
npm run pack:mac
```
<br />

-- mac 앱으로 패키징하고 s3에 배포하기
```
npm run pack:mac:deploy
```
<br />

-- linux 앱으로 패키징
```
npm run pack:linux
```
<br />

-- linux 앱으로 패키징하고 s3에 배포하기
```
npm run pack:linux:deploy
```
<br />

# 자동 업데이트 구성 과정 (electron-updater)
내용 준비중...