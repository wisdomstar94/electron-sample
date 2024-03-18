import '../../electron.dotenv';
import electron from 'electron';

if (typeof electron === 'string') {
	throw new TypeError('Not running in an Electron environment!');
}

const { env } = process; 
const isEnvSet = 'ELECTRON_IS_DEV' in env;
const getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV ?? '', 10) === 1;

const _isDev = isEnvSet ? getFromEnv : !electron.app.isPackaged;
export const isDev = _isDev;
