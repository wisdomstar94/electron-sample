# electron-sample
본 레포지토리는 일렉트론 샘플 프로젝트 입니다. 프론트는 리액트를 사용합니다.

<br /><br />

# 프론트엔드
프론트는 리액트를 사용하여 구성하였고, 여기에 tailwindcss 를 적용하였습니다.

<br /><br />

# 업데이트 기능
업데이트 기능은 `electron-updater` 패키지를 활용하여 구성하였습니다. 리액트로 아래 페이지에 대한 샘플을 구현하였습니다.

| 페이지 | 설명 |
| --- | --- | 
| 업데이트 파일 다운로드 현황 페이지 | 업데이트 가능하다고 감지된 경우 바로 다운로드가 시작되며, 다운로드가 시작되면 해당 페이지가 표시되며 다운로드 된 퍼센트 데이터가 표시됩니다. |
| 업데이트 확인 페이지 | 업데이트 파일이 다운로드 완료 되었으면 본 페이지가 표시되며 업데이트를 시작할 것인지 묻는 내용이 표시됩니다. | 

<br /><br />

# 메인 프로세스와 렌더러 프로세스의 채널과 데이터간 타입추론
일렉트론은 메인 프로세스(Node.js 영역)와 렌더러 프로세스(브라우저 영역)로 나뉘는데, 이 두 프로세스간 채널을 통해 통신할 때 각 채널별로 주고 받을 데이터에 대한 타입 추론이 되도록 셋팅하였습니다. 
<br /><br />
`interface/channel.interface.ts` 파일에 보면 `IChannel` 네임스페이스 밑에 렌더러 프로세스에서 리스닝 가능한 채널과 데이터의 규격 정보가 맵핑되어 있는 `RendererChannelMap` 인터페이스, 메인 프로세스에서 리스닝 가능한 채널과 데이터의 규격 정보가 맵핑되어 있는 `MainChannelMap` 인터페이스가 존재합니다. 
<br /><br />
이 레포지토리를 사용하여 일렉트론 앱을 개발 하실 때, 채널에 대한 데이터 규격을 수정하시려면 `interface/channel.interface.ts` 파일을 수정하시면 됩니다.

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
| dev | `build/` 폴더를 삭제 후, 일렉트론을 빌드하고 `build/` 폴더로 `.env` 파일을 복사합니다. 그리고 `concurrently` 패키지를 활용하여 리액트를 로컬에서 구동하고, 구동이 완료되면 일렉트론도 로컬에서 구동되며 일렉트론 앱이 실행되어집니다. |
| copy:env | `.env` 파일을 `build/` 폴더로 복사하는 스크립트 입니다. | 
| del:build | `build/` 폴더를 삭제하는 스크립트 입니다. |
| build | 일랙트론과 리액트를 모두 빌드하는 스크립트 입니다. | 
| pack | `build` 스크립트를 실행하되 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:deploy | `build` 스크립트를 실행하되 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:win | `build` 스크립트를 실행하되 `window` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:win:deploy | `build` 스크립트를 실행하되 `window` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:mac | `build` 스크립트를 실행하되 `mac` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:mac:deploy | `build` 스크립트를 실행하되 `mac` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |
| pack:linux | `build` 스크립트를 실행하되 `linux` 앱으로 빌드하고 `publish` 옵션을 `never` 로 지정하여 실행합니다. |
| pack:linux:deploy | `build` 스크립트를 실행하되 `linux` 앱으로 빌드하고 `publish` 옵션을 `always` 로 지정하여 실행합니다. `electron-builder-config.js` 파일의 `publish` 부분에 설정된 곳으로 빌드된 결과물이 업로드 됩니다. |

