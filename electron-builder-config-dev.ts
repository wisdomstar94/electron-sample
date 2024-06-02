import { Configuration } from "electron-builder";
import path from 'path';
import { config } from 'dotenv';

config({
  path: path.join(__dirname, '.env.development'),
});

const defaultConfig: Configuration = {
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
    bucket: process.env.S3_DEV_DEPLOY_BUCKET_NAME ?? '',
    region: process.env.S3_DEV_DEPLOY_BUCKET_REGION,
    acl: "public-read",
  },
  icon: path.join(__dirname, 'src-electron', 'assets', 'icons', 'app-icon.png'),
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
    installerLanguages: [
      "en_US",
      "ko_KR",
    ],
    language: "1042",
  },
  files: [
    "dist/**/*",
    "package.json",
  ],
  extraMetadata: {
    main: `dist/electron.js`,
  },
  directories: {
    output: "build",
    app: ".",
  },
};

export default defaultConfig;
