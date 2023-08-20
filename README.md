# electron-sample
본 레포지토리는 일렉트론 샘플 프로젝트 입니다. 프론트는 리액트를 사용합니다.

<br /><br />

# .env 설정
본 레포지토리에 있는 `.env.example` 파일과 `.env.development.sample` 파일을 각각 `.env`, `.env.development` 으로 이름을 변경한 뒤 `ELECTRON_IS_DEV` 를 제외한 항목들의 내용을 입력해줍니다. 
<br /><br />
본 레포지토리에서 `.env` 파일 또는 `.env.development` 파일은 앱이 패키징 될 때 같이 포함되도록 설정되어 있으므로 클라이언트에 노출되지 말아야 할 데이터는 별도로 관리해주셔야 합니다.

<br /><br />

# 프론트엔드
프론트는 리액트를 사용하여 구성하였고, 여기에 tailwindcss 를 적용하였습니다.

<br /><br />

# 앱 아이콘
앱 아이콘은 `src-electorn/assets/icons/` 폴더의 `app-icon.png` (512 x 512) 으로 빌드가 되게 셋팅되어 있습니다. 현재 MacOS 에서만 테스트를 진행해보았으며, 추후 Window 에서도 테스트를 진행해볼 예정입니다.

<br /><br />

# 업데이트 기능
업데이트 기능은 `electron-updater` 패키지를 활용하여 구성하였습니다. 리액트로 아래 페이지에 대한 샘플을 구현하였습니다.

| 페이지 | 설명 |
| --- | --- | 
| 업데이트 파일 다운로드 현황 페이지 | 업데이트 가능하다고 감지된 경우 바로 다운로드가 시작되며, 다운로드가 시작되면 해당 페이지가 표시되며 다운로드 된 퍼센트 데이터가 표시됩니다. |
| 업데이트 확인 페이지 | 업데이트 파일이 다운로드 완료 되었으면 본 페이지가 표시되며 업데이트를 시작할 것인지 묻는 내용이 표시됩니다. | 

<br />

업데이트 부분에 대한 커스텀이 필요하시다면 `src-electron/auto-update/auto-update.ts` 파일을 수정하시면 됩니다.

<br /><br />

# 업데이트 테스트 방법
이전 버전의 앱에서는 업데이트 기능이 정상적으로 작동하고, 현재(새로운) 버전의 앱에서는 모종의 이유로 인해 업데이트 기능이 정상적으로 작동하지 않는 상태에서 현재(새로운) 버전의 앱을 s3 로 배포하게 되면, 이전 버전의 앱에서는 업데이트 체크 후 현재(새로운) 버전으로 업데이트가 되는데 이 때 업데이트 된 버전에서는 업데이트 부분이 제대로 동작하지 않으므로 추후 수정된 버전을 재배포하더라도 새로운 버전으로 업데이트 되도록 하는 것이 불가능해집니다. 이러한 상황을 방지하기 위해서는 업데이트 부분에 대한 테스트가 반드시 필요한데, 본 레포지토리에서는 해당 부분에 대한 것도 고려하였습니다.

1. 업데이트 테스트를 위한 s3 버킷을 별도로 생성한 후 해당 버킷에 대한 정보를 `.env`, `.env.development` 에 기재합니다.

2. package.json 의 version 을 현재(새로운) 버전보다 한단계 높은 버전으로 설정한 뒤에(ex. 0.0.7(current) -> 0.0.8) 아래 명령어를 실행하여 dev mode 로 패키징하고 테스트용 s3 버킷에 배포합니다.
```
pack:win:dev:deploy
```
또는
```
pack:mac:dev:deploy
```
또는
```
pack:linux:dev:deploy
```
<br />
※ 여기서 말하는 현재(새로운, current) 버전이란 아직 실서비스용 s3에 배포는 되지 않았고, 앞으로 배포가 될 예정인 버전을 칭합니다. 
<br /><br />

3. package.json 의 version 을 다시 원래의 현재(새로운) 버전으로 변경한 뒤(ex. 0.0.8 -> 0.0.7(current)) 아래 명령어를 통해 배포는 하지 않으면서 로컬에 dev mode 로 패키징 합니다.
```
pack:win:dev
```
또는
```
pack:mac:dev
```
또는
```
pack:linux:dev
```

4. 패키징이 완료된 후 `build/` 폴더 밑에 생성된 애플리케이션을 설치 또는 실행합니다.

5. 테스트용 s3 버킷에 올라간 버전으로 정상적으로 업데이트가 잘 되는지 확인합니다. <br />

※ 업데이트가 잘 되었는지 확인하는 방법은, dev mode 로 패키징 된 경우는 개발자 도구를 열수 있도록 설정해 놓았으며 그렇기 때문에 단축키로 개발자 도구를 연 후 console.log 창에 표시 된 `info` 의 데이터의 `currentVersion` 에 표시된 버전을 확인해보면 됩니다. (해당 로그는 `electron.ts` 파일의 `mainWindow.once('ready-to-show', ...)` 콜백 부분에서 앱이 실행 될 때 초기 표시되는 페이지에 전달하는 이벤트에 의해 표시됩니다.)

<br /><br />

# 메인 프로세스와 렌더러 프로세스의 채널과 데이터간 타입추론
일렉트론은 메인 프로세스(Node.js 영역)와 렌더러 프로세스(브라우저 영역)로 나뉘는데, 이 두 프로세스간 채널을 통해 통신할 때 각 채널별로 주고 받을 데이터에 대한 타입 추론이 되도록 셋팅하였습니다. 
<br /><br />
`interface/channel.interface.ts` 파일에 보면 `IChannel` 네임스페이스 밑에 렌더러 프로세스에서 리스닝 가능한 채널과 데이터의 규격 정보가 맵핑되어 있는 `RendererChannelMap` 인터페이스, 메인 프로세스에서 리스닝 가능한 채널과 데이터의 규격 정보가 맵핑되어 있는 `MainChannelMap` 인터페이스가 존재합니다. 
<br /><br />
이 레포지토리를 사용하여 일렉트론 앱을 개발 하실 때, 채널에 대한 데이터 규격을 수정하시려면 `interface/channel.interface.ts` 파일을 수정하시면 됩니다.

<br /><br />

# BrowserWindow 사용시 webPreferences 에는 webPreferencesWithDefaultOptions 사용
본 레포지토리에는 `src-electron/utils/common.ts` 파일에 `webPreferencesWithDefaultOptions` 라는 함수를 만들어놓았습니다. 해당 함수에는 `BrowserWindow` 로 새로운 창을 생성할 때 `webPreferences` 인자에 들어가야할 기본 값들이 명시되어 있습니다. 그러므로 `BrowserWindow` 를 사용하실 땐 `webPreferencesWithDefaultOptions` 함수를 세트로 같이 사용해주시면 됩니다. 예시는 `electron.ts` 파일을 참조하시면 됩니다.

<br /><br />

# 리액트와 일렉트론
리액트 관련 소스들은 `src/` 폴더 밑에 위치해 있고, 일렉트론 관련 소스들은 `src-electron/` 폴더 밑에 위치해 있습니다.

<br /><br />

# package.json script 설명
| 스크립트 | 설명 |
| --- | --- |
| react:start | 리액트를 로컬에서 테스트하는 용도로 실행하는 스크립트 입니다. | 
| react:build | 리액트를 index.html 등의 파일들로 빌드하는 스크립트 입니다. | 
| electron:start | 일렉트론을 로컬에서 테스트하는 용도로 실행하는 스크립트 입니다. | 
| electron:build | 일렉트론을 .js 등의 파일들로 빌드하는 스크립트 입니다. | 
| electron:react-wait:start | `wait-on` 패키지를 활용하여, `http://127.0.0.1:3000` 에 대한 정상 응답이 올 때까지 기다리고(즉, 로컬에 리액트가 구동 완료 될 때까지 기다리는 것), 정상 응답이 온 이후에 `electron:start` 스크립트를 실행하는 스크립트 입니다. |
| dev | `build/` 폴더를 삭제 후, 일렉트론을 빌드하고 `build/` 폴더로 `.env` 파일을 복사합니다. 그리고 `concurrently` 패키지를 활용하여 리액트를 로컬에서 구동하고, 구동이 완료되면 일렉트론도 로컬에서 구동되며 일렉트론 앱이 실행되어집니다. (즉, 리액트와 일렉트론 모두 로컬 구동하여 all-in-one 으로 로컬에서 테스트 하고자 한다면 이 스크립트를 실행하시면 됩니다.) |
| copy:env | `.env` 파일을 `build/` 폴더로 복사하는 스크립트 입니다. | 
| copy:env:dev | `.env.development` 파일을 `.env` 라는 이름으로 `build/` 폴더로 복사하는 스크립트 입니다. | 
| del:build | `build/` 폴더를 삭제하는 스크립트 입니다. |
| build | 일랙트론과 리액트를 모두 빌드하는 스크립트 입니다. | 
| pack | `build` 스크립트를 실행하되 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:deploy | `build` 스크립트를 실행하되 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:dev | `build` 스크립트를 실행하되 dev mode 로 빌드하며 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:dev:deploy | `build` 스크립트를 실행하되 dev mode 로 빌드하며 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config-dev.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. (주로 업데이트를 테스트 할 때 사용되는 스크립트 입니다.) |
| pack:win | `build` 스크립트를 실행하되 `window` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:win:deploy | `build` 스크립트를 실행하되 `window` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:win:dev | `build` 스크립트를 실행하되 `window` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:win:dev:deploy | `build` 스크립트를 실행하되 `window` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config-dev.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. (주로 업데이트를 테스트 할 때 사용되는 스크립트 입니다.) |
| pack:mac | `build` 스크립트를 실행하되 `mac` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:mac:deploy | `build` 스크립트를 실행하되 `mac` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:mac:dev | `build` 스크립트를 실행하되 `mac` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:mac:dev:deploy | `build` 스크립트를 실행하되 `mac` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config-dev.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. (주로 업데이트를 테스트 할 때 사용되는 스크립트 입니다.) |
| pack:linux | `build` 스크립트를 실행하되 `linux` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:linux:deploy | `build` 스크립트를 실행하되 `linux` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:linux:dev | `build` 스크립트를 실행하되 `linux` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:linux:dev:deploy | `build` 스크립트를 실행하되 `linux` 앱으로, dev mode 로 빌드하며 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config-dev.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. (주로 업데이트를 테스트 할 때 사용되는 스크립트 입니다.) |

<br /><br />

# s3 버킷 설정
일렉트론 앱으로 패키징한 파일들은 s3로 업로드 되도록 설정되어 있습니다. 그래서 다음과 같이 버킷 설정이 필요합니다.

1. AWS s3 페이지에 접속하여 버킷 생성

https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2#

2. 버킷에 아래 권한 정책 적용
```
{
  "Version": "2012-10-17",
  "Statement": [
    // 아래 Deny 는 필요 시 설정하세요! 필요 없다면 아래 Deny 정책 부분은 제거하셔도 좋습니다.
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "*",
      "Resource": "arn:aws:s3:::버킷이름/*",
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": "접근허용IP"
        }
      }
    },
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
      "Resource": "arn:aws:s3:::버킷이름/*"
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "arn:aws:s3:::버킷이름"
    }
  ]
}
```

3. 버킷의 객체 소유권을 "ACL 활성화됨" 으로 설정
- "ACL이 복원된다는 것을 확인합니다." 에 체크
- 객체 소유권은 "버킷 소유자 선호" 선택

4. 실서비스용과 테스트용이 필요하므로 총 2개 s3 버킷을 생성하시면 됩니다.

<br /><br />

# aws cli 설정 (s3로 배포하기 위해 필요한 단계)

1. aws iam 에서 사용자 및 키 생성

https://us-east-1.console.aws.amazon.com/iamv2/home?region=ap-northeast-2#/users/create

2. [사용자] -> <u>생성한 사용자이름</u> -> [보안 자격 증명] 에 들어가 엑세스 키를 생성
- 사용 사례는 "Command Line Interface(CLI)" 을 선택합니다.

3. 사용자의 권한에 아래 JSON 정책 내용을 추가합니다.
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
			"Resource": "arn:aws:s3:::버킷이름/*"
		}
	]
}
```

4. AWS-CLI 설치

https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html

5. aws 환경설정 진행
```
aws configure
```
- AWS Access Key ID : 엑세스키 입력
- AWS Secret Access Key : 시크릿키 입력
- Default region name : 리전 입력
- Default output format : json

(한국 리전은 "ap-northeast-2" 입니다.)<br />
이제 이 pc 에서 s3 에 업로드 가능

<br /><br />

# 본 레포지토리 구성에 도움을 준 블로그 및 답변들

| 링크 | 도움을 받은 부분 |
| --- | --- | 
| https://kimbiyam.me/posts/react/react-typescript-electron-settings | Electron + Typescript + React 환경을 구축하는데 필요한 부분들이 무엇이 있는지 많은 참고가 되었습니다. |
| https://mynameishomin.com/reacteseo-tailwind/ | react 에 tailwindcss 설정을 하는데 있어 많은 참고가 되었습니다. | 
| https://stackoverflow.com/a/76926224/20313047 | 메인 프로세스와 렌더러 프로세스간 채널별로 데이터(payload)들도 각각 타입추론이 되게 하고 싶었는데, 이 답변으로 구현할 수 있었습니다. | 
