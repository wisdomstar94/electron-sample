// const builder = require("electron-builder");
const path = require('path');
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

// builder.build({ config });
module.exports = config;
